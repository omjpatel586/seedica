"use client";

import { ContactShadows, Environment, Html, useProgress, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense } from "react";
import { RepeatWrapping } from "three";
import BullockCartCanvas from "./bullock-cart-canvas";

// --- 1. Loading Screen ---
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center bg-white/90 px-6 py-4 rounded-lg shadow-xl backdrop-blur-sm">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-2"></div>
        <p className="text-sm font-bold text-green-800">{progress.toFixed(0)}% Loading...</p>
      </div>
    </Html>
  );
}

// --- 2. The 3D Infinite Grass Floor ---
function InfiniteGrassFloor() {
  // Load Texture
  const grassTexture = useTexture("/assets/green_grass.png");

  // Configure Texture for Infinite Tiling
  // eslint-disable-next-line react-hooks/immutability
  grassTexture.wrapS = RepeatWrapping;
  // eslint-disable-next-line react-hooks/immutability
  grassTexture.wrapT = RepeatWrapping;
  grassTexture.repeat.set(20, 20); // Repeat 20 times to make it look detailed

  useFrame((state, delta) => {
    // Animate the Texture Offset instead of the Mesh Position
    // This creates an infinite running effect that is super smooth
    // eslint-disable-next-line react-hooks/immutability
    grassTexture.offset.y -= delta * 0.5;
  });

  return (
    // Rotation -90deg makes it a FLOOR
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial
        map={grassTexture}
        color="#aaddaa" // Light tint to match the sky better
        roughness={0.8}
      />
    </mesh>
  );
}

// --- 4. Main Component ---
export default function HeroSection() {
  return (
    // Background Color handles the "Sky"
    <div className="relative w-full h-[600px]">
      {/* UI LAYER */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
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
              <button className="bg-green-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-green-700 transition-all">
                Explore Solutions
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3D SCENE LAYER */}
      <Canvas shadows camera={{ position: [0, 2, 7], fov: 45 }}>
        {/* LIGHTING */}
        <ambientLight intensity={1.1} />
        <directionalLight position={[10, 20, 10]} intensity={1.2} castShadow />
        <Environment preset="park" />

        {/* FOG: This is crucial! It blends the floor into the sky at the horizon */}
        {/* Color matches the bottom of your bg-gradient (sky-50 / #f0f9ff) */}
        {/* <fog attach="fog" args={["#87CEEB", 5, 100]} /> */}

        <Suspense fallback={<Loader />}>
          {/* 3D FLOOR */}
          <InfiniteGrassFloor />

          {/* SHADOW */}
          <ContactShadows position={[0, -1.9, 0]} opacity={0.6} scale={10} blur={2} />
        </Suspense>
      </Canvas>

      <BullockCartCanvas />
    </div>
  );
}
