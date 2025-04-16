import { useState, useCallback, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import Mug from "../../assets/model1.glb";

const ProductMockup3D = ({ isOpen, onClose }) => {
  // State for loading and error handling
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState("#ffffff");
  const [autoRotate, setAutoRotate] = useState(true);

  // Refs for DOM elements
  const containerRef = useRef(null);
  const imageSelectorRef = useRef(null);
  const colorSelectorRef = useRef(null);

  // Refs for Three.js objects that need to persist between renders
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const orbitControlsRef = useRef(null);
  const meshRef = useRef(null);
  const materialRef = useRef(null);
  const handleColorRef = useRef(null);
  const handleTextureRef = useRef(null);
  const cleanupFunctionsRef = useRef([]);
  const animationIdRef = useRef(null);
  const mugColorMaterialRef = useRef(null);

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  // Initialize Three.js scene
  const initScene = useCallback(() => {
    if (!containerRef.current) return null;

    try {
      // Create scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf5f5f5);
      sceneRef.current = scene;

      // Create camera
      const camera = new THREE.PerspectiveCamera(
        25,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        1000
      );
      cameraRef.current = camera;
      scene.add(camera);

      // Add lighting
      const hemispheric = new THREE.HemisphereLight(0xffffff, 0x222222, 1);
      scene.add(hemispheric);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(0, 5, 10);
      scene.add(directionalLight);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
      scene.add(ambientLight);

      // Setup renderer
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      renderer.setClearColor(0xf5f5f5, 1);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      rendererRef.current = renderer;

      // Add canvas to DOM
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(renderer.domElement);

      // Setup orbit controls
      const orbitControls = new OrbitControls(camera, renderer.domElement);
      orbitControls.enableDamping = true;
      orbitControls.dampingFactor = 0.07;
      orbitControls.panSpeed = 1.25;
      orbitControls.screenSpacePanning = true;
      orbitControls.autoRotate = autoRotate;
      orbitControls.autoRotateSpeed = 2.0;
      orbitControlsRef.current = orbitControls;

      return { scene, camera, renderer, orbitControls };
    } catch (err) {
      console.error("Error initializing scene:", err);
      setError("Failed to initialize the 3D viewer");
      return null;
    }
  }, [autoRotate]);

  // Handle window resize
  const handleResize = useCallback(() => {
    if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    rendererRef.current.setSize(width, height);
    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
  }, []);

  // Load the 3D model
  const loadModel = useCallback(() => {
    if (!sceneRef.current || !cameraRef.current || !orbitControlsRef.current) return;

    setIsLoading(true);
    setError(null);

    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const orbitControls = orbitControlsRef.current;

    try {
      const loader = new GLTFLoader();
      const cameraPos = new THREE.Vector3(-0.2, 0.1, 1.4);

      loader.load(
        Mug,
        (gltf) => {
          const object = gltf.scene;

          // Setup environment for PBR materials
          if (rendererRef.current) {
            const pmremGenerator = new THREE.PMREMGenerator(rendererRef.current);
            pmremGenerator.compileEquirectangularShader();
          }

          // Center model based on bounding box
          object.updateMatrixWorld();
          const boundingBox = new THREE.Box3().setFromObject(object);
          const modelSizeVec3 = new THREE.Vector3();
          boundingBox.getSize(modelSizeVec3);
          const modelSize = modelSizeVec3.length();
          const modelCenter = new THREE.Vector3();
          boundingBox.getCenter(modelCenter);

          // Configure orbit controls
          orbitControls.reset();
          orbitControls.maxDistance = modelSize * 5;
          orbitControls.minDistance = modelSize * 1.2;

          // Position camera and model
          object.position.x = -modelCenter.x;
          object.position.y = -modelCenter.y;
          object.position.z = -modelCenter.z;
          camera.position.copy(modelCenter);
          camera.position.x += modelSize * cameraPos.x;
          camera.position.y += modelSize * cameraPos.y;
          camera.position.z += modelSize * cameraPos.z;
          camera.near = modelSize / 100;
          camera.far = modelSize * 100;
          camera.updateProjectionMatrix();
          camera.lookAt(modelCenter);

          // Process the model meshes
          object.traverse((obj) => {
            if (obj instanceof THREE.Mesh && obj.name === "Mug_Porcelain_PBR001_0") {
              // This is the main mug surface for image placement
              materialRef.current = obj.material;
              meshRef.current = obj;

              // If there's a previously selected image, apply it
              if (selectedImage) {
                materialRef.current.map = convertImageToTexture(selectedImage);
              }
            } else if (obj instanceof THREE.Mesh && obj.name === "Mug_Porcelain_PBR002_0") {
              // This is the colored part of the mug
              mugColorMaterialRef.current = obj.material;
              mugColorMaterialRef.current.color.set(selectedColor);
            }
          });
          
          scene.add(object);
          setIsLoading(false);
        },
        (progress) => {
          // Could implement a loading progress indicator here
        },
        (error) => {
          console.error("Error loading model:", error);
          setError("Failed to load the 3D model");
          setIsLoading(false);
        }
      );
    } catch (err) {
      console.error("Error in load model function:", err);
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  }, [selectedImage, selectedColor]);

  // Convert image URL to Three.js texture
  const convertImageToTexture = useCallback((imageUrl) => {
    try {
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load(imageUrl);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.flipY = false; // Usually GLB models expect non-flipped textures
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      return texture;
    } catch (err) {
      console.error("Error creating texture:", err);
      return null;
    }
  }, []);

  // Handle texture selection
  const handleTextureChange = useCallback((event) => {
    if (!event.target.files || !event.target.files[0]) return;
    
    const file = event.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    
    if (materialRef.current) {
      materialRef.current.map = convertImageToTexture(imageUrl);
      materialRef.current.needsUpdate = true;
    }
  }, [convertImageToTexture]);

  // Handle color selection
  const handleColorChange = useCallback((event) => {
    const color = event.target.value;
    setSelectedColor(color);
    
    if (mugColorMaterialRef.current) {
      mugColorMaterialRef.current.color.set(color);
      mugColorMaterialRef.current.needsUpdate = true;
    }
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !orbitControlsRef.current) return;

    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const renderer = rendererRef.current;
    const orbitControls = orbitControlsRef.current;

    const animationLoop = () => {
      animationIdRef.current = requestAnimationFrame(animationLoop);
      orbitControls.update();
      renderer.render(scene, camera);
    };

    animationLoop();
  }, []);

  // Download rendered image
  const download = () => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    try {
      const renderer = rendererRef.current;
      const scene = sceneRef.current;
      const camera = cameraRef.current;

      // Force a render pass with white background
      const originalBackground = scene.background;
      scene.background = new THREE.Color(0xffffff);
      renderer.render(scene, camera);

      // Create a data URL from the renderer's canvas
      const dataURL = renderer.domElement.toDataURL("image/png", 1.0);

      // Restore original background
      scene.background = originalBackground;
      renderer.render(scene, camera);

      // Create and trigger download
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "custom-mug.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error downloading image:", err);
      alert("Failed to download the image. Please try again.");
    }
  };

  // Toggle auto-rotation
  const toggleAutoRotate = () => {
    if (orbitControlsRef.current) {
      const newState = !autoRotate;
      setAutoRotate(newState);
      orbitControlsRef.current.autoRotate = newState;
    }
  };

  // Initialize everything
  useEffect(() => {
    if (isOpen) {
      const sceneData = initScene();
      if (sceneData) {
        // Add event listeners
        window.addEventListener("resize", handleResize);
        if (imageSelectorRef.current) {
          imageSelectorRef.current.addEventListener("change", handleTextureChange);
        }
        if (colorSelectorRef.current) {
          colorSelectorRef.current.addEventListener("input", handleColorChange);
        }
        
        // Load the model
        loadModel();
        
        // Start animation loop
        animate();
      }

      // Cleanup function
      return () => {
        // Remove event listeners
        window.removeEventListener("resize", handleResize);
        if (imageSelectorRef.current) {
          imageSelectorRef.current.removeEventListener("change", handleTextureChange);
        }
        if (colorSelectorRef.current) {
          colorSelectorRef.current.removeEventListener("input", handleColorChange);
        }
        
        // Cancel animation frame
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current);
        }
        
        // Clean up Three.js resources
        if (rendererRef.current) {
          rendererRef.current.dispose();
        }
        
        // Clean up materials and textures
        if (materialRef.current && materialRef.current.map) {
          materialRef.current.map.dispose();
        }
        
        // Run any additional cleanup functions
        cleanupFunctionsRef.current.forEach(fn => fn());
      };
    }
  }, [isOpen, initScene, loadModel, animate, handleResize, handleTextureChange, handleColorChange]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800">Design Your Custom Mug</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-200"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Modal content */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 h-full">
            {/* Preview container - 2/3 width on larger screens */}
            <div className="md:col-span-2 relative h-96 md:h-[500px] bg-gray-50 rounded-lg shadow-inner">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75 z-10">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                </div>
              )}
              
              {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-lg">
                  <div className="text-red-600 text-center p-4">
                    <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="font-medium">{error}</p>
                    <button 
                      className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      onClick={loadModel}
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}
              
              <div ref={containerRef} className="w-full h-full" />
              
              {/* Controls overlay */}
              <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm rounded-full shadow-md p-2">
                <button 
                  onClick={toggleAutoRotate}
                  className={`p-2 rounded-full ${autoRotate ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'} hover:bg-blue-200 transition-colors`}
                  title={autoRotate ? "Stop Rotation" : "Start Rotation"}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Controls - 1/3 width on larger screens */}
            <div className="space-y-6">
              {/* Upload Image Section */}
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                <h4 className="text-lg font-medium flex items-center mb-3 text-gray-800">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white mr-3 flex-shrink-0">1</span>
                  Upload Your Design
                </h4>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-10 h-10 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {selectedImage ? (
                        <p className="text-sm text-green-600 font-medium">Image uploaded</p>
                      ) : (
                        <p className="text-sm text-gray-500">Click to upload JPG, PNG</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">Recommended: 800x800px</p>
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
              
              {/* Choose Color Section */}
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                <h4 className="text-lg font-medium flex items-center mb-3 text-gray-800">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white mr-3 flex-shrink-0">2</span>
                  Choose Handle Color
                </h4>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    ref={colorSelectorRef}
                    defaultValue={selectedColor}
                    className="w-12 h-12 rounded-md cursor-pointer border border-gray-300"
                  />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select color</label>
                    <div className="flex gap-2">
                      {["#ffffff", "#000000", "#e53e3e", "#3182ce", "#38a169", "#d69e2e"].map(color => (
                        <button
                          key={color}
                          onClick={() => {
                            setSelectedColor(color);
                            if (colorSelectorRef.current) colorSelectorRef.current.value = color;
                            if (mugColorMaterialRef.current) {
                              mugColorMaterialRef.current.color.set(color);
                              mugColorMaterialRef.current.needsUpdate = true;
                            }
                          }}
                          className="w-8 h-8 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          style={{ backgroundColor: color }}
                          aria-label={`Color ${color}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Download Section */}
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                <h4 className="text-lg font-medium flex items-center mb-3 text-gray-800">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white mr-3 flex-shrink-0">3</span>
                  Save Your Design
                </h4>
                <button
                  onClick={download}
                  disabled={isLoading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition duration-200 flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Preview
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Modal footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Use your mouse to rotate the mug and preview your design
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={download}
              disabled={isLoading}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductMockup3D;
