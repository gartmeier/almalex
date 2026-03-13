# Landing Page Improvements (Backlog)

Recommendations from content and SEO audit (2026-03-13).

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

## P3: Dynamic HTML lang Attribute

`<html lang="de">` is hardcoded in root.tsx. Should be dynamic per route language.
Acceptable for now since German is the primary page.

## Done (2026-03-13)

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
