import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS, type Project } from '../data/site';
import { horizontalRig } from '../animations/scroll';
import { asset } from '../utils/assets';
import { MiniProjectScene } from '../3d/MiniProjectScene';
import { useIsTablet } from '../hooks/useMediaQuery';
import './Work.css';

interface Props {
  onOpenProject: (project: Project) => void;
}

/**
 * Work — vertical scroll scrubs a horizontal journey through four
 * full-scale projects. Images drift against the motion; the MONOLITH
 * panel carries a live 3D preview that leans toward the cursor.
 */
export function Work({ onOpenProject }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const shardHovered = useRef(false);
  const isTablet = useIsTablet();
  const [isDesktop, setIsDesktop] = useState(() => !isTablet);

  useEffect(() => {
    setIsDesktop(!isTablet);
  }, [isTablet]);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!section || !pin || !track) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      // header entrance
      gsap.fromTo(
        '[data-reveal="line"]',
        { yPercent: 118 },
        {
          yPercent: 0,
          duration: 1.15,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.work__head', start: 'top 82%', once: true },
        },
      );

      if (!isDesktop || reduced) return;

      // the horizontal rig — the heart of this section
      const rig = horizontalRig(section.querySelector<HTMLElement>('.work__pin') as HTMLElement, track);
      const rigAnim = rig.animation as gsap.core.Tween;

      // images drift against the track for depth
      track.querySelectorAll<HTMLElement>('.work__media-inner').forEach((el) => {
        const panel = el.closest('.work__panel') as HTMLElement;
        gsap.fromTo(
          el,
          { xPercent: -5 },
          {
            xPercent: 5,
            ease: 'none',
            scrollTrigger: {
              trigger: panel,
              containerAnimation: rigAnim,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          },
        );
      });

      // per-panel entrance offsets
      gsap.utils.toArray<HTMLElement>('.work__panel-name').forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: 30, opacity: 0.2 },
          {
            yPercent: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              containerAnimation: rigAnim,
              start: 'left 88%',
              end: 'left 52%',
              scrub: true,
            },
          },
        );
      });

      return () => rig.kill();
    }, section);

    return () => ctx.revert();
  }, [isDesktop]);

  return (
    <section ref={sectionRef} id="work" className="work" aria-label="Selected work">
      <div className="work__head shell">
        <header className="work__header">
          <p className="meta">
            <span className="meta--accent">04</span> &mdash; SELECTED WORK
          </p>
          <p className="meta">{`SCROLL TO TRAVEL →`}</p>
        </header>

        <h2 className="display display-l work__title">
          <span className="split-line">
            <span data-reveal="line" className="split-word">
              FOUR WORLDS,
            </span>
          </span>
          <span className="split-line">
            <span data-reveal="line" className="split-word">
              ONE OBSESSION.
            </span>
          </span>
        </h2>
      </div>

      <div ref={pinRef} className="work__pin">
        <div ref={trackRef} className="work__track">
          {PROJECTS.map((project) => (
            <article
              key={project.index}
              className="work__panel"
              onMouseEnter={() => {
                if (project.preview === 'webgl') shardHovered.current = true;
              }}
              onMouseLeave={() => {
                if (project.preview === 'webgl') shardHovered.current = false;
              }}
            >
              <div className="work__panel-top">
                <span className="meta meta--accent">{`PROJECT ${project.index}`}</span>
                <span className="meta">{project.category}</span>
              </div>

              <button
                type="button"
                className="work__media"
                onClick={() => onOpenProject(project)}
                data-cursor="VIEW"
                aria-label={`Open ${project.name} project`}
              >
                <div className="work__media-inner">
                  {project.preview === 'webgl' ? (
                    <MiniProjectScene hovered={shardHovered} className="work__mini-scene" />
                  ) : (
                    <img src={asset(project.image)} alt={`${project.name} project visual`} loading="lazy" />
                  )}
                </div>
                <span className="work__media-hint meta">OPEN CASE</span>
              </button>

              <div className="work__panel-bottom">
                <h3 className="display display-m work__panel-name">{project.name}</h3>
                <div className="work__panel-info">
                  <p className="body-copy">{project.description}</p>
                  <div className="work__panel-meta">
                    <span className="meta">{project.year}</span>
                    <span className="work__tags meta">{project.tags.join(' / ')}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}

          <div className="work__end" aria-hidden="true">
            <p className="meta">END OF SELECTION</p>
            <p className="display display-m">
              YOURS
              <br />
              NEXT?
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Keep ScrollTrigger honest after fonts/images settle. */
export function refreshScroll(): void {
  ScrollTrigger.refresh();
}
