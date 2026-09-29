import { useEffect, useRef } from 'react';
import { gsap } from '../animations/gsapSetup';
import { EXPERIMENTS } from '../data/site';
import { FieldExperiment, TypeExperiment, TraceExperiment } from '../components/experiments/CanvasExperiments';
import { FluxExperiment } from '../components/experiments/FluxExperiment';
import './Lab.css';

/**
 * Lab — four small, polished digital experiments. Each tile is a
 * live instrument: particles, type tension, liquid shader, gesture
 * memory. The section is the studio's R&D table.
 */
export function Lab() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.lab__tile',
        { opacity: 0, y: 64 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          stagger: 0.12,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.lab__grid', start: 'top 82%', once: true },
        },
      );

      gsap.fromTo(
        '[data-reveal="line"]',
        { yPercent: 118 },
        {
          yPercent: 0,
          duration: 1.15,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.lab__head', start: 'top 82%', once: true },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const renderExperiment = (kind: string) => {
    switch (kind) {
      case 'field':
        return <FieldExperiment />;
      case 'type':
        return <TypeExperiment />;
      case 'flux':
        return <FluxExperiment />;
      case 'trace':
        return <TraceExperiment />;
      default:
        return null;
    }
  };

  return (
    <section ref={sectionRef} id="lab" className="lab section" aria-label="Experiments lab">
      <div className="shell">
        <header className="lab__head">
          <div>
            <p className="meta">
              <span className="meta--accent">05</span> &mdash; LAB
            </p>
            <h2 className="display display-l lab__title">
              <span className="split-line">
                <span data-reveal="line" className="split-word">
                  EXPERIMENTS
                </span>
              </span>
              <span className="split-line">
                <span data-reveal="line" className="split-word lab__title-dim">
                  IN THE OPEN
                </span>
              </span>
            </h2>
          </div>
          <p className="body-copy lab__note">
            Small instruments from the studio floor &mdash; studies in presence, tension, matter
            and memory. Everything here is live. Move your cursor.
          </p>
        </header>

        <div className="lab__grid">
          {EXPERIMENTS.map((exp, i) => (
            <article key={exp.index} className={`lab__tile lab__tile--${i}`} data-cursor="PLAY">
              <div className="lab__tile-top">
                <span className="meta">{exp.code}</span>
                <span className="meta meta--accent">{exp.index}</span>
              </div>

              <div className="lab__stage">{renderExperiment(exp.kind)}</div>

              <div className="lab__tile-bottom">
                <h3 className="display lab__tile-title">{exp.title}</h3>
                <p className="meta lab__tile-caption">{exp.caption}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
