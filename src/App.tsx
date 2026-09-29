import { useCallback, useEffect, useState } from 'react';
import { Preloader } from './components/Preloader';
import { Cursor } from './components/Cursor';
import { Grain } from './components/Grain';
import { Nav } from './components/Nav';
import { ProjectOverlay } from './components/ProjectOverlay';
import { Hero } from './sections/Hero';
import { Manifesto } from './sections/Manifesto';
import { Marquee } from './components/Marquee';
import { Capabilities } from './sections/Capabilities';
import { Work } from './sections/Work';
import { Lab } from './sections/Lab';
import { Contact } from './sections/Contact';
import { Footer } from './sections/Footer';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { usePointerBridge } from './hooks/usePointerBridge';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useAmbientSound } from './hooks/useAmbientSound';
import { sceneState } from './utils/sceneState';
import type { Project } from './data/site';

/**
 * OBSCURA — one continuous visual journey.
 *
 * Layer order (deliberate):
 *   hero back-type (z1) → WebGL (z2) → hero front-type / sections (z3)
 *   → chrome (nav/cursor/grain) → preloader / overlays.
 */
export default function App() {
  const [ready, setReady] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const reduced = useReducedMotion();
  const scrollRef = useSmoothScroll({ enabled: !reduced });
  const { enabled: soundEnabled, toggle: toggleSound } = useAmbientSound();

  usePointerBridge();

  useEffect(() => {
    sceneState.reduced = reduced;
  }, [reduced]);

  const handlePreloaderDone = useCallback(() => {
    setReady(true);
    sceneState.introEnabled = true;
  }, []);

  return (
    <>
      <a
        href="#main"
        className="skip-link meta"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('main')?.focus();
        }}
      >
        SKIP TO CONTENT
      </a>

      <Grain />
      <Cursor />

      <Nav
        ready={ready}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        scrollRef={scrollRef}
      />

      <main id="main" tabIndex={-1}>
        <Hero ready={ready} />
        <Manifesto />
        <Marquee
          items={['DIGITAL EXPERIENCES', 'CREATIVE DEVELOPMENT', '3D & MOTION', 'BRAND SYSTEMS']}
        />
        <Capabilities />
        <Work onOpenProject={setActiveProject} />
        <Lab />
        <Contact />
      </main>

      <Footer scrollRef={scrollRef} />

      <ProjectOverlay project={activeProject} onClose={() => setActiveProject(null)} />

      {!ready && <Preloader onDone={handlePreloaderDone} />}
    </>
  );
}
