import { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { MorphStructure } from './MorphStructure';
import { ParticleField } from './ParticleField';
import { SceneLights } from './SceneLights';
import { Effects } from './Effects';
import { sceneState } from '../utils/sceneState';
import { useIsMobile, useIsTablet } from '../hooks/useMediaQuery';

/**
 * Cinematic camera — parallax with the pointer, dolly + lift through
 * the hero pin. Damped so it always feels weighty, never jittery.
 */
function CameraRig() {
  const { camera } = useThree();
  const lookTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((_, delta) => {
    const hero = sceneState.heroProgress;
    const lambda = Math.min(1, delta * (sceneState.reduced ? 30 : 1.9));

    const targetX = sceneState.mouseX * 0.55 - hero * 0.65;
    const targetY = sceneState.mouseY * 0.4 + hero * 0.75;
    const targetZ = 6.4 - hero * 1.9;

    camera.position.x += (targetX - camera.position.x) * lambda;
    camera.position.y += (targetY - camera.position.y) * lambda;
    camera.position.z += (targetZ - camera.position.z) * lambda;

    lookTarget.current.lerp(
      new THREE.Vector3(sceneState.mouseX * 0.18, sceneState.mouseY * 0.14 + hero * 0.35, 0),
      lambda,
    );
    camera.lookAt(lookTarget.current);
  });

  return null;
}

interface Props {
  className?: string;
}

/**
 * The fixed WebGL layer. Sandwiched between background and foreground
 * type so the sculpture appears woven through the headline.
 */
export function HeroScene({ className }: Props) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const quality: 'high' | 'low' = isTablet ? 'low' : 'high';
  const particleCount = isMobile ? 420 : isTablet ? 800 : 1500;

  return (
    <div className={className} aria-hidden="true">
      <Canvas
        dpr={[1, isMobile ? 1.5 : 1.8]}
        gl={{
          antialias: !isMobile,
          powerPreference: 'high-performance',
          alpha: true,
        }}
        camera={{ fov: 38, position: [0, 0, 6.4], near: 0.1, far: 40 }}
        style={{ pointerEvents: 'none' }}
      >
        <Suspense fallback={null}>
          <CameraRig />
          <SceneLights />
          <MorphStructure quality={quality} />
          <ParticleField count={particleCount} />
          <Effects enabled={!isMobile} />
        </Suspense>
      </Canvas>
    </div>
  );
}
