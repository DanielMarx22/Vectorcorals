"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { GLTF } from "three-stdlib";

// --- SHADER (Your exact shader) ---
const LivingTentacleMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uColorBase: { value: new THREE.Color("#1a0033") },
    uColorMid: { value: new THREE.Color("#8a2be2") },
    uColorTip: { value: new THREE.Color("#00ff99") },
    uSunColor: { value: new THREE.Color("#ffdd88") },
    uShadowColor: { value: new THREE.Color("#005533") },
  },
  vertexShader: `
    uniform float uTime;
    varying float vHeight;
    varying vec3 vNormal;

    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1; i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ; m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec3 pos = position;
      vec4 worldInstancePos = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
      float time = uTime * 0.15; 
      float seed = worldInstancePos.x * 12.0 + worldInstancePos.z * 12.0;

      float surge = sin(time + pos.y * 0.5) * 0.1;
      float curlX = sin(time * 1.5 + pos.y * 2.0 + seed) * 0.15;
      float curlZ = cos(time * 1.2 + pos.y * 2.0 + seed) * 0.15;
      float wobble = snoise(vec2(time * 2.0, pos.y * 1.5 + seed)) * 0.05;
      float flexibility = pow(pos.y, 1.5);
      
      pos.x += (surge + curlX + wobble) * flexibility;
      pos.z += (curlZ + wobble) * flexibility;

      vNormal = normalize(mat3(instanceMatrix) * normal);
      vHeight = pos.y;
      gl_Position = projectionMatrix * viewMatrix * instanceMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 uColorBase;
    uniform vec3 uColorMid;
    uniform vec3 uColorTip;
    uniform vec3 uSunColor;
    uniform vec3 uShadowColor;
    varying float vHeight;
    varying vec3 vNormal;

    void main() {
      vec3 gradientColor;
      float mix1 = smoothstep(0.0, 0.8, vHeight);
      gradientColor = mix(uColorBase, uColorMid, mix1);
      float mix2 = smoothstep(0.8, 1.5, vHeight);
      gradientColor = mix(gradientColor, uColorTip, mix2);

      float upFactor = vNormal.y; 
      float lightMix = smoothstep(-0.2, 1.0, upFactor); 
      vec3 lightingColor = mix(uShadowColor, uSunColor, lightMix);

      vec3 finalColor = gradientColor * lightingColor * 1.5;
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
});

// FIX 1: TYPE DEFINITION (Solves "Property geometry does not exist")
type GLTFResult = GLTF & {
  nodes: {
    [name: string]: THREE.Mesh;
  };
  materials: {
    [name: string]: THREE.Material;
  };
};

export function RealisticTorch() {
  // Use the Custom Type
  const { nodes } = useGLTF("/holygrail.glb?v=fixGap") as unknown as GLTFResult;
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const COUNT = 180;

  const geometries = useMemo(() => {
    // Filter ensures we only sort Meshes
    const allMeshes = Object.values(nodes).filter((n) => n.isMesh);
    allMeshes.sort(
      (a, b) =>
        b.geometry.attributes.position.count -
        a.geometry.attributes.position.count
    );
    return { tentacle: allMeshes[0]?.geometry, base: allMeshes[1]?.geometry };
  }, [nodes]);

  const skeletonMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#f0f0f0",
      roughness: 0.9,
      metalness: 0.0,
      emissive: "#111111",
    });
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (!meshRef.current) return;

    for (let i = 0; i < COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 0.6) * 0.7;

      // FIX 2: ALIGNMENT
      // Since Base is at 0,0,0, we spawn tentacles slightly ABOVE 0
      // (0.3) so they look like they are inside the cup.
      const deepSpawnY = 0.3 + Math.random() * 0.15;

      dummy.position.set(Math.cos(angle) * r, deepSpawnY, Math.sin(angle) * r);

      const lean = r * 0.5;
      dummy.rotation.set(
        (Math.random() - 0.5) * 0.4 + Math.sin(angle) * lean,
        (Math.random() - 0.5) * 2.0,
        (Math.random() - 0.5) * 0.4 - Math.cos(angle) * lean
      );

      const height = 0.7 + Math.random() * 0.6;
      const thickness = 0.6 + Math.random() * 0.3;
      dummy.scale.set(thickness, height, thickness);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  useFrame((state) => {
    if (meshRef.current) {
      // FIX 3: TYPE CASTING (Solves "Property uniforms does not exist")
      const mat = meshRef.current.material as THREE.ShaderMaterial;
      if (mat.uniforms) {
        mat.uniforms.uTime.value = state.clock.getElapsedTime();
      }
    }
  });

  if (!geometries.tentacle) return null;

  return (
    <group position={[0, 0, 0]}>
      <instancedMesh
        ref={meshRef}
        args={[geometries.tentacle, LivingTentacleMaterial, COUNT]}
      />
      {geometries.base && (
        <mesh
          geometry={geometries.base}
          // FIX 4: POSITION
          // Reset to [0,0,0] so it aligns with the tentacles again
          position={[0, 0, 0]}
          material={skeletonMaterial}
        />
      )}
    </group>
  );
}
