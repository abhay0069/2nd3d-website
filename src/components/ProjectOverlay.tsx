import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Project } from '../data/site';
import './ProjectOverlay.css';

interface Props {
  project: Project | null;
  onClose: () => void;
}

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Full-screen project reveal — opens like a curtain, closes on
 * Escape / backdrop / CLOSE. Deep-linkable content lives in data/.
 */
export function ProjectOverlay({ project, onClose }: Props) {
  useEffect(() => {
    if (!project) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.classList.add('is-locked');

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('is-locked');
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="project-overlay"
          initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 0.85, ease }}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.name} project detail`}
        >
          <div className="project-overlay__bar">
            <span className="meta meta--accent">{`PROJECT ${project.index}`}</span>
            <button type="button" className="project-overlay__close link-sweep" onClick={onClose} data-cursor="CLOSE">
              CLOSE
            </button>
          </div>

          <div className="project-overlay__body">
            <motion.div
              className="project-overlay__visual img-wrap"
              initial={{ scale: 1.12, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 1.1, ease, delay: 0.12 }}
            >
              <img src={project.image} alt={`${project.name} — project visual`} loading="lazy" />
            </motion.div>

            <div className="project-overlay__text">
              <motion.h2
                className="display display-m project-overlay__name"
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, ease, delay: 0.22 }}
              >
                {project.name}
              </motion.h2>

              <motion.p
                className="body-copy project-overlay__desc"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, ease, delay: 0.3 }}
              >
                {project.description} Built as a single continuous system — from first frame
                to final interaction, every detail is composed to be felt before it is read.
              </motion.p>

              <motion.dl
                className="project-overlay__meta"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, ease, delay: 0.42 }}
              >
                <div>
                  <dt className="meta">YEAR</dt>
                  <dd>{project.year}</dd>
                </div>
                <div>
                  <dt className="meta">CATEGORY</dt>
                  <dd>{project.category}</dd>
                </div>
                <div>
                  <dt className="meta">SCOPE</dt>
                  <dd>{project.tags.join(' / ')}</dd>
                </div>
              </motion.dl>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
