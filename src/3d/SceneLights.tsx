import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { sceneState } from '../utils/sceneState';

/**
 * Studio lighting: warm key, cool fill, ember accent that
 * drifts toward the cursor. Pure lights — no environment maps.
 */
export function SceneLights() {
  const accentRef = useRef<THREE.PointLight>(null);
  const keyRef = useRef<THREE.DirectionalLight>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (accentRef.current) {
      const targetX = 3.2 + sceneState.mouseX * 4.6;
      const targetY = 1.8 + sceneState.mouseY * 3.2;
      accentRef.current.position.x += (targetX - accentRef.current.position.x) * Math.min(1, delta * 1.6);
      accentRef.current.position.y += (targetY - accentRef.current.position.y) * Math.min(1, delta * 1.6);
      accentRef.current.position.z = 3.6 + Math.sin(t * 0.4) * 0.8;
      accentRef.current.intensity = 26 + sceneState.velocity * 30;
    }
    if (keyRef.current && !sceneState.reduced) {
      keyRef.current.position.x = -2.4 + Math.sin(t * 0.12) * 1.2;
    }
  });

  return (
    <>
      <ambientLight intensity={0.22} color="#8b8b93" />
      <directionalLight ref={keyRef} position={[-2.4, 3.2, 4.2]} intensity={1.35} color="#f2efe9" />
      <directionalLight position={[4, -2, -3]} intensity={0.32} color="#5a5a66" />
      <pointLight ref={accentRef} position={[3.2, 1.8, 3.6]} intensity={26} distance={16} decay={2} color="#ff4a1f" />
    </>
  );
}
