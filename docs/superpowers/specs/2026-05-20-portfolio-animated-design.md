# Vaibhav Portfolio — Animated Two-Section Design Spec

**Date:** 2026-05-20  
**Stack:** Next.js 16 (App Router) + React 19 + Tailwind v4 + GSAP + shadcn/ui

---

## Overview

Single-page portfolio with two full-viewport sections. CSS scroll-snap locks each section to 100vh. GSAP fires element-level animations on section enter. No page navigation — one URL, two screens.

---

## Architecture

### File Structure

```
app/
  layout.js                   — root layout, Geist fonts, metadata
  page.js                     — scroll container (snap mandatory)
  globals.css                 — all CSS tokens, theming system

components/
  sections/
    VideoIntro.jsx             — section 1: fullscreen video intro
    HeroSection.jsx            — section 2: hero layout (reference image match)
  ui/
    Navbar.jsx                 — IST clock, nav links, email button

lib/
  gsap.js                     — client-only GSAP + ScrollTrigger registration

docs/
  superpowers/specs/           — this file
```

### Scroll Container (`app/page.js`)

```jsx
"use client";
// Two snap sections, ref passed to VideoIntro for onEnded scroll target
<main className="h-screen overflow-y-scroll" style={{ scrollSnapType: 'y mandatory' }}>
  <VideoIntro heroRef={heroRef} />
  <HeroSection ref={heroRef} />
</main>
```

---

## Theming System (`app/globals.css`)

All design tokens live here. Sections reference tokens — switching themes requires changing one block.

```css
:root {
  /* Hero gradient — exact reference image match */
  --hero-start:       #f8d5b0;   /* top peach */
  --hero-mid:         #f5954a;   /* mid orange */
  --hero-end:         #e85500;   /* bottom burnt orange */

  /* Brand accent */
  --accent:           #f7931e;
  --accent-hover:     #e07b10;

  /* Text */
  --text-primary:     #1a0800;   /* near-black, warm undertone */
  --text-muted:       #4a2800;   /* secondary text */
  --text-on-dark:     #f5f5f5;

  /* Surfaces for future sections */
  --surface-white:    #ffffff;
  --surface-black:    #0a0a0a;
  --surface-amber:    #fff7ed;

  /* Navbar */
  --navbar-text:      #1a0800;
  --email-btn-bg:     #ffffff;
  --email-btn-text:   #1a0800;

  /* Typography scale */
  --hero-name-size:   clamp(4rem, 10vw, 8rem);
  --hero-role-size:   clamp(0.875rem, 1.5vw, 1rem);
}
```

shadcn CSS variables (`--background`, `--foreground`, `--primary`, etc.) mapped to these tokens on `init`.

---

## Section 1: VideoIntro

**File:** `components/sections/VideoIntro.jsx`

- Full `100vh`, black background
- `<video>` fills screen: `object-fit: cover`, `autoPlay`, `muted`, `playsInline`, `src="/assets/about-me.mp4"`
- No controls (cinematic)
- `onEnded` callback: `heroRef.current?.scrollIntoView({ behavior: 'smooth' })`
- GSAP mount animation: opacity 0→1 over 0.8s on video element
- Scroll snap: `scroll-snap-align: start`

**Behavior:**
1. Page loads → video autoplays immediately (muted for autoplay policy)
2. Video finishes → smooth scroll to HeroSection fires automatically
3. User can also scroll manually at any time (snap handles lock)

---

## Section 2: HeroSection

**File:** `components/sections/HeroSection.jsx`

### Layout (exact reference image match)

```
┌──────────────────────────────────────────────────────────┐
│ INDIA TIME 12:47 PM   HOME  ABOUT  WORKS  SERVICES  EXP  [Email me] │
│                                                          │
│  Hi, I'm                                                 │
│  Software Developer          ┌────────────────────────┐  │
│                              │                        │  │
│  Vaibhav                     │   /assets/hero.png     │  │
│                              │   absolute right       │  │
│  Khushalani                  │   full height          │  │
│                              └────────────────────────┘  │
│                        Based on India*                   │
│                        Available worldwide               │
└──────────────────────────────────────────────────────────┘
```

### Gradient Background

```css
background: linear-gradient(
  to bottom,
  var(--hero-start) 0%,
  var(--hero-mid) 55%,
  var(--hero-end) 100%
);
```

### Typography

- `"Hi, I'm"` — small, `var(--hero-role-size)`, `var(--text-primary)`
- `"Software Developer"` — small bold, same size
- `"Vaibhav"` + `"Khushalani"` — two lines, `var(--hero-name-size)`, `font-weight: 900`, `var(--text-primary)`
- `"Based on India* / Available worldwide"` — small, right-aligned, `var(--text-muted)`

### Photo

- `<Image src="/assets/hero.png" />` (Next.js Image)
- Positioned absolute, right side, full height of section
- `object-fit: cover`, no border/radius

### GSAP Animation Sequence (fires on section enter via ScrollTrigger)

1. `"Hi, I'm"` — fade + slide up, delay 0
2. `"Software Developer"` — fade + slide up, delay 0.1s
3. `"Vaibhav"` — fade + slide up, delay 0.25s
4. `"Khushalani"` — fade + slide up, delay 0.35s
5. `hero.png` — slide in from right (translateX: 80px→0), delay 0.2s
6. `"Based on India*"` block — fade in, delay 0.5s

### Scroll snap: `scroll-snap-align: start`

---

## Navbar (`components/ui/Navbar.jsx`)

- shadcn `NavigationMenu` for nav links (HOME, ABOUT, WORKS, SERVICES, EXPERIENCE)
- Live IST clock: `useEffect` with `setInterval(1000)`, format `"INDIA TIME - HH:MM:SS AA"`
- shadcn `Button` variant=`outline` with rounded-full for "Email me" → `mailto:vaibhavkhush124@gmail.com`
- Fixed to top of HeroSection (not globally fixed — only visible on section 2)
- On VideoIntro: no navbar shown

---

## Packages to Install

```bash
# GSAP
npm install gsap

# shadcn init (Tailwind v4 CSS-first mode)
npx shadcn@latest init

# shadcn components used
npx shadcn@latest add button navigation-menu
```

shadcn `init` configured for: Next.js App Router, Tailwind v4, `globals.css` CSS variables, no TypeScript (project uses JS).

---

## Constraints & Notes

- **Next.js 16 / React 19**: Read `node_modules/next/dist/docs/` before writing any Next.js-specific code. App Router only.
- **Tailwind v4**: CSS-first config. No `tailwind.config.js`. All customization via `@theme` in `globals.css`.
- **GSAP client-only**: wrap in `useEffect`, never import at module level in Server Components.
- **shadcn + Tailwind v4**: use `shadcn@latest` which supports v4. CSS variables bridge in `globals.css`.
- **No native HTML interactive elements**: use shadcn `Button`, `NavigationMenu` — not `<button>`, `<a>`, `<nav>`.
- **`"use client"`** required on: `page.js`, `VideoIntro.jsx`, `HeroSection.jsx`, `Navbar.jsx` (all use hooks/GSAP/browser APIs).

---

## Out of Scope

- Other portfolio sections (About, Works, Services, Experience) — future sprints
- Mobile responsive breakpoints — future sprint
- Dark mode toggle
- Contact form
