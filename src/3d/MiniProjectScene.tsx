import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { morphVertex, morphFragment } from '../shaders/morph';
import { sceneState } from '../utils/sceneState';

/**
 * Interactive 3D project preview (MONOLITH) — a faceted shard that
 * leans toward the cursor while its panel is hovered. Low cost by
 * design: flat-shaded icosahedron, no post-processing.
 */

const uniforms = {
  uTime: { value: 0 },
  uAmp: { value: 0.16 },
  uFrequency: { value: 1.15 },
  uVelocity: { value: 0 },
  uReveal: { value: 1 },
  uOpacity: { value: 1 },
  uColorBase: { value: new THREE.Color('#2b2b31') },
  uColorRim: { value: new THREE.Color('#f2efe9') },
  uColorAccent: { value: new THREE.Color('#ff4a1f') },
  uLightPos: { value: new THREE.Vector3(2.5, 3, 3.5) },
  uFogColor: { value: new THREE.Color('#0b0b0c') },
  uFogNear: { value: 5 },
  uFogFar: { value: 12 },
};

function Shard({ hovered }: { hovered: React.MutableRefObject<boolean> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.25, 5), []);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    const mat = materialRef.current;
    if (!mesh || !mat || !sceneState.visible) return;

    mat.uniforms.uTime.value = state.clock.elapsedTime;

    const boost = hovered.current ? 1.35 : 1;
    const lambda = Math.min(1, delta * 2.2);

    const targetY = state.clock.elapsedTime * 0.22 * (sceneState.reduced ? 0 : 1) + sceneState.mouseX * 0.7 * boost;
    const targetX = sceneState.mouseY * -0.5 * boost + 0.28;

    mesh.rotation.y += (targetY - mesh.rotation.y) * lambda;
    mesh.rotation.x += (targetX - mesh.rotation.x) * lambda;

    const targetScale = hovered.current ? 1.12 : 1;
    const s = mesh.scale.x + (targetScale - mesh.scale.x) * Math.min(1, delta * 3);
    mesh.scale.setScalar(s);

    mat.uniforms.uAmp.value = 0.14 + (hovered.current ? 0.12 : 0) + sceneState.velocity * 0.08;
    mat.uniforms.uLightPos.value.set(
      2.5 + sceneState.mouseX * 3,
      2.6 + sceneState.mouseY * 2.4,
      3.4,
    );
  });

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[0.28, 0, -0.12]}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={morphVertex}
        fragmentShader={morphFragment}
        uniforms={uniforms}
      />
    </mesh>
  );
}

interface Props {
  hovered: React.MutableRefObject<boolean>;
  className?: string;
}

export function MiniProjectScene({ hovered, className }: Props) {
  return (
    <div className={className} aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ fov: 34, position: [0, 0, 5] }}
        style={{ pointerEvents: 'none' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} color="#8b8b93" />
          <directionalLight position={[-2, 2.5, 3]} intensity={1.1} color="#f2efe9" />
          <pointLight position={[2.4, -1.4, 2.2]} intensity={14} distance={10} decay={2} color="#ff4a1f" />
          <Shard hovered={hovered} />
        </Suspense>
      </Canvas>
    </div>
  );
}
