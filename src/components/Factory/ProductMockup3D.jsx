import React, { useCallback, useEffect, useRef, useState } from "react";
import { X, Upload } from "lucide-react";
import * as THREE from "three";
import { OrbitControls as ThreeOrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// Replace this with your actual path
import mug from "../../assets/coffee.glb";

const CupMockup3DModal = ({ isOpen, onClose, onSave }) => {
    const containerRef = useRef(null);
    const fileInputRef = useRef(null);
    const colorInputRef = useRef(null);

    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const OrbitControlRef = useRef(null);
    const cupMeshRef = useRef(null);
    const logoMeshRef = useRef(null);
    const logoMaterialRef = useRef(null);
    const cupMaterialRef = useRef(null);
    const [previewImageUrl, setPreviewImageUrl] = useState(null);

    // Helper function to create a decal (logo) on the cup
    const applyLogoToCup = useCallback((imageURL) => {
        if (!cupMeshRef.current) return;

        // Create or update logo mesh if it exists
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(imageURL, (texture) => {
            texture.encoding = THREE.sRGBEncoding;

            // Remove old logo if exists
            if (logoMeshRef.current) {
                sceneRef.current.remove(logoMeshRef.current);
            }

            // Create a plane geometry for the logo
            const aspect = texture.image.width / texture.image.height;
            const width = 0.5;
            const height = width / aspect;

            const geometry = new THREE.PlaneGeometry(width, height);
            const material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                side: THREE.DoubleSide
            });

            logoMaterialRef.current = material;

            // Create logo mesh
            const logoMesh = new THREE.Mesh(geometry, material);
            logoMeshRef.current = logoMesh;

            // Position the logo on the cup
            logoMesh.position.set(0, 0, 0.8); // Adjust these values to position correctly
            logoMesh.lookAt(new THREE.Vector3(0, 0, 5));

            sceneRef.current.add(logoMesh);
        });
    }, []);

    const setupTextureSelector = useCallback(() => {
        const handleTextureChange = (event) => {
            if (event.target.files.length > 0) {
                const file = event.target.files[0];
                const imageUrl = URL.createObjectURL(file);
                setPreviewImageUrl(imageUrl);
                applyLogoToCup(imageUrl);
            }
        };

        if (fileInputRef.current) {
            fileInputRef.current.addEventListener("change", handleTextureChange);
        }

        return () => {
            if (fileInputRef.current) {
                fileInputRef.current.removeEventListener("change", handleTextureChange);
            }
        };
    }, [applyLogoToCup]);

    const setupColorSelector = useCallback(() => {
        const handleColorChange = (event) => {
            if (cupMaterialRef.current) {
                cupMaterialRef.current.color.set(event.target.value);
            }
        };

        if (colorInputRef.current) {
            colorInputRef.current.addEventListener("input", handleColorChange);
        }

        return () => {
            if (colorInputRef.current) {
                colorInputRef.current.removeEventListener("input", handleColorChange);
            }
        };
    }, []);

    const initScene = useCallback(() => {
        if (!containerRef.current) return;

        // Clear any existing renderer
        if (rendererRef.current && containerRef.current.contains(rendererRef.current.domElement)) {
            containerRef.current.removeChild(rendererRef.current.domElement);
        }

        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(25, 1, 0.001, 10000);
        cameraRef.current = camera;
        scene.add(camera);

        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            logarithmicDepthBuffer: true,
            alpha: true,
        });
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientWidth);
        renderer.outputEncoding = THREE.sRGBEncoding;
        rendererRef.current = renderer;

        containerRef.current.appendChild(renderer.domElement);

        const controls = new ThreeOrbitControls(camera, renderer.domElement);
        OrbitControlRef.current = controls;

        return { scene, camera, renderer, controls };
    }, []);

    const loadModel = useCallback(() => {
        if (!sceneRef.current || !rendererRef.current || !cameraRef.current) return;

        const scene = sceneRef.current;
        const camera = cameraRef.current;
        const controls = OrbitControlRef.current;

        const loader = new GLTFLoader();
        const cameraPos = new THREE.Vector3(0, 0, 5);

        loader.load(
            mug,
            (gltf) => {
                const object = gltf.scene;

                object.updateMatrixWorld();
                const boundingBox = new THREE.Box3().setFromObject(object);
                const modelSizevec3 = new THREE.Vector3();
                boundingBox.getSize(modelSizevec3);
                const modelSize = modelSizevec3.length();
                const modelCenter = new THREE.Vector3();
                boundingBox.getCenter(modelCenter);

                controls.reset();
                controls.maxDistance = modelSize * 50;
                controls.enableDamping = true;
                controls.dampingFactor = 0.25;
                controls.rotateSpeed = 0.5;
                controls.panSpeed = 0.5;
                controls.screenSpacePanning = true;
                controls.autoRotate = true;

                object.position.copy(modelCenter.negate());

                camera.position.set(
                    modelSize * cameraPos.x,
                    modelSize * cameraPos.y,
                    modelSize * cameraPos.z
                );
                camera.near = modelSize / 100;
                camera.far = modelSize * 100;
                camera.updateProjectionMatrix();
                camera.lookAt(new THREE.Vector3(0, 0, 0));

                object.traverse((obj) => {
                    if (obj instanceof THREE.Mesh && obj.name === "Mug_Porcelain_PBR001_0") {
                        cupMeshRef.current = obj;
                    } else if (obj instanceof THREE.Mesh && obj.name === "Mug_Porcelain_PBR002_0") {
                        cupMaterialRef.current = obj.material;
                        setupColorSelector();
                    }
                });

                scene.add(object);
            },
            undefined,
            (err) => {
                console.error("Error loading GLTF:", err);
            }
        );
    }, [setupColorSelector]);

    const animate = useCallback(() => {
        if (!rendererRef.current || !sceneRef.current || !cameraRef.current || !OrbitControlRef.current) return;

        const renderer = rendererRef.current;
        const scene = sceneRef.current;
        const camera = cameraRef.current;
        const controls = OrbitControlRef.current;

        const animateLoop = () => {
            controls.update();
            renderer.render(scene, camera);
            requestAnimationFrame(animateLoop);
        };

        animateLoop();
    }, []);

    // Handle window resize
    const handleResize = useCallback(() => {
        if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;

        const width = containerRef.current.clientWidth;
        rendererRef.current.setSize(width, width);
        cameraRef.current.aspect = 1;
        cameraRef.current.updateProjectionMatrix();
    }, []);

    useEffect(() => {
        if (isOpen && containerRef.current) {
            initScene();
            loadModel();
            animate();
            setupTextureSelector();

            window.addEventListener('resize', handleResize);

            // Set initial size
            setTimeout(handleResize, 0);

            return () => {
                window.removeEventListener('resize', handleResize);

                if (rendererRef.current && containerRef.current) {
                    containerRef.current.removeChild(rendererRef.current.domElement);
                    rendererRef.current.dispose();
                }
            };
        }
    }, [isOpen, initScene, loadModel, animate, setupTextureSelector, handleResize]);

    const handleDownload = () => {
        if (!rendererRef.current) return;

        // Create a screenshot of the current view
        const renderer = rendererRef.current;
        renderer.preserveDrawingBuffer = true;
        renderer.render(sceneRef.current, cameraRef.current);

        const dataURL = renderer.domElement.toDataURL('image/png');
        renderer.preserveDrawingBuffer = false;

        // Create download link
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'custom-mug.png';
        link.click();
    };

    // If modal is not open, don't render anything
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-opacity">
            <div
                className="relative bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-5xl max-h-[90vh] flex flex-col animate-fadeIn"
                onClick={(e) => e.stopPropagation()} // prevents click from bubbling to backdrop
            >
                {/* Modal Header */}
                <div className="px-6 py-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                    <h3 className="text-xl font-semibold text-gray-900">Customize Your Mug</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-700 focus:outline-none"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 flex flex-col md:flex-row gap-6 overflow-auto">
                    {/* 3D Preview */}
                    <div className="w-full md:w-2/3">
                        <div
                            ref={containerRef}
                            className="w-full aspect-square bg-gray-50 rounded-lg border border-gray-200"
                        ></div>
                    </div>

                    {/* Controls */}
                    <div className="w-full md:w-1/3 flex flex-col gap-6">
                        {/* Logo Upload */}
                        <div className="space-y-3">
                            <h4 className="font-medium text-gray-900">1. Upload Your Logo</h4>
                            <div className="flex items-center gap-3">
                                <label
                                    htmlFor="logo-upload"
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                                >
                                    <Upload size={16} />
                                    <span>Choose File</span>
                                </label>
                                <input
                                    id="logo-upload"
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    className="hidden"
                                />
                            </div>

                            {previewImageUrl && (
                                <div className="mt-3">
                                    <p className="text-sm text-gray-600 mb-1">Preview:</p>
                                    <img
                                        src={previewImageUrl}
                                        alt="Logo preview"
                                        className="h-16 object-contain border border-gray-200 rounded"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Color Picker */}
                        <div className="space-y-3">
                            <h4 className="font-medium text-gray-900">2. Choose Cup Color</h4>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    ref={colorInputRef}
                                    defaultValue="#ffffff"
                                    className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                                />
                                <span className="text-sm text-gray-600">Click to select color</span>
                            </div>
                        </div>

                        {/* Download */}
                        <div className="space-y-3 mt-auto">
                            <h4 className="font-medium text-gray-900">3. Save Your Design</h4>
                            <button
                                onClick={handleDownload}
                                className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
                            >
                                Download Preview
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Export a wrapper component that manages the modal state
const CupMockupModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
                Customize Mug
            </button>

            <CupMockup3DModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={() => {
                    console.log("Saving design");
                    setIsModalOpen(false);
                }}
            />
        </>
    );
};

export default CupMockupModal;