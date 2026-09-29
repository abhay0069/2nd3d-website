import { gsap, ScrollTrigger } from './gsapSetup';
import { mapRange } from '../utils/math';

/**
 * Scroll choreography helpers shared by sections.
 */

/** Parallax an inner element against its container's scroll progress. */
export function parallax(
  el: HTMLElement,
  distance = 120,
  options: { trigger?: HTMLElement; start?: string; end?: string } = {},
): gsap.core.Tween {
  const { trigger = el, start = 'top bottom', end = 'bottom top' } = options;
  return gsap.fromTo(
    el,
    { y: -distance / 2 },
    {
      y: distance / 2,
      ease: 'none',
      scrollTrigger: { trigger, start, end, scrub: true },
    },
  );
}

/**
 * Build a horizontal-scroll rig: vertical scroll scrubs the track
 * sideways while the viewport is pinned. Returns the trigger so
 * callers can kill it on teardown.
 */
export function horizontalRig(
  section: HTMLElement,
  track: HTMLElement,
  onUpdate?: (progress: number) => void,
): ScrollTrigger {
  const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);

  return gsap.to(track, {
    x: () => -getDistance(),
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => `+=${getDistance() + window.innerHeight * 0.55}`,
      pin: true,
      scrub: 0.85,
      invalidateOnRefresh: true,
      anticipatePin: 1,
      onUpdate: (self) => onUpdate?.(self.progress),
    },
  }).scrollTrigger as ScrollTrigger;
}

/**
 * Fade + drift a layer based on scroll progress — used for the
 * hero → manifesto hand-off where the 3D structure drifts away.
 */
export function scrubRange(
  el: HTMLElement,
  from: gsap.TweenVars,
  to: gsap.TweenVars,
  trigger: HTMLElement,
  start = 'top top',
  end = 'bottom top',
): gsap.core.Tween {
  return gsap.fromTo(
    el,
    { ...from },
    {
      ...to,
      ease: 'none',
      scrollTrigger: { trigger, start, end, scrub: 0.7 },
    },
  );
}

/** Section-entry choreography for a header block (label + title + copy). */
export function headerReveal(scope: HTMLElement): ReturnType<typeof gsap.context> {
  const ctx = gsap.context(() => {
    const label = scope.querySelector<HTMLElement>('[data-reveal="label"]');
    const lines = scope.querySelectorAll<HTMLElement>('[data-reveal="line"]');
    const copy = scope.querySelector<HTMLElement>('[data-reveal="copy"]');

    const tl = gsap.timeline({
      scrollTrigger: { trigger: scope, start: 'top 78%', once: true },
    });

    if (label) tl.fromTo(label, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7 }, 0);
    if (lines.length) {
      tl.fromTo(
        lines,
        { yPercent: 115 },
        { yPercent: 0, duration: 1.15, stagger: 0.1, ease: 'expo.out' },
        0.08,
      );
    }
    if (copy) tl.fromTo(copy, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.9 }, 0.42);
  }, scope);

  return ctx;
}

export const scrollProgress = (trigger: HTMLElement, cb: (p: number) => void): ScrollTrigger =>
  ScrollTrigger.create({
    trigger,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => cb(self.progress),
  });

export const mapScroll = mapRange;
