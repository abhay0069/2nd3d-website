import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { scrubWords, velocitySkew } from '../animations/text';
import './Manifesto.css';

/**
 * Manifesto — the editorial heart. Huge type reveals word by word
 * as you scroll (progressive reading), leaning slightly with
 * scroll velocity. Enormous negative space around it.
 */
export function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      const statements = section.querySelectorAll<HTMLElement>('[data-scrub]');
      const cleanups: Array<() => void> = [];

      statements.forEach((el) => {
        if (reduced) {
          gsap.set(el.querySelectorAll('.split-word'), { opacity: 1, y: 0 });
          return;
        }
        scrubWords(el, 0.12);
        cleanups.push(velocitySkew(el, 3.2));
      });

      gsap.fromTo(
        '[data-reveal="copy"]',
        { opacity: 0, y: 34 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          scrollTrigger: { trigger: '[data-reveal="copy"]', start: 'top 85%', once: true },
        },
      );

      gsap.fromTo(
        '.manifesto__pillar',
        { opacity: 0, y: 44 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.14,
          scrollTrigger: { trigger: '.manifesto__pillars', start: 'top 88%', once: true },
        },
      );

      return () => cleanups.forEach((fn) => fn());
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="studio" className="manifesto section" aria-label="Studio manifesto">
      <div className="shell">
        <header className="manifesto__head">
          <p className="meta" data-reveal="label">
            <span className="meta--accent">02</span> &mdash; MANIFESTO
          </p>
          <p className="meta">OBSCURA / STUDIO</p>
        </header>

        <h2 className="manifesto__type display display-l">
          <span className="manifesto__statement" data-scrub>
            WE DON&rsquo;T JUST BUILD WEBSITES.
          </span>
          <span className="manifesto__statement manifesto__statement--indent" data-scrub>
            WE BUILD EXPERIENCES THAT <em className="manifesto__accent">LINGER.</em>
          </span>
        </h2>

        <div className="manifesto__grid">
          <p className="body-copy manifesto__copy" data-reveal="copy">
            OBSCURA is a digital atelier working across interaction, motion and spatial
            computing. We partner with ambitious brands and cultural institutions to build
            experiences that feel <em>inevitable</em> &mdash; precise in craft, unexpected in form.
            The screen is not a page. It is a place.
          </p>

          <div className="manifesto__pillars">
            <article className="manifesto__pillar">
              <span className="meta meta--accent">CRAFT</span>
              <p>Every pixel, curve and millisecond is composed. Nothing ships by accident.</p>
            </article>
            <article className="manifesto__pillar">
              <span className="meta meta--accent">MOTION</span>
              <p>Time is our second typography. Movement carries meaning, never decoration.</p>
            </article>
            <article className="manifesto__pillar">
              <span className="meta meta--accent">MEANING</span>
              <p>Technology disappears. What remains is an impression that outlives the visit.</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
