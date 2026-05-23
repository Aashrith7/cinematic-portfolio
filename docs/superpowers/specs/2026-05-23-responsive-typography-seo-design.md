# Responsive + Typography + SEO — Design Spec
**Date:** 2026-05-23  
**Status:** Approved

---

## 1. Scope

Three independent work streams executed in sequence:

1. **Typography** — lift body/description text to About-section readability standard
2. **Responsive** — desktop-first CSS gets `@media (max-width)` breakpoints for mobile/tablet
3. **SEO** — Next.js metadata, sitemap, robots.txt, JSON-LD

Placeholder domain: `https://vaibhavkhushalani.dev` (swap when live).

---

## 2. Typography

### Problem
Description/body text across sections is 0.46–0.76rem — unreadable at arm's length. About section bio uses `clamp(1rem, 1.6vw, 1.6rem)` as the gold standard.

### Solution: CSS Custom Properties
Add two tokens to `app/globals.css`:
```css
--text-body:  clamp(0.9rem, 1.2vw, 1.05rem);
--text-small: 0.72rem;
```

### Per-section targets

| Section | Selector | Current | Target |
|---|---|---|---|
| Projects | `.desc` | `clamp(0.65rem…0.82rem)` | `var(--text-body)` |
| Projects | `.techTag`, `.typeLabel` | `0.52–0.58rem` | `var(--text-small)` |
| Work Exp | `.bullet` | `clamp(0.56rem…0.72rem)` | `var(--text-body)` |
| Work Exp | `.company`, `.role` labels | `0.58–0.65rem` | `var(--text-small)` |
| Work Exp | `.period`, `.location` | `0.46–0.52rem` | `var(--text-small)` |
| Publications | `.desc` | `clamp(0.58rem…0.68rem)` | `var(--text-body)` |
| Publications | `.platform`, `.year` | `0.46rem` | `var(--text-small)` |
| Footer | `.footerDescription` | `0.76rem` | `var(--text-body)` |
| Footer | `.copy`, `.builtWith` | `0.52–0.62rem` | `var(--text-small)` |
| Footer | `.ctaEyebrow` | `0.55rem` | `var(--text-small)` |

### Mobile overrides
Inside existing `@media (max-width: 767px)` blocks, bump previously-overridden small values:
- Projects `.desc`: `0.6rem` → `0.88rem`
- Work Exp `.bullet`: `0.6rem` → `0.88rem`
- Publications `.desc`: `0.6rem` → `0.88rem`

---

## 3. Responsive

### Strategy
Desktop-first. Add/extend `@media (max-width: 767px)` and `@media (min-width: 768px) and (max-width: 1023px)` blocks. No JSX changes except Navbar hamburger.

### Navbar (`< 768px`)
- Hide link list; show hamburger icon (`FaBars`/`FaTimes` from react-icons)
- Slide-in overlay menu with all nav links
- State: `isOpen` toggle in Navbar component
- Close on link click or outside click

### Projects (`< 768px`)
- Single-column layout (already has `@media` block — verify/extend)
- Tech tags wrap, don't overflow
- Slide counter repositioned

### Work Experience (`< 768px`)
- Already has breakpoint — verify bullet font bump lands correctly

### Footer (`< 768px`)
- `mainGrid`: already switches to 1 column — leftCol then rightCol stack vertically
- Both columns visible, padding reduced so both fit in viewport
- `bottomRight` already hidden

### Publications (`< 768px`)
- Heading shrinks (already has breakpoint)
- Desc text gets `0.88rem` override

### Navbar tablet (`768–1023px`)
- Reduce link font-size, tighten padding

---

## 4. SEO

### `app/layout.js` — metadata object
```js
export const metadata = {
  metadataBase: new URL('https://vaibhavkhushalani.dev'),
  title: {
    default: 'Vaibhav Khushalani — Full Stack Developer',
    template: '%s | Vaibhav Khushalani',
  },
  description: 'Full Stack Engineer with 4+ years building scalable web and AI-powered systems using MERN, Next.js, and Python. Available worldwide for collaborations.',
  keywords: ['Vaibhav Khushalani', 'Full Stack Developer', 'Software Engineer', 'MERN Stack', 'Next.js', 'React', 'Node.js', 'AI Systems', 'Portfolio'],
  authors: [{ name: 'Vaibhav Khushalani', url: 'https://vaibhavkhushalani.dev' }],
  creator: 'Vaibhav Khushalani',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://vaibhavkhushalani.dev',
    siteName: 'Vaibhav Khushalani',
    title: 'Vaibhav Khushalani — Full Stack Developer',
    description: '...same as above...',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Vaibhav Khushalani Portfolio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vaibhav Khushalani — Full Stack Developer',
    description: '...same as above...',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: {
    canonical: 'https://vaibhavkhushalani.dev',
  },
}
```

### JSON-LD Person schema (in `app/layout.js` `<head>`)
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Vaibhav Khushalani",
  "url": "https://vaibhavkhushalani.dev",
  "email": "vaibhavkhush124@gmail.com",
  "jobTitle": "Full Stack Developer",
  "sameAs": [
    "https://github.com/VaibhavKhushalani",
    "https://www.linkedin.com/in/vaibhav-khushalani-760217136",
    "https://medium.com/@vaibhavkhushalani"
  ]
}
```

### `app/sitemap.js`
Next.js dynamic sitemap — returns single entry for root `/` with `lastModified: new Date()`.

### `public/robots.txt`
```
User-agent: *
Allow: /

Sitemap: https://vaibhavkhushalani.dev/sitemap.xml
```

---

## 5. File Change List

| File | Change |
|---|---|
| `app/globals.css` | Add `--text-body`, `--text-small` tokens |
| `styles/sections/ProjectsSection.module.css` | Font size updates + mobile desc fix |
| `styles/sections/WorkExperienceSection.module.css` | Font size updates + mobile bullet fix |
| `styles/sections/PublicationsSection.module.css` | Font size updates + mobile desc fix |
| `styles/sections/FooterSection.module.css` | Font size updates |
| `components/ui/Navbar.jsx` | Hamburger menu state + JSX |
| `styles/ui/Navbar.module.css` | Mobile menu styles |
| `app/layout.js` | Full metadata + JSON-LD script |
| `app/sitemap.js` | New file — dynamic sitemap |
| `public/robots.txt` | New file |

**No new sections. No new components except hamburger toggle in Navbar.**

---

## 6. Out of Scope

- OG image (`/og-image.png`) — needs design asset, flag to user
- Analytics (GA/Plausible)
- i18n
- Dark mode toggle
