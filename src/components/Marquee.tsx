import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../animations/gsapSetup';
import './Marquee.css';

interface Props {
  items: string[];
  reverse?: boolean;
  className?: string;
}

/**
 * Infinite editorial marquee. Base drift + scroll-velocity boost,
 * so the strip leans into the direction you travel.
 */
export function Marquee({ items, reverse = false, className = '' }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    let offset = 0;
    let velocityBoost = 0;
    const baseSpeed = (reverse ? -1 : 1) * 0.45;

    const st = ScrollTrigger.create({
      trigger: root,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        velocityBoost = gsap.utils.clamp(-2.4, 2.4, self.getVelocity() / 260) * (reverse ? -1 : 1);
      },
    });

    const tick = () => {
      const half = track.scrollWidth / 2;
      velocityBoost *= 0.92;
      offset += baseSpeed + velocityBoost;
      if (half > 0) {
        if (offset <= -half) offset += half;
        if (offset >= 0) offset -= half;
      }
      track.style.transform = `translate3d(${offset}px, 0, 0)`;
      raf = requestAnimationFrame(tick);
    };
    let raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      st.kill();
    };
  }, [reverse]);

  const doubled = [...items, ...items];

  return (
    <div ref={rootRef} className={`marquee ${className}`} aria-hidden="true">
      <div ref={trackRef} className="marquee__track">
        {doubled.map((item, i) => (
          <span key={`${item}-${i}`} className={`marquee__item ${i % 2 === 1 ? 'marquee__item--outline' : ''}`}>
            {item}
            <span className="marquee__sep">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
