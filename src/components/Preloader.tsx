import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { splitChars } from '../utils/dom';
import './Preloader.css';

interface Props {
  onDone: () => void;
}

const COLUMNS = 5;

/**
 * Opening sequence — dark room, two statements, a purposeful
 * counter, then the frame wipes away into the experience.
 */
export function Preloader({ onDone }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    const count = countRef.current;
    const bar = barRef.current;
    const status = statusRef.current;
    const columns = columnsRef.current;
    if (!root || !count || !bar || !status || !columns) return;

    document.body.classList.add('is-locked');

    const titleLines = root.querySelectorAll<HTMLElement>('.preloader__title-inner');
    const counters = { value: 0 };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const tl = gsap.timeline({
      onComplete: () => {
        if (doneRef.current) return;
        doneRef.current = true;
        document.body.classList.remove('is-locked');
        root.style.display = 'none';
        onDone();
      },
    });

    if (reduced) tl.timeScale(8);

    tl.to(titleLines, {
      y: 0,
      duration: 1,
      stagger: 0.12,
      ease: 'expo.out',
      onStart: () => {
        // split the status word for a char-level reveal later
        splitChars(status);
      },
    })
      .to(
        counters,
        {
          value: 100,
          duration: 1.45,
          ease: 'power2.inOut',
          onUpdate: () => {
            count.textContent = String(Math.round(counters.value)).padStart(3, '0');
            bar.style.transform = `scaleX(${counters.value / 100})`;
          },
        },
        0.28,
      )
      .add(() => {
        status.textContent = 'READY';
      })
      .add(() => {
        root.classList.add('is-exiting');
      }, '+=0.12')
      .to(
        Array.from(columns.children),
        {
          scaleY: 0,
          duration: 0.85,
          stagger: 0.05,
          ease: 'expo.inOut',
        },
        '+=0.02',
      );

    return () => {
      tl.kill();
      document.body.classList.remove('is-locked');
    };
  }, [onDone]);

  return (
    <div ref={rootRef} className="preloader" role="status" aria-live="polite" aria-label="Loading experience">
      <div className="preloader__row">
        <span className="meta">OBSCURA&reg;</span>
        <span className="meta">{`DIGITAL ATELIER`}</span>
      </div>

      <div className="preloader__center">
        <h1 className="preloader__title">
          <span className="preloader__title-line">
            <span className="preloader__title-inner">A DIGITAL</span>
          </span>
          <span className="preloader__title-line">
            <span className="preloader__title-inner">EXPERIENCE</span>
          </span>
        </h1>

        <div className="preloader__status">
          <span className="preloader__dot" />
          <span ref={statusRef} className="meta">
            INITIALIZING
          </span>
        </div>

        <span ref={countRef} className="preloader__count" aria-hidden="true">
          000
        </span>

        <div className="preloader__bar">
          <div ref={barRef} className="preloader__bar-fill" />
        </div>
      </div>

      <div className="preloader__row">
        <span className="meta">LOADING SYSTEMS</span>
        <span className="meta">&copy; 2026</span>
      </div>

      <div ref={columnsRef} className="preloader__columns" aria-hidden="true">
        {Array.from({ length: COLUMNS }).map((_, i) => (
          <div key={i} className="preloader__column" />
        ))}
      </div>
    </div>
  );
}
