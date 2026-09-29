import { useEffect, useRef } from 'react';

/**
 * Magnetic hover — the element eases toward the cursor inside its bounds.
 * Returns a ref to attach to the element. Values applied via transform,
 * so React never re-renders.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.28) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let raf = 0;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const tick = () => {
      currentX += (targetX - currentX) * 0.16;
      currentY += (targetY - currentY) * 0.16;
      el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      targetX = relX * strength;
      targetY = relY * strength;
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, [strength]);

  return ref;
}
