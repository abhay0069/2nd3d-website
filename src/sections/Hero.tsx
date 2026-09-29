import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../animations/gsapSetup';
import { splitChars } from '../utils/dom';
import { sceneState } from '../utils/sceneState';
import { HeroScene } from '../3d/HeroScene';
import './Hero.css';

interface Props {
  ready: boolean;
}

const LINES = ['WE SCULPT', 'DIGITAL', 'MATTER'];

/**
 * Hero — enormous typography woven through the WebGL sculpture.
 * Three sibling layers share one stacking context:
 *   back type (z1) → WebGL (z2) → front type (z3).
 * The middle line renders behind the sculpture, the outer lines
 * in front — the object lives *inside* the headline.
 */
export function Hero({ ready }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const entranceRef = useRef<gsap.core.Timeline | null>(null);

  /* — entrance + scroll choreography — */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Split chars in every line of BOTH layers, then reveal each
    // char index across both layers simultaneously (perfect sync).
    const layers = Array.from(section.querySelectorAll<HTMLElement>('.hero__line'));
    const charsPerLine: HTMLElement[][] = layers.map((line) => splitChars(line));

    const entrance = gsap.timeline({ paused: true });
    for (let lineIndex = 0; lineIndex < 3; lineIndex++) {
      const backChars = charsPerLine[lineIndex];
      const frontChars = charsPerLine[lineIndex + 3];
      const rotate = lineIndex === 1 ? -4 : 5;
      backChars.forEach((backChar, j) => {
        const frontChar = frontChars[j];
        entrance.fromTo(
          [backChar, frontChar],
          { yPercent: 124, rotate },
          { yPercent: 0, rotate: 0, duration: 1.05, ease: 'expo.out' },
          0.1 + lineIndex * 0.12 + j * 0.024,
        );
      });
    }

    entrance.fromTo(
      '.hero__eyebrow',
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 },
      0.15,
    );
    entrance.fromTo(
      '.hero__foot',
      { opacity: 0, y: 26 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.12 },
      0.7,
    );

    if (reduced) entrance.progress(1);
    entranceRef.current = entrance;

    /* scroll: the headline splits apart and the camera flies through */
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.8,
        onUpdate: (self) => {
          sceneState.heroProgress = self.progress;
        },
      },
    });

    scrollTl
      .to('.hero__line[data-line="0"]', { xPercent: -12, ease: 'none' }, 0)
      .to('.hero__line[data-line="1"]', { xPercent: 9, ease: 'none' }, 0)
      .to('.hero__line[data-line="2"]', { xPercent: -6, ease: 'none' }, 0)
      .to('.hero__title-stack', { yPercent: -14, opacity: 0, ease: 'none' }, 0.42)
      .to('.hero__foot', { opacity: 0, y: -40, ease: 'none' }, 0)
      .to('.hero__eyebrow', { opacity: 0, ease: 'none' }, 0.3);

    // Refresh once fonts settle to avoid split/measure drift.
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) {
      void document.fonts.ready.then(refresh);
    }

    return () => {
      entrance.kill();
      scrollTl.kill();
      entranceRef.current = null;
    };
  }, []);

  /* play the entrance when the preloader releases */
  useEffect(() => {
    if (!ready) return;
    entranceRef.current?.play();
  }, [ready]);

  return (
    <section ref={sectionRef} id="top" className="hero" aria-label="Introduction">
      <div className="hero__sticky">
        <div className="hero__frame shell">
          <p className="meta hero__eyebrow">
            OBSCURA &mdash; {`DIGITAL ATELIER`}
            <span className="hero__eyebrow-sep">/</span>
            EST. 2019
          </p>
          <p className="meta hero__eyebrow hero__eyebrow--right">
            WEBGL &middot; MOTION &middot; SPATIAL
          </p>
        </div>

        <h1 className="visually-hidden">We sculpt digital matter — OBSCURA digital atelier</h1>

        {/* back layer — the middle line passes behind the sculpture */}
        <div className="hero__title-stack hero__title-stack--back" aria-hidden="true">
          <div className="hero__title">
            {LINES.map((line, i) => (
              <span key={`b-${line}`} className={`hero__line-mask hero__line-mask--${i}`}>
                <span className="hero__line" data-line={i}>
                  {line}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* WebGL — sandwiched between the two type layers */}
        <HeroScene className="hero__webgl" />

        {/* front layer — the outer lines sit in front of the sculpture */}
        <div className="hero__title-stack hero__title-stack--front" aria-hidden="true">
          <div className="hero__title">
            {LINES.map((line, i) => (
              <span key={`f-${line}`} className={`hero__line-mask hero__line-mask--${i}`}>
                <span className={`hero__line ${i === 1 ? 'is-ghost' : ''}`} data-line={i}>
                  {line}
                </span>
              </span>
            ))}
          </div>
        </div>

        <div className="hero__foot shell">
          <div className="hero__cue" data-cursor="SCROLL">
            <span className="meta">SCROLL TO ENTER</span>
            <span className="hero__cue-line" aria-hidden="true" />
          </div>
          <p className="hero__intro">
            An independent atelier crafting immersive experiences at the edge of perception &mdash;
            where typography, motion and space become one material.
          </p>
          <p className="meta hero__chapter">
            <span className="meta--accent">01</span> / 06
          </p>
        </div>
      </div>
    </section>
  );
}
