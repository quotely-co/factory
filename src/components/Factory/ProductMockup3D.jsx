import { useState, useCallback, useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import Mug from "../../assets/model1.glb"

const ProductMockup3D = ({ isOpen, onClose }) => {
  // Refs for DOM elements
  const containerRef = useRef(null)
  const imageSelectorRef = useRef(null)
  const colorSelectorRef = useRef(null)

  // Refs for Three.js objects that need to persist between renders
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const orbitControlsRef = useRef(null)
  const meshRef = useRef(null)
  const decalGeometryRef = useRef(null)
  const materialRef = useRef(null)

  // If modal is not open, don't render anything
  if (!isOpen) return null

  // Initialize Three.js scene
  const initScene = useCallback(() => {
    if (!containerRef.current) return

    // Create scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      20,
      1000 / 1000,
      1e-5,
      1e10
    )
    cameraRef.current = camera
    scene.add(camera)

    // Add lighting
    const hemispheric = new THREE.HemisphereLight(0xffffff, 0x222222, 1)
    scene.add(hemispheric)

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      logarithmicDepthBuffer: true,
      alpha: true,
    })
    renderer.setClearColor(0x131316, 0)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(800, 800)
    renderer.outputEncoding = THREE.sRGBEncoding
    rendererRef.current = renderer

    // Add canvas to DOM
    containerRef.current.appendChild(renderer.domElement)

    // Setup orbit controls
    const orbitControls = new OrbitControls(camera, renderer.domElement)
    orbitControlsRef.current = orbitControls

    return { scene, camera, renderer, orbitControls }
  }, [])

  // Load the 3D model
  const loadModel = useCallback(() => {
    if (!sceneRef.current || !cameraRef.current || !orbitControlsRef.current) return

    const scene = sceneRef.current
    const camera = cameraRef.current
    const orbitControls = orbitControlsRef.current

    const loader = new GLTFLoader()
    const cameraPos = new THREE.Vector3(-0.2, 0.1, 1.4)

    loader.load(
      Mug,
      (gltf) => {
        const object = gltf.scene

        // Setup environment
        if (rendererRef.current) {
          const pmremGenerator = new THREE.PMREMGenerator(rendererRef.current)
          pmremGenerator.compileEquirectangularShader()
        }

        // Center model based on bounding box
        object.updateMatrixWorld()
        const boundingBox = new THREE.Box3().setFromObject(object)
        const modelSizeVec3 = new THREE.Vector3()
        boundingBox.getSize(modelSizeVec3)
        const modelSize = modelSizeVec3.length()
        const modelCenter = new THREE.Vector3()
        boundingBox.getCenter(modelCenter)

        // Configure orbit controls
        orbitControls.reset()
        orbitControls.maxDistance = modelSize * 50
        orbitControls.enableDamping = true
        orbitControls.dampingFactor = 0.07
        orbitControls.rotateSpeed = 1.25
        orbitControls.panSpeed = 1.25
        orbitControls.screenSpacePanning = true
        orbitControls.autoRotate = true

        // Position camera and model
        object.position.x = -modelCenter.x
        object.position.y = -modelCenter.y
        object.position.z = -modelCenter.z
        camera.position.copy(modelCenter)
        camera.position.x += modelSize * cameraPos.x
        camera.position.y += modelSize * cameraPos.y
        camera.position.z += modelSize * cameraPos.z
        camera.near = modelSize / 100
        camera.far = modelSize * 100
        camera.updateProjectionMatrix()
        camera.lookAt(modelCenter)

        // Process the model meshes
        object.traverse((obj) => {
          if (obj instanceof THREE.Mesh && obj.name === "Mug_Porcelain_PBR001_0") {
            materialRef.current = obj.material
            meshRef.current = obj

            setupTextureSelector()
          } else if (obj instanceof THREE.Mesh && obj.name === "Mug_Porcelain_PBR002_0") {
            const material = obj.material

            setupColorSelector(material)
          }
        })
        scene.add(object)
      },
      (error) => {
        console.error(error)
      }
    )
  }, [])

  // Handle texture selection
  const setupTextureSelector = useCallback(() => {
    if (!imageSelectorRef.current || !materialRef.current) return

    const handleTextureChange = (event) => {
      if (materialRef.current) {
        materialRef.current.map = convertImageToTexture(URL.createObjectURL(event.target.files[0]))
      }
    }
    imageSelectorRef.current.addEventListener("input", handleTextureChange)

    // Store cleanup function for later
    return () => {
      if (imageSelectorRef.current) {
        imageSelectorRef.current.removeEventListener("input", handleTextureChange)
      }
    }
  }, [])

  // Handle color selection
  const setupColorSelector = useCallback((material) => {
    if (!colorSelectorRef.current) return

    const handleColorChange = (event) => {
      material.color.set(event.target.value)
    }

    colorSelectorRef.current.addEventListener("input", handleColorChange)

    // Store cleanup function for later
    return () => {
      if (colorSelectorRef.current) {
        colorSelectorRef.current.removeEventListener("input", handleColorChange)
      }
    }
  }, [])

  // Convert image URL to Three.js texture
  const convertImageToTexture = useCallback((imageUrl) => {
    const textureLoader = new THREE.TextureLoader()
    const texture = textureLoader.load(imageUrl)
    texture.encoding = THREE.sRGBEncoding
    texture.flipY = true
    texture.wrapS = THREE.RepeatWrapping
    return texture
  }, [])

  // Animation loop
  const animate = useCallback(() => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !orbitControlsRef.current) return

    const scene = sceneRef.current
    const camera = cameraRef.current
    const renderer = rendererRef.current
    const orbitControls = orbitControlsRef.current

    const animationId = requestAnimationFrame(animate)

    orbitControls.update()
    renderer.render(scene, camera)

    // Return the animation ID for cleanup
    return animationId
  }, [])

  // Initialize everything
  useEffect(() => {
    if (isOpen) {
      initScene()
      loadModel()

      const animationId = animate()

      // Cleanup function
      return () => {
        // Cancel animation frame
        if (animationId) {
          cancelAnimationFrame(animationId)
        }
        // Remove the renderer from DOM
        if (rendererRef.current && containerRef.current) {
          containerRef.current.removeChild(rendererRef.current.domElement)
        }
        // Dispose Three.js resources
        if (rendererRef.current) {
          rendererRef.current.dispose()
        }
        if (decalGeometryRef.current) {
          decalGeometryRef.current.dispose()
        }
      }
    }
  }, [isOpen, initScene, loadModel, animate])

  const download = () => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return

    const renderer = rendererRef.current
    const scene = sceneRef.current
    const camera = cameraRef.current

    // Ensure orbit controls are updated
    if (orbitControlsRef.current) {
      orbitControlsRef.current.update()
    }

    // Force a render pass to ensure the scene is up-to-date
    renderer.render(scene, camera)

    // Create a new canvas for capturing the image
    const captureCanvas = document.createElement("canvas")
    captureCanvas.width = renderer.domElement.width
    captureCanvas.height = renderer.domElement.height
    const context = captureCanvas.getContext("2d")

    // Draw the WebGL canvas to our capture canvas
    context.drawImage(renderer.domElement, 0, 0)

    // Convert the canvas to a data URL (PNG format with transparency)
    // Using maximum quality (1.0)
    const dataURL = captureCanvas.toDataURL("image/png", 1.0)

    // Create a temporary anchor element to trigger the download
    const link = document.createElement("a")
    link.href = dataURL
    link.download = "custom-mug.png"

    // Append to body, click to download, then remove
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-screen overflow-auto">
        {/* Modal header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Custom Mug Designer</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Modal content */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Preview container */}
            <div className="flex-1">
            <div ref={containerRef} className="w-full h-full md:h-full bg-black rounded-lg" />
            </div>
            
            {/* Controls */}
            <div className="w-full md:w-64 space-y-8">
              <div className="space-y-2">
                <h4 className="text-lg font-medium flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white mr-2">1</span>
                  Upload Image
                </h4>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm text-gray-500">Click to upload image</p>
                    </div>
                    <input 
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={imageSelectorRef}
                    />
                  </label>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-lg font-medium flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white mr-2">2</span>
                  Choose Color
                </h4>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    ref={colorSelectorRef}
                    defaultValue="#ffffff"
                    className="w-12 h-12 rounded cursor-pointer"
                  />
                  <span className="text-gray-600">Select mug color</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-lg font-medium flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white mr-2">3</span>
                  Download Design
                </h4>
                <button
                  onClick={download}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition duration-150 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Image
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductMockup3D