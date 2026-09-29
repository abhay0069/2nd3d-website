import { gsap, ScrollTrigger } from './gsapSetup';
import { splitWords, splitChars } from '../utils/dom';

/**
 * Typography choreography — reusable reveal patterns.
 * All helpers stay readable: masks keep layout stable while
 * words/chars rise into place.
 */

interface RevealOptions {
  trigger?: HTMLElement | string;
  start?: string;
  stagger?: number;
  duration?: number;
  delay?: number;
  y?: number;
  rotate?: number;
  once?: boolean;
  onEnter?: () => void;
}

/** Words rise from a clipped mask. */
export function revealWords(el: HTMLElement, options: RevealOptions = {}): gsap.core.Tween {
  const words = splitWords(el);
  const {
    trigger = el,
    start = 'top 88%',
    stagger = 0.07,
    duration = 1.1,
    delay = 0,
    y = 0,
    rotate = 0,
    once = true,
    onEnter,
  } = options;

  return gsap.fromTo(
    words,
    { yPercent: 118, rotate },
    {
      yPercent: y,
      rotate: 0,
      duration,
      delay,
      stagger,
      ease: 'expo.out',
      scrollTrigger: {
        trigger,
        start,
        once,
        onEnter,
      },
    },
  );
}

/** Characters scatter in with a slight rotation — used for hero-scale type. */
export function revealChars(el: HTMLElement, options: RevealOptions = {}): gsap.core.Tween {
  const chars = splitChars(el);
  const { trigger = el, start = 'top 92%', stagger = 0.024, duration = 0.9, delay = 0, rotate = 7 } =
    options;

  return gsap.fromTo(
    chars,
    { yPercent: 120, rotate, opacity: 0 },
    {
      yPercent: 0,
      rotate: 0,
      opacity: 1,
      duration,
      delay,
      stagger: { each: stagger, from: 'start' },
      ease: 'expo.out',
      scrollTrigger: { trigger, start },
    },
  );
}

/**
 * Scrubbed word-by-word highlight: words transition from dim to full
 * opacity as the section crosses the viewport. The signature
 * "progressive reading" effect.
 */
export function scrubWords(el: HTMLElement, dim = 0.14): gsap.core.Tween {
  const words = splitWords(el, { mask: false });
  return gsap.fromTo(
    words,
    { opacity: dim, y: 24 },
    {
      opacity: 1,
      y: 0,
      ease: 'none',
      stagger: 1,
      scrollTrigger: {
        trigger: el,
        start: 'top 78%',
        end: 'bottom 42%',
        scrub: 0.6,
      },
    },
  );
}

/** Simple clip-reveal for media blocks. */
export function clipReveal(
  el: HTMLElement,
  options: { trigger?: HTMLElement; start?: string; delay?: number } = {},
): gsap.core.Tween {
  const { trigger = el, start = 'top 85%', delay = 0 } = options;
  return gsap.fromTo(
    el,
    { clipPath: 'inset(100% 0% 0% 0%)', y: 60 },
    {
      clipPath: 'inset(0% 0% 0% 0%)',
      y: 0,
      duration: 1.35,
      delay,
      ease: 'expo.inOut',
      scrollTrigger: { trigger, start },
    },
  );
}

/**
 * Velocity-reactive skew for typographic blocks — type leans into
 * the direction of scroll and springs back when scrolling stops.
 */
export function velocitySkew(el: HTMLElement, maxSkew = 8): () => void {
  const setter = gsap.quickTo(el, 'skewY', { duration: 0.55, ease: 'power3.out' });
  const onScroll = (self: ScrollTrigger) => {
    const v = gsap.utils.clamp(-maxSkew, maxSkew, self.getVelocity() / 220);
    setter(v);
    gsap.to(el, { skewY: 0, duration: 0.9, ease: 'elastic.out(1, 0.42)', overwrite: 'auto', delay: 0.06 });
  };
  const st = ScrollTrigger.create({ trigger: el, start: 'top bottom', end: 'bottom top', onUpdate: onScroll });
  return () => {
    st.kill();
  };
}
