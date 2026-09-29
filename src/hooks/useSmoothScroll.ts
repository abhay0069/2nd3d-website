import { useEffect, useRef } from 'react';
import type { MutableRefObject } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '../animations/gsapSetup';

export interface SmoothScrollHandle {
  scrollTo: (target: string | number, options?: { offset?: number; duration?: number }) => void;
  stop: () => void;
  start: () => void;
}

export type SmoothScrollRef = MutableRefObject<SmoothScrollHandle | null>;

interface Options {
  enabled: boolean;
}

/**
 * Lenis smooth scroll, driven by the GSAP ticker so everything
 * shares a single rAF. Keeps ScrollTrigger in sync with lenis.
 */
export function useSmoothScroll({ enabled }: Options): SmoothScrollRef {
  const handle = useRef<SmoothScrollHandle | null>(null);

  useEffect(() => {
    if (!enabled) {
      // Native scrolling for reduced-motion users; ScrollTrigger still works.
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
      wheelMultiplier: 1,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    handle.current = {
      scrollTo: (target: string | number, options = {}) => {
        lenis.scrollTo(target, {
          offset: options.offset ?? 0,
          duration: options.duration ?? 1.4,
        });
      },
      stop: () => lenis.stop(),
      start: () => lenis.start(),
    };

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      handle.current = null;
    };
  }, [enabled]);

  return handle;
}
