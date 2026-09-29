import { useEffect } from 'react';
import { sceneState } from '../utils/sceneState';

/**
 * Bridges the DOM pointer into `sceneState` for the WebGL frame
 * loop — smoothed, velocity-aware, zero React re-renders.
 */
export function usePointerBridge(): void {
  useEffect(() => {
    let targetX = 0;
    let targetY = 0;
    let prevX = 0;
    let prevY = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      targetX = (e.clientX / window.innerWidth) * 2 - 1;
      targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const tick = () => {
      const lambda = sceneState.reduced ? 0.5 : 0.075;
      sceneState.mouseX += (targetX - sceneState.mouseX) * lambda;
      sceneState.mouseY += (targetY - sceneState.mouseY) * lambda;

      const dx = sceneState.mouseX - prevX;
      const dy = sceneState.mouseY - prevY;
      sceneState.velocity += (Math.min(1, Math.hypot(dx, dy) * 14) - sceneState.velocity) * 0.12;
      prevX = sceneState.mouseX;
      prevY = sceneState.mouseY;

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
}
