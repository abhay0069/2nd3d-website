import { useEffect, useRef } from 'react';
import { isFinePointer } from '../utils/dom';

/**
 * Custom cursor — a precise dot that morphs into a labelled disc
 * over interactive elements. Blend-difference keeps it legible
 * across dark and paper bands. Disabled on touch devices.
 */
export function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isFinePointer()) return;

    const root = rootRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!root || !dot || !ring || !label) return;

    root.style.opacity = '0';

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let dotX = mouseX;
    let dotY = mouseY;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      root.style.opacity = '1';
    };

    const onLeaveWindow = () => {
      root.style.opacity = '0';
    };

    const onOver = (e: PointerEvent) => {
      const target = (e.target as HTMLElement).closest?.<HTMLElement>('[data-cursor]');
      if (target) {
        root.classList.add('is-hover');
        label.textContent = target.dataset.cursor || 'VIEW';
      } else {
        root.classList.remove('is-hover');
        label.textContent = '';
      }
    };

    const onDown = () => root.classList.add('is-down');
    const onUp = () => root.classList.remove('is-down');

    const tick = () => {
      dotX += (mouseX - dotX) * 0.42;
      dotY += (mouseY - dotY) * 0.42;
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      label.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeaveWindow);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('mouseleave', onLeaveWindow);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={rootRef} className="cursor" aria-hidden="true">
      <div ref={dotRef} className="cursor__dot" />
      <div ref={ringRef} className="cursor__ring" />
      <span ref={labelRef} className="cursor__label" />
    </div>
  );
}
