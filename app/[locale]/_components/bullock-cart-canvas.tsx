"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const BullockCartCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modelRef = useRef<THREE.Group | THREE.Object3D | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  // Bullock Cart Animation
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  // Background Grass Animation
  const groundTextureRef = useRef<THREE.Texture | null>(null);

  const travelDistanceRef = useRef(0);

  const rawModelRef = useRef<THREE.Object3D | null>(null);

  const isDragging = useRef<boolean>(false);
  const lastPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const cameraAngleRef = useRef(0);
  const cameraHeightRef = useRef(1.8);

  useEffect(() => {
    if (!canvasRef.current) return;

    // 1. Setup Scene
    const scene = new THREE.Scene();
    // Soft morning / sunset sky color
    const skyColor = new THREE.Color(0xf3f6e8);
    scene.background = skyColor;

    // Atmospheric depth
    scene.fog = new THREE.Fog(skyColor, 18, 65);

    sceneRef.current = scene;

    // 2. Setup Camera
    const camera = new THREE.PerspectiveCamera(
      45, // Smaller FOV for less distortion
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    // camera.position.set(0, 5, 14); // Slightly higher to see the land better
    // camera.position.set(0, 2, 10); // Slightly higher to see the land better
    // camera.lookAt(0, -2, 0);
    camera.position.set(
      camera.position.x,
      1.6, // was ~1.8–2
      camera.position.z
    );
    camera.lookAt(0, -1.8, -12);
    cameraRef.current = camera;

    // 3. Setup Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.2 : 2));
    renderer.shadowMap.enabled = true; // <--- Enable Shadows
    rendererRef.current = renderer;

    if (window.innerWidth < 768) {
      renderer.shadowMap.enabled = false;
    }

    // const rgbeLoader = new RGBELoader();

    // rgbeLoader.load(
    //   "/hdri/sunset_farm.hdr", // put file in /public/hdri/
    //   (texture) => {
    //     texture.mapping = THREE.EquirectangularReflectionMapping;
    //     scene.background = texture;
    //     scene.environment = texture;
    //   }
    // );

    // 4. Lighting (Bright & Balanced)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffd6a3, 3);
    sunLight.position.set(-10, 14, 6);
    sunLight.intensity = 2.5;
    sunLight.castShadow = true;

    sunLight.shadow.mapSize.set(2048, 2048);
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 50;

    scene.add(sunLight);

    const skyPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 100),
      new THREE.MeshBasicMaterial({
        color: 0xf3f6e8,
      })
    );

    skyPlane.position.set(0, 20, -80);
    scene.add(skyPlane);

    // ==========================================
    // 5. THE INFINITE GREEN LAND (Full Background)
    // ==========================================
    const textureLoader = new THREE.TextureLoader();
    // Using a grass texture to simulate real land
    const grassTextureUrl = "/assets/hero-section (2).png"; // Ensure this file exists!

    // Fallback URL if local file is missing (Generic seamless grass)
    // const grassTextureUrl = "https://threejs.org/examples/textures/terrain/grasslight-big.jpg";

    textureLoader.load(grassTextureUrl, (texture) => {
      texture.wrapS = THREE.MirroredRepeatWrapping;
      texture.wrapT = THREE.MirroredRepeatWrapping;
      // High repeat makes it look like a vast field, not a blurry image
      texture.repeat.set(2.5, 2.5);

      // const maxAnisotropy = rendererRef.current?.capabilities.getMaxAnisotropy() || 1;
      // texture.anisotropy = maxAnisotropy;

      groundTextureRef.current = texture;

      // Huge Plane (200x200) to fill the entire view
      const planeGeometry = new THREE.PlaneGeometry(200, 200);
      const planeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.95,
        metalness: 0,
      });

      const treeMaterial = new THREE.MeshStandardMaterial({
        color: 0x2f4f2f,
        roughness: 1,
      });

      const floor = new THREE.Mesh(planeGeometry, planeMaterial);
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -3.5; // Sitting low
      floor.receiveShadow = true;
      scene.add(floor);

      const treeCount = window.innerWidth < 768 ? 8 : 20;

      for (let i = 0; i < treeCount; i++) {
        const tree = new THREE.Mesh(new THREE.ConeGeometry(0.6, 3, 6), treeMaterial);

        tree.position.set((Math.random() - 0.5) * 80, -3.5, -40 - Math.random() * 40);

        tree.castShadow = false;
        scene.add(tree);
      }

      // ==========================================
      // FIX 4: CONTACT SHADOW UNDER BULLOCK CART
      // ==========================================
      const shadowGeo = new THREE.PlaneGeometry(6, 3);
      const shadowMat = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.18,
      });

      const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
      contactShadow.rotation.x = -Math.PI / 2;

      // SAME Y as ground + tiny offset to avoid z-fighting
      contactShadow.position.y = -3.49;

      // SAME Z as your wrapper model
      contactShadow.position.z = -12;

      // OPTIONAL: slight X offset if needed
      contactShadow.position.x = 0;

      scene.add(contactShadow);
    });

    // 6. Load the Uploaded Model
    const loader = new GLTFLoader();
    loader.load(
      "/assets/bullock_cart_3d_model.glb",
      (gltf) => {
        const rawModel = gltf.scene;

        rawModelRef.current = rawModel;

        // --- 1. ANIMATION ---
        if (gltf.animations && gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(rawModel);
          gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
          mixerRef.current = mixer;
        }

        // --- 2. WRAPPER STRATEGY (The Fix) ---
        // Create a wrapper to control the model easily
        const wrapper = new THREE.Group();
        scene.add(wrapper);

        // Calculate center of the raw model
        const box = new THREE.Box3().setFromObject(rawModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // A. RESET PIVOT: Move raw model so its center is at (0,0,0) inside the wrapper
        rawModel.position.x = -center.x;
        rawModel.position.y = -center.y;
        rawModel.position.z = -center.z;

        // Add raw model to wrapper
        wrapper.add(rawModel);

        // B. SCALE THE WRAPPER (Make it Medium-Large)
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetSize = 8; // Adjust this if still too small
        const scale = targetSize / maxDim;
        wrapper.scale.set(scale, scale, scale);

        // C. POSITION THE WRAPPER (Right-Bottom)
        // Start conservative: X=2 (Right), Y=-2 (Bottom)
        // wrapper.position.set(2, 0, -8);
        // wrapper.position.set(0, -1, -12);
        wrapper.position.y = -2.2;
        // wrapper.position.y -= 0.3;

        // Face Left
        // wrapper.rotation.y = -Math.PI / 2;
        wrapper.rotation.y = Math.PI / 2;

        // --- 3. DEBUG HELPER (REMOVE LATER) ---
        // This draws a yellow box around the model so you can find it even if it's invisible
        // const boxHelper = new THREE.BoxHelper(wrapper, 0xffff00);
        // scene.add(boxHelper);

        // Enable Shadows
        rawModel.traverse((child) => {
          // if (child.isObject3D) {
          //   child.castShadow = true;
          //   child.receiveShadow = true;
          // }
          if (child instanceof THREE.Mesh) {
            const material = child.material;

            // Handle multi-material meshes
            if (Array.isArray(material)) {
              material.forEach((mat) => {
                if (mat instanceof THREE.MeshStandardMaterial) {
                  mat.metalness = 0.02;
                  mat.roughness = 0.75;
                  mat.envMapIntensity = 0.6;
                }
              });
            }
            if (material instanceof THREE.MeshStandardMaterial) {
              material.metalness = 0.02;
              material.roughness = 0.75;
              material.envMapIntensity = 0.6;
            }

            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        // Store ref to the WRAPPER (not the raw model) for dragging
        modelRef.current = wrapper;

        console.log("✅ Model Loaded via Wrapper strategy");
        renderer.render(scene, camera);
      },
      undefined,
      (error) => console.error("❌ Error loading GLB:", error)
    );

    // --- ANIMATION LOOP ---
    const clock = new THREE.Clock(); // Needed for smooth animation
    let requestID: number;
    const speed = 0.4;
    const maxDistance = 12;

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(requestID);
      } else {
        animate();
      }
    });

    const animate = () => {
      requestID = requestAnimationFrame(animate);

      const delta = clock.getDelta();

      // 1. Update the Mixer (This moves the bulls legs)
      if (mixerRef.current) {
        mixerRef.current.update(delta);
      }

      if (modelRef.current) {
        modelRef.current.position.z -= delta * speed;
        travelDistanceRef.current += delta * speed;

        if (travelDistanceRef.current > maxDistance) {
          // Reset smoothly
          modelRef.current.position.z = -12;
          travelDistanceRef.current = 0;
        }
      }

      // 2. ANIMATE THE GRASS (The "Running" Effect)
      if (groundTextureRef.current) {
        // Move texture on Y axis to simulate forward movement
        // Adjust '0.5' to change speed
        // groundTextureRef.current.offset.y += delta * 0.3;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      if (cameraRef.current) {
        cameraRef.current.position.z -= delta * 0.3;
        cameraRef.current.lookAt(0, -1.8, cameraRef.current.position.z - 4);
        cameraRef.current.position.x = Math.sin(clock.elapsedTime * 0.3) * 0.15;
      }

      if (rawModelRef.current) {
        rawModelRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh && child.name.toLowerCase().includes("wheel")) {
            child.rotation.x += delta * 1.5;
          }
        });
      }

      if (cameraRef.current && modelRef.current) {
        const radius = 6; // distance from cart
        const cartZ = modelRef.current.position.z;

        cameraRef.current.position.x = Math.sin(cameraAngleRef.current) * radius;

        cameraRef.current.position.z = cartZ + Math.cos(cameraAngleRef.current) * radius;

        cameraRef.current.position.y = cameraHeightRef.current;

        cameraRef.current.lookAt(0, -1.8, cartZ - 4);
      }
    };
    animate();

    // --- INTERACTION HANDLERS ---
    const startDrag = (x: number, y: number) => {
      isDragging.current = true;
      lastPosition.current = { x, y };
    };
    const endDrag = () => {
      isDragging.current = false;
    };
    const dragMove = (x: number, y: number) => {
      if (!isDragging.current || !cameraRef.current) return;

      const deltaX = x - lastPosition.current.x;
      lastPosition.current = { x, y };

      cameraAngleRef.current -= deltaX * 0.005;
    };

    const handleMouseDown = (e: MouseEvent) => startDrag(e.clientX, e.clientY);
    const handleMouseUp = () => endDrag();
    const handleMouseMove = (e: MouseEvent) => dragMove(e.clientX, e.clientY);
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) startDrag(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleTouchEnd = () => endDrag();
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) dragMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchmove", handleTouchMove);

    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(requestID);
      rendererRef.current?.dispose();
    };
  }, []);

  return (
    <div
      className="w-full h-screen overflow-hidden relative 
                saturate-[0.85] contrast-[1.05]"
    >
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />

      {/* UI LAYER */}
      <div className="absolute top-1 left-0 w-full h-full pointer-events-none z-10">
        <div className="container mx-auto px-6 md:px-12 h-full flex items-center">
          <div className="text-left max-w-lg">
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-sm leading-tight">
              Organic Farming with <br />
              <span className="text-white">Innovation</span>
            </h1>
            <p className="mt-4 text-xl text-white font-medium">
              Bridging the gap between traditional wisdom and modern technology.
            </p>
            <div className="pointer-events-auto mt-8">
              <button className="bg-green-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-green-700 transition-all cursor-pointer">
                Explore Solutions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BullockCartCanvas;
