import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Global defaults — the house easing curve is out-expo.
gsap.defaults({
  ease: 'expo.out',
  duration: 1,
});

ScrollTrigger.defaults({
  markers: false,
  toggleActions: 'play none none reverse',
});

/** Central cleanup helper so route-level code never leaks triggers. */
export const killTriggers = (scope: HTMLElement | null): void => {
  if (!scope) return;
  ScrollTrigger.getAll()
    .filter((t) => t.vars?.trigger && scope.contains(t.vars.trigger as Element))
    .forEach((t) => t.kill());
};

export { gsap, ScrollTrigger };
