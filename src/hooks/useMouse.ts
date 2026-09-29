import { useEffect, useRef } from 'react';

interface MouseState {
  x: number; // normalized -1..1
  y: number;
  px: number; // pixels
  py: number;
  velocity: number;
}

/**
 * Tracks the pointer with smoothing + velocity, in normalized space.
 * Values are written into a ref so consumers can read them in rAF
 * loops without triggering re-renders.
 */
export function useMouse(smoothness = 0.08) {
  const state = useRef<MouseState>({ x: 0, y: 0, px: 0, py: 0, velocity: 0 });

  useEffect(() => {
    let targetX = 0;
    let targetY = 0;
    let targetPX = 0;
    let targetPY = 0;
    let prevX = 0;
    let prevY = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      targetPX = e.clientX;
      targetPY = e.clientY;
      targetX = (e.clientX / window.innerWidth) * 2 - 1;
      targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const tick = () => {
      const s = state.current;
      s.x += (targetX - s.x) * smoothness;
      s.y += (targetY - s.y) * smoothness;
      s.px += (targetPX - s.px) * smoothness * 2;
      s.py += (targetPY - s.py) * smoothness * 2;

      const dx = s.x - prevX;
      const dy = s.y - prevY;
      s.velocity = Math.min(1, Math.hypot(dx, dy) * 12);
      prevX = s.x;
      prevY = s.y;

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [smoothness]);

  return state;
}
