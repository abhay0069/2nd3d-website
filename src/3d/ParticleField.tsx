import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { particlesVertex, particlesFragment } from '../shaders/particles';
import { sceneState } from '../utils/sceneState';
import { randomRange } from '../utils/math';

interface Props {
  count: number;
}

/**
 * GPU particle atmosphere. One draw call — all motion happens
 * in the vertex shader, cursor repulsion included.
 */
export function ParticleField({ count }: Props) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { geometry, uniforms } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const seeds = new Float32Array(count);
    const accents = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = randomRange(-11, 11);
      positions[i * 3 + 1] = randomRange(-6.5, 6.5);
      positions[i * 3 + 2] = randomRange(-9, 5);
      scales[i] = randomRange(0.35, 1.35);
      seeds[i] = Math.random();
      accents[i] = Math.random() < 0.055 ? 1 : 0;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    geo.setAttribute('aAccent', new THREE.BufferAttribute(accents, 1));

    return {
      geometry: geo,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uVelocity: { value: 0 },
        uOpacity: { value: 0 },
        uColor: { value: new THREE.Color('#f2efe9') },
        uAccent: { value: new THREE.Color('#ff4a1f') },
      },
    };
  }, [count]);

  useFrame((state, delta) => {
    const mat = materialRef.current;
    if (!mat || !sceneState.visible) return;

    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uMouse.value.lerp(new THREE.Vector2(sceneState.mouseX, sceneState.mouseY), Math.min(1, delta * 4));
    mat.uniforms.uVelocity.value +=
      (sceneState.velocity - mat.uniforms.uVelocity.value) * Math.min(1, delta * 3);
    // Particles fade in with the intro and recede as the hero ends.
    const heroFade = THREE.MathUtils.clamp(1 - (sceneState.heroProgress - 0.78) * 3.4, 0, 1);
    const target = Math.min(1, sceneState.intro * 1.4) * heroFade;
    mat.uniforms.uOpacity.value += (target - mat.uniforms.uOpacity.value) * Math.min(1, delta * 1.2);
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={particlesVertex}
        fragmentShader={particlesFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
