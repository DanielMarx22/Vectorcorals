"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";
import { RealisticTorch } from "./components/RealisticTorch";

export default function Home() {
  return (
    <main className="h-screen w-full bg-black">
      <Canvas camera={{ position: [0, 0.5, 5], fov: 45 }}>
        <color attach="background" args={["#050505"]} />{" "}
        {/* Very dark grey background */}
        {/* REALISTIC LIGHTING SETUP */}
        {/* 1. Main top-down "Sun" light (warm white) to catch the new shader tops */}
        <directionalLight position={[2, 8, 2]} intensity={1} color="#fff5e0" />
        {/* 2. Fill light from below (cool blue) for shadows */}
        <directionalLight
          position={[-2, -2, -2]}
          intensity={0.5}
          color="#003366"
        />
        {/* 3. General ambient light */}
        <ambientLight intensity={0.2} />
        <Suspense fallback={null}>
          <RealisticTorch />
        </Suspense>
        <OrbitControls target={[0, 0.5, 0]} maxPolarAngle={Math.PI / 1.5} />
      </Canvas>
    </main>
  );
}
