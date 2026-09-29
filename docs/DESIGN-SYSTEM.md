# Design System

The visual system behind OBSCURA. Everything is expressed as CSS custom properties in
`src/styles/tokens.css` — components never hardcode palette or timing values.

## Palette

Restrained by design: **deep black, warm white, graphite, subtle grey — and exactly one
accent**. No gradients-as-decoration. No neon.

| Token | Value | Role |
|-------|-------|------|
| `--ink` | `#0B0B0C` | primary dark ground |
| `--ink-soft` | `#121214` | secondary dark band (Lab) |
| `--graphite` | `#1A1A1D` | media wells, panels |
| `--paper` | `#F2EFE9` | warm white — inverted bands + type on dark |
| `--paper-dim` | `#C9C5BD` | secondary type on dark |
| `--grey` | `#6F6E71` | meta labels, captions |
| `--accent` | `#FF4A1F` | **ember** — one accent, used sparingly |

The accent appears at most once per visual moment: a chapter index, a single word, the
progress hairline, the ember light on the sculpture. Restraint is the identity.

**Inverted bands** (Capabilities, Contact) set `data-theme="light"` on the section, which
re-maps `--bg / --fg / --line` locally. The nav and cursor invert automatically via
`mix-blend-mode: difference`.

## Typography

Two families, both open-source:

| Role | Family | Notes |
|------|--------|-------|
| Display | **Space Grotesk** (300–700) | uppercase, tight tracking, huge scale |
| Body / meta | **Inter Tight** (300–600) | editorial body copy, tracked meta labels |

### Scale (fluid)

| Token | Size | Use |
|-------|------|-----|
| `--text-xl` | `clamp(3.35rem, 13.5vw, 13rem)` | hero statement |
| `--text-l` | `clamp(3rem, 8.6vw, 8.25rem)` | section statements |
| `--text-m` | `clamp(2.1rem, 5vw, 4.4rem)` | sub-heads, project names |
| `--text-body` | `clamp(1rem, 1.1vw, 1.175rem)` | copy |
| `--text-meta` | `clamp(0.66rem, 0.72vw, 0.78rem)` | uppercase labels, `letter-spacing: .18em` |

Display type: `line-height: 0.86–0.94`, `letter-spacing: -0.03…-0.045em`, uppercase.
Headlines may occupy most of the viewport — scale is composition.

## Spacing & layout

- `--gutter: clamp(1.25rem, 3.4vw, 3.5rem)` — page margins
- `--section-y: clamp(6rem, 14vh, 12rem)` — section rhythm
- Negative space is a material: statements sit in wide margins with few neighbours
- Radii: `2–4px` only (media wells, pills) — architecture, not app cards

## Motion

| Register | Duration | Easing | Used for |
|----------|----------|--------|----------|
| Fast | 150–250 ms | `--ease-out-quart` | cursor morphs, hovers |
| Transition | 400–700 ms | `--ease-out-expo` | list rows, previews, nav |
| Cinematic | 800–1500 ms | `--ease-in-out-quart` / `expo.inOut` | entrances, curtains, preloader |

- House curve: `cubic-bezier(0.16, 1, 0.3, 1)` (out-expo)
- Scroll-scrubbed effects use `ease: 'none'` — the scrollbar is the easing
- Velocity is data: type skews with `ScrollTrigger.getVelocity()`, particles and shaders
  receive pointer velocity as a uniform
- Springs (`elastic.out`) only for playful moments (skew settle)

**Reduced motion** (`prefers-reduced-motion`): tokens collapse to ~1ms, smooth scroll is
disabled, camera drift and base rotation stop, the preloader fast-forwards.

## Interaction patterns

| Pattern | Behaviour |
|---------|-----------|
| **Cursor** | 8px dot → 88px labelled disc (`VIEW / EXPLORE / OPEN / DRAG / …`) via `data-cursor="LABEL"`. Blend-difference. Fine pointers only. |
| **Magnetic targets** | CTA + email ease toward the pointer within their bounds (`useMagnetic`) |
| **Link sweep** | Underline scales in from the leading edge (`link-sweep`) |
| **List rows** | Type shifts 14px, index turns ember, arrow slides in, preview follows cursor |
| **Images** | Clip reveals, scale-on-hover `1.06 → 1.0`, saturate lift |
| **Bands** | Paper sections expand from `inset(12% 4% round 10px)` to full-bleed on scroll |
| **Nav** | Hides scrolling down, returns scrolling up; ember progress hairline |
| **Sound** | Off by default; bars animate only when playing |

## Texture

One global film grain (SVG `feTurbulence`, 5% opacity, `overlay` blend, stepped drift).
It should be *felt*, never seen. If it reads as noise, it is too strong.

## Do / Don't

| Do | Don't |
|----|-------|
| Compose with scale, space and timing | Decorate with glows and gradients |
| Spend the accent once per moment | Color every label ember |
| Keep type readable during motion | Animate for spectacle alone |
| Respect reduced motion and contrast | Ship interactions that fight the scroll |
