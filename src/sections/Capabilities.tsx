import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { CAPABILITIES } from '../data/site';
import { asset } from '../utils/assets';
import { useIsMobile } from '../hooks/useMediaQuery';
import './Capabilities.css';

/**
 * Capabilities — an inverted (paper) band that expands into view.
 * The list itself is the interface: hovering a row summons a
 * cursor-following visual and shifts the typography. Instant, fluid.
 */
export function Capabilities() {
  const sectionRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const previewImgRef = useRef<HTMLImageElement>(null);
  const isMobile = useIsMobile();
  const [active, setActive] = useState<number | null>(null);

  /* cursor-following preview */
  useEffect(() => {
    const section = sectionRef.current;
    const preview = previewRef.current;
    if (!section || !preview || isMobile) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const tick = () => {
      currentX += (mouseX - currentX) * 0.09;
      currentY += (mouseY - currentY) * 0.09;

      const rect = section.getBoundingClientRect();
      const vx = mouseX - currentX;
      const rotate = gsap.utils.clamp(-6, 6, vx * 0.06);

      preview.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) rotate(${rotate}deg)`;
      void rect;
      raf = requestAnimationFrame(tick);
    };

    section.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      section.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [isMobile]);

  /* band expands from a centered card into the full-bleed paper field */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const bg = section.querySelector('.capabilities__bg');

      if (bg) {
        gsap.fromTo(
          bg,
          { clipPath: 'inset(12% 4% round 10px)' },
          {
            clipPath: 'inset(0% 0% round 0px)',
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top 82%',
              end: 'top 22%',
              scrub: 0.6,
            },
          },
        );
      }

      gsap.fromTo(
        '.capabilities__row',
        { opacity: 0, y: 42 },
        {
          opacity: 1,
          y: 0,
          duration: 0.95,
          stagger: 0.09,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.capabilities__list', start: 'top 82%', once: true },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const swapPreview = (index: number) => {
    setActive(index);
  };

  /* animate the preview image each time the active row changes */
  useEffect(() => {
    if (active === null || isMobile) return;
    const img = previewImgRef.current;
    if (!img) return;

    const tween = gsap.fromTo(
      img,
      { opacity: 0, scale: 1.12, yPercent: 4 },
      { opacity: 1, scale: 1, yPercent: 0, duration: 0.6, ease: 'expo.out', overwrite: true },
    );
    return () => {
      tween.kill();
    };
  }, [active, isMobile]);

  return (
    <section ref={sectionRef} id="capabilities" className="capabilities" aria-label="Capabilities" data-theme="light">
      <div className="capabilities__bg" aria-hidden="true" />

      <div className="capabilities__inner shell">
        <header className="capabilities__head">
          <p className="meta">
            <span className="meta--accent">03</span> &mdash; CAPABILITIES
          </p>
          <p className="meta">FIVE DISCIPLINES / ONE SYSTEM</p>
        </header>

        <h2 className="display display-m capabilities__title">
          WHAT WE
          <br />
          WORK WITH
        </h2>

        <ul className="capabilities__list">
          {CAPABILITIES.map((cap, i) => (
            <li
              key={cap.index}
              className={`capabilities__row ${active === i ? 'is-active' : ''}`}
              onMouseEnter={() => swapPreview(i)}
              onMouseLeave={() => setActive(null)}
              data-cursor="EXPLORE"
            >
              <a href="#work" className="capabilities__row-link" onClick={(e) => e.preventDefault()}>
                <span className="capabilities__index meta">{cap.index}</span>
                <span className="capabilities__name display">{cap.title}</span>
                <span className="capabilities__desc">{cap.description}</span>
                <span className="capabilities__arrow" aria-hidden="true">
                  &rarr;
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* cursor-following visual preview (desktop) */}
      <div
        ref={previewRef}
        className={`capabilities__preview ${active !== null ? 'is-visible' : ''}`}
        aria-hidden="true"
      >
        <img
          ref={previewImgRef}
          src={asset(CAPABILITIES[active ?? 0].image)}
          alt=""
          className="capabilities__preview-img"
          draggable={false}
        />
      </div>
    </section>
  );
}
