import { useEffect, useRef } from 'react';

interface CanvasSetup {
  ctx: CanvasRenderingContext2D | null;
  width: number;
  height: number;
  dpr: number;
}

/**
 * Shared 2D canvas plumbing: sizing with devicePixelRatio,
 * resize handling, rAF loop, pointer position in canvas space.
 */
export function useCanvas2D(
  draw: (setup: CanvasSetup, pointer: { x: number; y: number; active: boolean }, time: number) => void,
  deps: unknown[] = [],
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef(draw);
  drawRef.current = draw;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    const ctx = canvas.getContext('2d');
    if (!parent || !ctx) return;

    const pointer = { x: -9999, y: -9999, active: false };
    let raf = 0;
    let start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const rect = parent.getBoundingClientRect();
      canvas.width = Math.max(1, rect.width * dpr);
      canvas.height = Math.max(1, rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };

    const tick = (now: number) => {
      const rect = parent.getBoundingClientRect();
      drawRef.current(
        {
          ctx,
          width: rect.width,
          height: rect.height,
          dpr: Math.min(window.devicePixelRatio, 2),
        },
        pointer,
        (now - start) / 1000,
      );
      raf = requestAnimationFrame(tick);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    resize();

    canvas.addEventListener('pointermove', onMove, { passive: true });
    canvas.addEventListener('pointerleave', onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return canvasRef;
}
