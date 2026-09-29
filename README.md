# OBSCURA — Digital Atelier

An experimental, award-grade studio experience. Original identity, typography, motion system
and WebGL — built as one continuous visual journey.

> **Note on references:** inspired by the *level of craft* of leading digital studios —
> no code, branding, copy, layouts or assets from any existing site are used.

## Stack

- **React 18 + TypeScript + Vite**
- **Three.js / React Three Fiber / Drei** — custom GLSL materials, procedural geometry, GPU particles
- **GSAP + ScrollTrigger** — scroll choreography, pinned horizontal rig, text reveals
- **Lenis** — inertial smooth scrolling, synced to the GSAP ticker
- **Framer Motion** — overlay transitions
- **WebAudio** — procedural ambient drone (off by default, no audio assets)

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production bundle
npm run preview    # serve the production build
```

Copy `.env.example` to `.env` for optional configuration.

## Architecture

```
src/
  animations/    GSAP choreography helpers (text reveals, horizontal rig, scrub ranges)
  components/    Cursor, Preloader, Nav, Marquee, Magnetic, ProjectOverlay, experiments/
  3d/            HeroScene (camera rig, lights, post), MorphStructure, ParticleField, MiniProjectScene
  shaders/       GLSL (simplex noise, morph material, particle material)
  hooks/         useSmoothScroll (Lenis), useMouse, useMagnetic, useCanvas2D, useAmbientSound…
  sections/      Hero, Manifesto, Capabilities, Work, Lab, Contact, Footer
  data/          All content (projects, capabilities, experiments, site meta)
  styles/        Design tokens, base primitives, app chrome
  utils/         Math, DOM splitting, shared scene state
```

### The hero sandwich

The headline and the WebGL sculpture share one stacking context: back type (`z1`) → canvas (`z2`)
→ front type (`z3`). The sculpture is literally woven through the words.

### Motion language

- Fast interaction: 150–250 ms · transitions: 400–700 ms · cinematic: 800–1500 ms
- House easing: `expo.out`; scrubbed effects are velocity-aware
- `prefers-reduced-motion` collapses timing, disables smooth scroll and camera drift
- Custom cursor (fine pointers only), film grain, magnetic CTAs, live studio clock

## Performance

- One draw call for 1500 GPU particles (420 on mobile), shared shader programs
- Post-processing (bloom / vignette / grain) disabled on mobile; DPR clamped
- Code-split vendor chunks (`three`, `motion`), lazy images
- Layout-stable media (aspect boxes) so ScrollTrigger never thrashes

## Accessibility

Semantic landmarks, skip link, ARIA labels, keyboard-reachable controls,
`prefers-reduced-motion` support, readable contrast on both dark and paper bands.
