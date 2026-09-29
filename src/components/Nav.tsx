import { useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from '../animations/gsapSetup';
import { NAV, SITE, SOCIALS } from '../data/site';
import type { SmoothScrollRef } from '../hooks/useSmoothScroll';
import { SoundToggle } from './SoundToggle';
import { LiveClock } from './LiveClock';
import './Nav.css';

interface Props {
  ready: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  scrollRef: SmoothScrollRef;
}

/**
 * Minimal navigation — transforms during scrolling (hides going
 * down, returns going up) and doubles as the sound control.
 * Blend-difference keeps it legible across inverted bands.
 */
export function Nav({ ready, soundEnabled, onToggleSound, scrollRef }: Props) {
  const navRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const nav = navRef.current;
    const progress = progressRef.current;
    if (!nav || !progress) return;

    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const y = self.scroll();
        progress.style.transform = `scaleX(${self.progress})`;

        if (y > lastY.current && y > 320 && !open) {
          nav.classList.add('is-hidden');
        } else {
          nav.classList.remove('is-hidden');
        }
        lastY.current = y;
      },
    });

    return () => st.kill();
  }, [open]);

  const goTo = (href: string) => {
    setOpen(false);
    const target = href.replace('#', '');
    if (scrollRef.current) {
      scrollRef.current.scrollTo(`#${target}`, { offset: -20, duration: 1.6 });
    } else {
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        ref={navRef}
        className={`nav ${open ? 'is-open' : ''} ${ready ? 'is-ready' : ''}`}
        style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.9s ease 0.15s, transform 0.6s cubic-bezier(0.16,1,0.3,1)' }}
      >
        <div className="nav__inner">
          <a
            href="#top"
            className="nav__logo"
            data-cursor="TOP"
            onClick={(e) => {
              e.preventDefault();
              goTo('#top');
            }}
          >
            {SITE.name}
            <span className="nav__logo-mark">&reg;</span>
          </a>

          <nav className="nav__links" aria-label="Primary">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="nav__link"
                data-cursor="GO"
                onClick={(e) => {
                  e.preventDefault();
                  goTo(item.href);
                }}
              >
                <span className="nav__link-text">{item.label}</span>
              </a>
            ))}
          </nav>

          <div className="nav__right">
            <SoundToggle enabled={soundEnabled} onToggle={onToggleSound} />
            <button
              type="button"
              className="nav__menu-btn"
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="nav__menu-line" />
              <span className="nav__menu-line" />
            </button>
          </div>
        </div>
      </header>

      {/* progress hairline — outside the blend-difference tree so the
          accent stays ember on both dark and paper bands */}
      <div ref={progressRef} className="nav__progress" aria-hidden="true" />

      <div className={`nav-overlay ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <nav className="nav-overlay__links" aria-label="Mobile">
          {NAV.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              className="nav-overlay__link"
              style={{ transitionDelay: `${0.12 + i * 0.07}s` }}
              onClick={(e) => {
                e.preventDefault();
                goTo(item.href);
              }}
            >
              <small>{String(i + 1).padStart(2, '0')}</small>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="nav-overlay__foot">
          <a className="meta link-sweep" href={`mailto:${SITE.email}`}>
            {SITE.email}
          </a>
          <span className="meta">
            {SITE.location} — <LiveClock />
          </span>
        </div>
        <div className="nav-overlay__socials" aria-hidden="true">
          {SOCIALS.map((s) => s.label).join(' · ')}
        </div>
      </div>
    </>
  );
}
