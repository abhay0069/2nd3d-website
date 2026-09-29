# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

_Nothing yet._

## [1.0.1] — 2026-09-30

### Fixed

- **Black screen after first paint** — every module now imports `gsap` and
  `gsap/ScrollTrigger` through `src/animations/gsapSetup.ts`, the single entry point that
  runs `gsap.registerPlugin(ScrollTrigger)`. Previously the setup module was imported by
  nothing, so the plugin never registered and the first ScrollTrigger tween crashed the
  tree after first paint.
- **Fractured gsap module graph** — removed the `manualChunks` block from `vite.config.ts`.
  Force-splitting `gsap` into its own vendor chunk let registration state diverge across
  chunks; the bundler now chunks the dependency graph naturally.

### Added — Engineering

- **Error-boundary / watchdog pattern** — a React error boundary wraps `<App />` and swaps
  any render failure for a branded recovery screen, while a one-shot boot watchdog reloads
  the page once if `#root` is still empty (or an uncaught error escapes) moments after
  first paint, painting a dependency-free static fallback if even that reload fails. A
  `sessionStorage` flag guarantees the watchdog can never enter a reload loop — a crashed
  boot degrades to a recovery screen, never a black screen.

## [1.0.0] — 2026-09-30

### Added — Experience

- **Opening sequence** — cinematic preloader: clipped title reveal, `000→100` counter,
  `INITIALIZING` status, five-column wipe into the hero.
- **Hero** — `WE SCULPT / DIGITAL / MATTER` woven through a WebGL sculpture
  (back type → canvas → front type, one stacking context).
- **3D system** — custom GLSL morph material (simplex-displaced icosahedron, fresnel rim,
  cursor-following ember light), 1 500-particle GPU field, cinematic camera rig,
  restrained bloom / vignette / grain post stack.
- **Manifesto** — scroll-scrubbed progressive reading with velocity-skewed typography.
- **Capabilities** — expanding paper band, interactive list with cursor-following previews.
- **Work** — pinned horizontal journey across four projects, counter-parallax imagery,
  live 3D preview on *Monolith*, full-screen curtain-style project reveal.
- **Lab** — four live experiments: particle field, type tension, raw-WebGL flux, gesture trace.
- **Contact / Footer** — inverted culmination band, magnetic email, live Berlin clock,
  closing statement with outline wordmark.
- **Chrome** — custom cursor (blend-difference), hide/show navigation with ember progress
  hairline, scroll-velocity marquee, magnetic CTAs, film grain.
- **Sound** — procedural WebAudio ambient drone, off by default, `SOUND ON / OFF` control.

### Added — Engineering

- Vite + React 18 + TypeScript scaffold with code-split vendor chunks (`three`, `motion`).
- Modular architecture: `animations / components / 3d / shaders / hooks / sections / data / styles / utils`.
- Lenis smooth scrolling driven by the GSAP ticker; ScrollTrigger kept in sync.
- `prefers-reduced-motion` support (timing collapse, no smooth scroll, no camera drift).
- Accessibility: semantic landmarks, skip link, ARIA labels, keyboard-operable controls,
  contrast-checked dark and paper bands.
- Responsive per-breakpoint storytelling: cursor and post-FX disabled on touch,
  horizontal rig becomes a vertical journey, particle counts scale down.
- CI workflow (typecheck + production build), issue/PR templates, full documentation set.

[Unreleased]: https://github.com/abhay0069/2nd3d-website/compare/v1.0.1...HEAD
[1.0.1]: https://github.com/abhay0069/2nd3d-website/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/abhay0069/2nd3d-website/releases/tag/v1.0.0
