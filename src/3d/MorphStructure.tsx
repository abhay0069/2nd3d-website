import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { morphVertex, morphFragment } from '../shaders/morph';
import { sceneState } from '../utils/sceneState';

interface Props {
  quality: 'high' | 'low';
}

/**
 * The hero sculpture — a slowly morphing abstract structure.
 * Responds to pointer, velocity and scroll. Custom shader material
 * only: no textures, no external assets.
 */
export function MorphStructure({ quality }: Props) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const lightProbe = useRef(new THREE.Vector3(3, 2.4, 4));

  const geometry = useMemo(() => {
    const detail = quality === 'high' ? 48 : 24;
    return new THREE.IcosahedronGeometry(1.55, detail);
  }, [quality]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: 0.3 },
      uFrequency: { value: 0.62 },
      uVelocity: { value: 0 },
      uReveal: { value: 0 },
      uOpacity: { value: 1 },
      uColorBase: { value: new THREE.Color('#26262b') },
      uColorRim: { value: new THREE.Color('#f2efe9') },
      uColorAccent: { value: new THREE.Color('#ff4a1f') },
      uLightPos: { value: new THREE.Vector3(3, 2.4, 4) },
      uFogColor: { value: new THREE.Color('#0b0b0c') },
      uFogNear: { value: 4.5 },
      uFogFar: { value: 13.5 },
    }),
    [],
  );

  useFrame((state, delta) => {
    const mat = materialRef.current;
    const mesh = meshRef.current;
    if (!mat || !mesh || !sceneState.visible) return;

    const t = state.clock.elapsedTime;
    mat.uniforms.uTime.value = t;
    mat.uniforms.uVelocity.value +=
      (sceneState.velocity - mat.uniforms.uVelocity.value) * Math.min(1, delta * 3.2);

    // Intro reveal swells the structure out of nothing.
    const introTarget = sceneState.introEnabled ? 1 : 0;
    sceneState.intro += (introTarget - sceneState.intro) * Math.min(1, delta * (sceneState.reduced ? 40 : 1.15));
    const intro = Math.min(1, sceneState.intro);
    mat.uniforms.uReveal.value = intro;

    const hero = sceneState.heroProgress;
    mat.uniforms.uAmp.value = 0.27 + hero * 0.1 + mat.uniforms.uVelocity.value * 0.16;
    mat.uniforms.uOpacity.value = THREE.MathUtils.clamp(1 - (hero - 0.72) * 3.2, 0, 1) * intro;

    // Rotation follows the pointer with lazy inertia + slow base spin.
    const targetRotY = t * (sceneState.reduced ? 0 : 0.055) + sceneState.mouseX * 0.42;
    const targetRotX = sceneState.mouseY * -0.3 + Math.sin(t * 0.11) * 0.12;
    mesh.rotation.y += (targetRotY - mesh.rotation.y) * Math.min(1, delta * 1.6);
    mesh.rotation.x += (targetRotX - mesh.rotation.x) * Math.min(1, delta * 1.6);

    // Scroll drives the sculpture up and out as the manifesto arrives.
    const scale = 1 + hero * 0.52;
    mesh.scale.setScalar(scale * (0.65 + 0.35 * intro));
    mesh.position.y = hero * 1.15;
    mesh.position.x = sceneState.mouseX * 0.22 + hero * -0.85;

    // Ember light orbits toward the cursor.
    lightProbe.current.lerp(
      new THREE.Vector3(2.6 + sceneState.mouseX * 4.2, 2.2 + sceneState.mouseY * 3.4, 4.4),
      Math.min(1, delta * 1.4),
    );
    mat.uniforms.uLightPos.value.copy(lightProbe.current);
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={morphVertex}
        fragmentShader={morphFragment}
        uniforms={uniforms}
        transparent
        depthWrite
      />
    </mesh>
  );
}
