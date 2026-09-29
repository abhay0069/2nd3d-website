# Architecture

OBSCURA is a single-page Vite application with a strict separation between **UI**,
**motion**, **3D**, **content** and **design system**. This document maps the modules
and explains the three patterns that everything else hangs on.

## Render layering

The page is a deliberate stack. Understanding it explains half the codebase:

| Layer | Element | z | Notes |
|-------|---------|---|-------|
| Chrome | `Cursor`, `Nav` | 70–90 | `mix-blend-mode: difference` inverts across dark/paper bands |
| Texture | `Grain` | 60 | SVG turbulence, `overlay`, 5% opacity |
| Overlays | `ProjectOverlay`, `Preloader` | 120–200 | curtain `clip-path` transitions |
| Content | `<section>` bands | 3 | opaque backgrounds; paper bands set `data-theme="light"` |
| **Hero sandwich** | back type → WebGL → front type | 1→2→3 | **one stacking context** inside `.hero__sticky` |
| Base | body | — | `--ink` background |

The sandwich only works because all three layers are siblings inside the sticky hero container.
See [README → The hero sandwich](../README.md#the-hero-sandwich).

## Module map

```
src/
├── main.tsx                  entry — StrictMode, global CSS
├── App.tsx                   composition root + experience phase (loading → ready)
│
├── data/site.ts              ALL content (projects, capabilities, experiments, meta)
│                             — editing copy never touches components
│
├── styles/
│   ├── tokens.css            palette, type scale, motion curves, spacing
│   ├── base.css              reset + shared primitives (display, meta, link-sweep…)
│   └── global.css            app chrome (grain, cursor, skip link)
│
├── hooks/
│   ├── useSmoothScroll.ts    Lenis ↔ GSAP ticker sync (one rAF total)
│   ├── usePointerBridge.ts   DOM pointer → sceneState (no React re-renders)
│   ├── useMagnetic.ts        magnetic hover targets
│   ├── useCanvas2D.ts        shared 2D canvas plumbing (DPR, resize, pointer)
│   ├── useAmbientSound.ts    procedural WebAudio drone (opt-in)
│   ├── useReducedMotion.ts   OS preference → `data-reduced-motion` + state
│   └── useMediaQuery.ts      responsive gates (mobile / tablet)
│
├── animations/
│   ├── gsapSetup.ts          plugin registration + house defaults (expo.out)
│   ├── text.ts               revealWords / revealChars / scrubWords / velocitySkew
│   └── scroll.ts             horizontalRig / parallax / scrubRange / headerReveal
│
├── shaders/
│   ├── noise.ts              Ashima simplex 3D (shared GLSL chunk)
│   ├── morph.ts              "living matter" vertex+fragment (displacement, fresnel, fog)
│   └── particles.ts          GPU dust field (drift + cursor repulsion in the vertex stage)
│
├── 3d/
│   ├── HeroScene.tsx         Canvas + CameraRig + lights + particles + post
│   ├── MorphStructure.tsx    the hero sculpture (custom ShaderMaterial)
│   ├── ParticleField.tsx     one-draw-call atmosphere
│   ├── SceneLights.tsx       key / fill / ember accent (follows cursor)
│   ├── Effects.tsx           bloom · vignette · grain (desktop only)
│   └── MiniProjectScene.tsx  low-cost shard for the MONOLITH work panel
│
├── components/
│   ├── Preloader.tsx         opening sequence (counter, column wipe)
│   ├── Cursor.tsx            dot → labelled disc, fine pointers only
│   ├── Nav.tsx               hide/show nav, progress hairline, mobile overlay
│   ├── Marquee.tsx           scroll-velocity strip
│   ├── Magnetic.tsx          magnetic CTA wrapper
│   ├── ProjectOverlay.tsx    curtain-style case reveal
│   ├── SoundToggle.tsx       SOUND ON / OFF
│   ├── LiveClock.tsx         Berlin studio clock
│   └── experiments/          FieldExperiment · TypeExperiment · TraceExperiment · FluxExperiment
│
├── sections/                 Hero · Manifesto · Capabilities · Work · Lab · Contact · Footer
│                             (each owns its CSS file and its GSAP context)
│
└── utils/
    ├── sceneState.ts         mutable bridge: ScrollTrigger ⇄ frame loop
    ├── math.ts               clamp / lerp / damp / mapRange / falloff
    └── dom.ts                splitWords / splitChars (free SplitText alternative)
```

## Pattern 1 — mutable `sceneState`

React state must never drive the 60 fps loops. Pointer, velocity, scroll progress and
intro phase live in a plain mutable object (`utils/sceneState.ts`):

- DOM events / ScrollTrigger **write** to it (`usePointerBridge`, hero scroll trigger)
- `useFrame` **reads** it (camera rig, materials, particles)

Result: zero re-renders from interaction. React only owns the *phase* (`loading → ready`)
and overlay state.

## Pattern 2 — GSAP context per section

Every section creates its animations inside `gsap.context(() => { … }, sectionEl)` and
returns `() => ctx.revert()`. Selector strings (`'.lab__tile'`) are scoped to the section,
so identically-named patterns never collide, and teardown is automatic.

Cross-layer synchronisation (hero chars) is solved by animating **both layers' matching
characters in the same tween step** — DOM order guarantees identical indices.

## Pattern 3 — the horizontal rig

`animations/scroll.ts → horizontalRig()` is the pinned Work journey:

1. Pin `.work__pin` (100vh) while vertical scroll continues.
2. Scrub the `.work__track` on X by `track.scrollWidth − innerWidth`.
3. Panel-level effects use `containerAnimation: rigTween` with `left/right` triggers.

On tablet/mobile the rig is never created — the track becomes a normal vertical stack
(CSS media query), preserving the storytelling without the pin.

## Scroll orchestration

```
Lenis (wheel/touch smoothing)
  └─ scroll event → ScrollTrigger.update()
GSAP ticker (single rAF)
  └─ lenis.raf(t) + sceneState smoothing + canvas loops
```

`gsap.ticker.lagSmoothing(0)` keeps scrub timing exact. After fonts resolve, one
`ScrollTrigger.refresh()` corrects measurement drift.

## Data & content

`src/data/site.ts` is the single source of truth: nav, capabilities, projects, experiments,
socials, site meta. Projects declare `preview?: 'webgl'` to opt into the live 3D panel.
Swapping the studio identity is a data-file edit plus token tweaks.

## Performance budget

| Item | Budget |
|------|--------|
| Hero sculpture | ≤ ~120k triangles (detail 48 desktop / 24 mobile) |
| Particles | 1 500 desktop / 800 tablet / 420 mobile — 1 draw call |
| Post-processing | desktop only (bloom + vignette + grain) |
| DPR clamp | 1.8 desktop / 1.5 mobile |
| Bundle | `three` + `motion` split from app code; images ≤ ~150 kB each |
