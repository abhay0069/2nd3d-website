# Contributing to OBSCURA

Thanks for your interest in pushing this experience further. The project is deliberately
art-directed — contributions should protect the quality bar, not dilute it.

## Getting started

```bash
git clone https://github.com/abhay0069/2nd3d-website.git
cd 2nd3d-website
npm install
npm run dev
```

Requires **Node.js ≥ 18** (CI runs on Node 20).

## Workflow

1. Fork the repository and create a feature branch from `main`.
2. Make your changes in focused commits (clear, imperative messages).
3. Verify locally before opening a PR:
   ```bash
   npm run typecheck
   npm run build
   ```
4. Open a pull request using the template and describe *what the user will feel*,
   not only what the code does.

## Design principles

Every change should serve the same philosophy: **typography + motion + spatial composition
+ interaction + 3D + negative space.**

- **No decorative glow.** Sophistication comes from composition, scale, timing and depth —
  not gradients or neon.
- **Motion has a grammar.** Fast interactions 150–250 ms, transitions 400–700 ms,
  cinematic moments 800–1500 ms. House easing is `expo.out`. Never linear unless it is
  scroll-scrubbed on purpose.
- **Stay restrained with the accent.** `--accent` (ember `#FF4A1F`) is used sparingly.
  One accent per visual moment.
- **Performance is a feature.** Target 60 fps on modern desktops. Prefer instancing,
  single draw calls, GPU-side motion and layout-stable media.
- **Accessibility is non-negotiable.** Reduced-motion support, keyboard access, readable
  contrast and semantic HTML must survive every change.

## Code style

- TypeScript strict; no `any` unless genuinely unavoidable (and documented).
- One concern per module — keep `3d`, `shaders`, `animations`, `sections` and UI separated.
- Content lives in `src/data/`, tokens in `src/styles/tokens.css`. Avoid hardcoding values
  that belong in the design system.
- Component CSS files use BEM-style, prefixed class names (`work__panel`, `lab__tile`).
- Comments explain *why*, not *what*.

## Reporting issues

Use the issue templates. For bugs, include your OS, browser, viewport size, and whether
reduced-motion is enabled. Screenshots or a short clip help enormously.

## Conduct

Be kind and precise. Review ideas fiercely, treat people gently. By participating you agree
to keep this a welcoming project for everyone.
