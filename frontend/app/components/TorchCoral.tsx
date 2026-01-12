"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const CoralShaderMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uColorHigh: { value: new THREE.Color("#8a2be2") },
    uColorLow: { value: new THREE.Color("#000000") },
  },
  vertexShader: `
    uniform float uTime;
    varying vec2 vUv;
    varying float vElevation;

    void main() {
      vUv = uv;
      vec3 newPosition = position;
      
      // Simple Sway Math
      float sway = sin(uTime * 2.0 + newPosition.y * 4.0) * 0.3 * vUv.y;
      newPosition.x += sway;
      newPosition.z += cos(uTime * 1.5 + newPosition.y * 3.0) * 0.15 * vUv.y;

      vElevation = vUv.y;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 uColorHigh;
    uniform vec3 uColorLow;
    varying float vElevation;

    void main() {
      vec3 color = mix(uColorLow, uColorHigh, vElevation);
      gl_FragColor = vec4(color, 1.0);
    }
  `,
};

export function TorchCoral() {
  // Fix: Use 'any' to bypass strict shader material typing for now
  const materialRef = useRef<any>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  const tentacles = useMemo(() => {
    return new Array(20).fill(0).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 1.5,
        0,
        (Math.random() - 0.5) * 1.5,
      ] as [number, number, number],
      scale: 0.8 + Math.random() * 0.4,
      rotation: [
        (Math.random() - 0.5) * 0.5,
        Math.random() * Math.PI,
        (Math.random() - 0.5) * 0.5,
      ] as [number, number, number],
    }));
  }, []);

  return (
    <group position={[0, -1.5, 0]}>
      {tentacles.map((data, i) => (
        <mesh
          key={i}
          position={data.position}
          rotation={data.rotation}
          scale={[1, data.scale, 1]}
        >
          <cylinderGeometry args={[0.02, 0.05, 3, 16, 32]} />
          <shaderMaterial
            ref={i === 0 ? materialRef : undefined}
            attach="material"
            args={[CoralShaderMaterial]}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}
