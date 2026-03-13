# Landing Page Improvements (Backlog)

## P1: Mobile Navigation

- [ ] Add hamburger menu or simplified nav for mobile (currently hidden entirely)

## P1: OG Image

Create an OG image (1200x630px) for social sharing previews (WhatsApp, Telegram, LinkedIn).
Simple branded card: Alma Lex logo, tagline, chat interface visual.
Add to meta tags once created:

```tsx
{ property: "og:image", content: "https://almalex.ch/og-image-de.png" },
{ property: "og:image:width", content: "1200" },
{ property: "og:image:height", content: "630" },
{ property: "og:image:alt", content: "Alma Lex - Schweizer Rechts-KI" },
{ name: "twitter:image", content: "https://almalex.ch/og-image-de.png" },
```

## P2: SSR/Prerendering for Landing Pages

Currently `ssr: false` in react-router.config.ts. Google must execute JS to see content.
Consider enabling `prerender` for static marketing pages while keeping chat routes client-only.
Biggest single technical SEO improvement possible.

## P3: Sitemap and Robots.txt

Create `sitemap.xml` with all language variants and `robots.txt` pointing to it.
Important for crawl efficiency, especially with CSR.

## P3: Design Consistency

- [ ] Standardize body text sizes (`text-[15px]` vs `text-base`)
- [ ] Standardize card border-radius to two tiers: `rounded-2xl` (16px) small, `rounded-[20px]` large
- [ ] Extract repeated shadow values into Tailwind theme tokens
- [ ] Test GitHub CTA button text wrapping on 320px screens

## Done (2026-03-13)

### Chunk 2: Extract shared landing page component

- Created `components/website/landing-page.tsx` with shared `LandingPage` component + `LandingPageContent` type
- All icons, gradients, layout, section components are private internals of shared component
- Rewrote `_website.{de,en,fr}._index.tsx` from ~527 lines each to ~130 lines (meta + content object)
- Hero titles now use `<br />` instead of `{"\n"}`
- Structural changes now only need to touch one file

### Chunk 1: Quick fixes

- Synced `useLang()` with i18next via `useEffect` in layout
- Set `document.documentElement.lang` dynamically from URL lang
- Added `flex-wrap` to footer link row
- Differentiated footer Privacy/Imprint links with `#privacy` / `#terms` anchors
- Fixed footer disclaimer contrast: `#4A6A85` to `#7A9AB5`
- Fixed footer body text contrast: `#8AABC8` to `#9ABBD8`
- Fixed Open Source card body contrast: `#94B8D9` to `#A8C8E8` (all 3 langs)
- Fixed missing React key on Fragment in HowItWorks `.map()` (all 3 langs)
- Removed `max-w-[280px]` on HowItWorks card descriptions (all 3 langs)
- Smoothed hero padding: `md:px-16 lg:px-[120px]` (all 3 langs)

### Earlier

- Translated shared layout (`_website.tsx`): nav, CTA, footer heading/body/button, footer links, disclaimer
- Fixed broken nav anchor links on EN/FR (now use language-specific section IDs)
- Created English landing page (`_website.en._index.tsx`)
- Created French landing page (`_website.fr._index.tsx`)
- Added `availableLanguage` and `featureList` to JSON-LD on all 3 versions

### Earlier

- Improved title tag (57 chars, includes StGB, no em dash)
- Meta description under 160 chars, front-loads "Kostenlose"
- Added canonical URL + hreflang tags (de/fr/en + x-default)
- Added Twitter Card meta tags
- Added OG locale alternates and og:url
- Added FAQPage JSON-LD schema (10 Q&As for rich snippets)
- Enhanced WebApplication JSON-LD (url, author, isAccessibleForFree, multi-language)
- Spelled out abbreviations (OR, ZGB, StGB) in hero, data sources, FAQ
- Punchier hero headline: "Schweizer Recht verstehen. In Sekunden."
- Broader audience targeting (removed student-only phrasing)
- Stronger trust badges: "100% kostenlos", "KI aus der Schweiz", "Keine Anmeldung nötig"
- Fixed "EU" to "Europa" (Switzerland is not in the EU)
- Privacy subtitle: "Privatsphäre ist kein Feature, sondern Grundprinzip."
- All em dashes removed across landing page files
- Added language FAQ
- New FAQ: "In welchen Sprachen kann ich Fragen stellen?"
