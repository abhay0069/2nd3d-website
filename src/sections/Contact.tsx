import { useEffect, useRef } from 'react';
import { gsap } from '../animations/gsapSetup';
import { SITE, SOCIALS } from '../data/site';
import { revealWords } from '../animations/text';
import { Magnetic } from '../components/Magnetic';
import { LiveClock } from '../components/LiveClock';
import './Contact.css';

/**
 * Contact — the culmination. An inverted (paper) band with enormous
 * typography and a minimal contact system. No form; a conversation.
 */
export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const bg = section.querySelector('.contact__bg');
      if (bg) {
        gsap.fromTo(
          bg,
          { clipPath: 'inset(14% 4% round 10px)' },
          {
            clipPath: 'inset(0% 0% round 0px)',
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top 82%',
              end: 'top 24%',
              scrub: 0.6,
            },
          },
        );
      }

      section.querySelectorAll<HTMLElement>('[data-words]').forEach((el, i) => {
        revealWords(el, {
          trigger: el,
          start: 'top 86%',
          stagger: 0.085,
          delay: i * 0.06,
        });
      });

      gsap.fromTo(
        '.contact__col',
        { opacity: 0, y: 38 },
        {
          opacity: 1,
          y: 0,
          duration: 0.95,
          stagger: 0.12,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.contact__grid', start: 'top 88%', once: true },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="contact" className="contact" aria-label="Contact" data-theme="light">
      <div className="contact__bg" aria-hidden="true" />

      <div className="contact__inner shell">
        <header className="contact__head">
          <p className="meta">
            <span className="meta--accent">06</span> &mdash; CONTACT
          </p>
          <p className="meta">AVAILABLE FOR SELECT COMMISSIONS / 2026</p>
        </header>

        <h2 className="contact__type display display-l">
          <span data-words>LET&rsquo;S MAKE</span>
          <span data-words className="contact__line-indent">
            SOMETHING
          </span>
          <span data-words className="contact__accent">
            UNEXPECTED.
          </span>
        </h2>

        <div className="contact__grid">
          <div className="contact__col">
            <p className="meta contact__label">EMAIL</p>
            <Magnetic
              href={`mailto:${SITE.email}`}
              className="contact__email"
              strength={0.32}
              cursor="WRITE"
            >
              {SITE.email}
            </Magnetic>
            <p className="contact__hint">Tell us about the thing that doesn&rsquo;t exist yet.</p>
          </div>

          <div className="contact__col">
            <p className="meta contact__label">SOCIAL</p>
            <ul className="contact__socials">
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    className="link-sweep contact__social-link"
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

          <div className="contact__col">
            <p className="meta contact__label">LOCATION</p>
            <p className="contact__place">{SITE.location}</p>
            <p className="contact__coords">{SITE.coordinates}</p>
            <p className="contact__time meta">
              LOCAL TIME — <LiveClock />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
