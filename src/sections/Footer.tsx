import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { SITE, SOCIALS } from '../data/site';
import type { SmoothScrollRef } from '../hooks/useSmoothScroll';
import { useReducedMotion } from '../hooks/useReducedMotion';
import './Footer.css';

interface Props {
  scrollRef: SmoothScrollRef;
}

/**
 * Footer — a final statement, nothing more. Built to be experienced.
 */
export function Footer({ scrollRef }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.footer__statement-line',
        { yPercent: 118 },
        {
          yPercent: 0,
          duration: 1.25,
          stagger: 0.12,
          ease: 'expo.out',
          scrollTrigger: { trigger: section, start: 'top 78%', once: true },
        },
      );

      gsap.fromTo(
        '.footer__meta-col',
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.footer__meta', start: 'top 92%', once: true },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const backToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, { duration: 1.8 });
    } else {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    }
  };

  return (
    <footer ref={sectionRef} className="footer" aria-label="Footer">
      <div className="shell">
        <h2 className="footer__statement display display-l">
          <span className="footer__statement-mask">
            <span className="footer__statement-line">BUILT TO</span>
          </span>
          <span className="footer__statement-mask">
            <span className="footer__statement-line footer__statement-line--accent">BE EXPERIENCED.</span>
          </span>
        </h2>

        <div className="footer__meta">
          <div className="footer__meta-col">
            <p className="meta footer__meta-label">STUDIO</p>
            <p className="footer__meta-value">
              &copy; 2026 {SITE.legalName}
              <br />
              {SITE.tagline} &mdash; {SITE.est}
            </p>
          </div>

          <div className="footer__meta-col">
            <p className="meta footer__meta-label">SOCIAL</p>
            <ul className="footer__links">
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    className="link-sweep footer__link"
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="OPEN"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__meta-col">
            <p className="meta footer__meta-label">CONTACT</p>
            <a href={`mailto:${SITE.email}`} className="link-sweep footer__link" data-cursor="WRITE">
              {SITE.email}
            </a>
            <p className="footer__meta-value footer__meta-value--dim">{SITE.location} &mdash; {SITE.coordinates}</p>
          </div>

          <div className="footer__meta-col footer__meta-col--end">
            <button
              type="button"
              className="footer__top-btn"
              onClick={backToTop}
              data-cursor="TOP"
              aria-label="Back to top"
            >
              <span className="footer__top-arrow" aria-hidden="true">
                &uarr;
              </span>
              BACK TO TOP
            </button>
          </div>
        </div>

        <div className="footer__wordmark" aria-hidden="true">
          {SITE.name}
        </div>
      </div>
    </footer>
  );
}
