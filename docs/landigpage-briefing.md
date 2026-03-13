# Alma Lex — Landing Page Briefing

## 1. Projekt-Übersicht

**Alma Lex** ist eine kostenlose, quelloffene Schweizer Rechts-KI. Sie hilft normalen Menschen, rechtliche Fragen zum Schweizer Bundesrecht nachzuschlagen — verständlich, datenschutzfreundlich und ohne Anwalt ersetzen zu wollen.

Die Anwendung lädt Schweizer Bundesrecht von fedlex.admin.ch sowie Bundesgerichtsentscheide von bger.ch in eine Postgres-Datenbank und nutzt diese als Grundlage für ein RAG-System (Retrieval-Augmented Generation).

---

## 2. Zielgruppe

Privatpersonen in der Schweiz, die rechtliche Fragen haben und sich einen ersten Überblick verschaffen möchten — ohne juristische Vorkenntnisse. Alma Lex ersetzt keine Rechtsberatung und keinen Anwalt.

---

## 3. Sprachen

- Die Chat-App unterstützt: **Deutsch, Französisch und Englisch**
- Die Landing Page ist vorerst **nur auf Deutsch**

---

## 4. Farbpalette

### Primärfarben

| Rolle | Farbe | Hex | Verwendung |
|---|---|---|---|
| Primary | Warmblau | `#3B82C4` | CTA-Buttons, Links, Akzente |
| Primary Dark | Tiefblau | `#1E3A5F` | Headlines, Navigation, Footer |
| Primary Light | Himmelblau | `#E8F1FA` | Hintergrundflächen, Cards |

### Sekundärfarben

| Rolle | Farbe | Hex | Verwendung |
|---|---|---|---|
| Accent | Warmes Salbeigrün | `#6B9E7A` | Vertrauen, Datenschutz-Badge, Erfolg |
| Accent Light | Helles Salbei | `#EDF5EF` | Sekundäre Hintergründe |
| Warm Highlight | Sanftes Amber | `#F5A623` | Dezente Akzente, Disclaimer-Hinweise |

### Neutraltöne

| Rolle | Farbe | Hex | Verwendung |
|---|---|---|---|
| Background | Warmweiss | `#FAFAF8` | Seitenhintergrund |
| Surface | Weiss | `#FFFFFF` | Cards, Eingabefelder |
| Text Primary | Anthrazit | `#2D3748` | Fliesstext |
| Text Secondary | Warmgrau | `#6B7280` | Labels, Subtext |
| Border | Hellgrau | `#E2E5E9` | Trennlinien, Card-Rahmen |

### Designprinzip
Die Palette verbindet **Seriosität** (Blautöne = Vertrauen, Recht) mit **Zugänglichkeit** (warme Untertöne, Salbeigrün = Natur, Schweiz). Kein kaltes Corporate-Blau — alle Farben haben einen leicht warmen Unterton, der die Seite einladend wirken lässt.

---

## 5. Logo-Brief

### Konzept & Name
**«Alma Lex»** — «Alma» (lat. nährend, fördernd) + «Lex» (lat. Gesetz). Das Logo soll diese Dualität einfangen: Recht zugänglich und nährend machen.

### Anforderungen

- **Wortmarke + Icon** (Kombination): Soll sowohl zusammen als auch getrennt funktionieren (Icon allein als Favicon/App-Icon)
- **Stil:** Modern, freundlich, clean — kein klassisches Anwaltskanzlei-Logo (keine Waage, kein Paragraphenzeichen, kein Wappen)
- **Schrift:** Serifenlos oder humanistisch — gut lesbar, warm, modern. Empfehlung: geometrisch-humanistisch (à la Inter, Nunito, oder ähnlich)
- **Icon-Ideen:**
  - Abstrahiertes Buch / aufgeschlagene Seite (Wissen, Zugang)
  - Sprechblase + Paragraphen-Element (Dialog + Recht)
  - Stilisierter Buchstabe «A» mit Rechts-Anspielung
  - Kompass / Wegweiser (Orientierung im Recht)
- **Farben:** Primary Warmblau `#3B82C4` als Hauptfarbe, Primary Dark `#1E3A5F` als Variante, Salbeigrün `#6B9E7A` als optionaler Akzent
- **Varianten benötigt:** Farbig, einfarbig (dunkel/hell), Favicon (16×16 bis 512×512)
- **Dont's:** Keine Schweizerkreuze, keine klassischen Justiz-Symbole (Waage, Hammer), nichts zu verspielt oder kindlich

### Empfohlenes Tool

**Looka** (looka.com) — KI-gestützter Logo-Generator, guter Ausgangspunkt für Wortmarke + Icon-Kombinationen. Erstellung kostenlos, Export kostenpflichtig. Alternativ:
- **Brandmark.io** — ähnlich, etwas minimalistischer
- **Figma** — falls manuell designt werden soll
- **Recraft.ai** — KI-Bildgenerierung mit Logo-Modus, gut für Icon-Exploration

---

## 6. Visueller Stil & Branding

### Stil
- **Freundlich, zugänglich, hell und einladend**
- Die Seite soll Vertrauen schaffen und die Hemmschwelle senken, rechtliche Fragen zu stellen
- Keine kühle Anwaltskanzlei-Ästhetik — eher: hilfreicher Begleiter

### Typografie-Empfehlung
- Headlines: **Inter** oder **Nunito** (bold/semibold)
- Fliesstext: **Inter** (regular)
- Monospace (Code/Tech-Bereich): **JetBrains Mono**

---

## 7. Seitenstruktur (vorgeschlagene Sections)

### Hero Section
- Headline: Kernbotschaft — z.B. *«Schweizer Recht, verständlich erklärt.»*
- Subline: Kurze Beschreibung (kostenlos, open source, datenschutzfreundlich)
- **Primärer CTA-Button:** Direkt zur Chat-App → `almalex.ch/chat`
- Sekundärer CTA: GitHub-Repo → `github.com/gartmeier/almalex`

### So funktioniert's (How it works)
Kurze, visuelle Erklärung in 3 Schritten:
1. Frage stellen (in natürlicher Sprache)
2. Alma Lex durchsucht Bundesrecht und Bundesgerichtsentscheide
3. Verständliche Antwort mit Quellenangaben

### Datenquellen
- **Bundesrecht:** fedlex.admin.ch (offizielle Schweizer Gesetzessammlung)
- **Bundesgerichtsentscheide:** bger.ch (offizielle Rechtsprechungsdatenbank)
- Daten werden in einer Postgres-Datenbank indexiert und über RAG abgefragt

### Datenschutz & Sicherheit
Dieses Thema ist zentral und verdient prominente Platzierung:
- **Keine Speicherung von Chatverläufen** auf dem Server
- Daten im Transit befinden sich auf einem dedizierten Hetzner-Server in Finnland
- KI-Inferenz über **Infomaniak** (Schweizer Anbieter) — keine US-Cloud-Dienste
- **Daten werden nicht für KI-Training verwendet** und nicht gespeichert
- Bewusste Entscheidung für EU-/CH-Infrastruktur

### Technologie / Open Source
- Vollständig **open source** und **kostenlos** — kein Login erforderlich
- GitHub-Link: `github.com/gartmeier/almalex`
- Modelle werden laufend optimiert anhand des LEXam-Benchmarks (4'886 juristische Prüfungsfragen)

### Wichtiger Hinweis (Disclaimer)
- Alma Lex ersetzt keinen Anwalt und keine professionelle Rechtsberatung
- Es dient als Orientierungshilfe, nicht als verbindliche Rechtsauskunft
- Bei konkreten Rechtsfällen immer eine Fachperson beiziehen

### Footer
- Link zur App (`almalex.ch/chat`)
- Link zum GitHub-Repo
- Disclaimer-Hinweis
- Optional: Kontaktmöglichkeit / E-Mail

---

## 8. Technischer Stack (Referenz)

### Frontend
- React Router v7 + TypeScript + Vite
- Tailwind CSS v4 + Radix UI / DaisyUI
- i18n: Deutsch, Französisch, Englisch

### Backend
- FastAPI (Python 3.13) + SQLAlchemy
- PostgreSQL mit pgvector-Erweiterung
- Redis (Caching/Session)

### KI / RAG Pipeline
- **Embedding:** BGE Multilingual Gemma2
- **Reranking:** BAAI/bge-reranker-v2-m3 (Cohere-kompatible API)
- **Chat-Modelle:** GPT-OSS, Qwen3, Llama 3.3, Apertus 70B, Mistral Small 3.2 (OpenAI-kompatible API)
- **Inferenz-Provider:** Infomaniak (Schweiz)
- Modelle werden laufend angepasst an Infomaniak-Angebot und LEXam-Benchmark

### Infrastruktur & Monitoring
- Dedizierter Hetzner-Server (Finnland), Deploy via systemd auf Linux
- Error-Tracking: Bugsink (self-hosted, Open-Source-Alternative zu Sentry)

### Entwicklung
- Massgeblich mit **Claude Code** entwickelt

---

## 9. Tone of Voice

- **Verständlich:** Kein Juristendeutsch, keine Fachsprache auf der Landing Page
- **Vertrauenswürdig:** Transparenz bei Datenschutz und Technologie
- **Einladend:** Niederschwellig, ermutigend — «Frag einfach»
- **Ehrlich:** Klare Kommunikation der Grenzen (kein Anwaltsersatz)

---

## 10. Zusammenfassung der Key Messages

| Botschaft | Priorität |
|---|---|
| Schweizer Recht einfach nachschlagen | ★★★ |
| Kostenlos und ohne Anmeldung | ★★★ |
| Daten bleiben privat (kein Speichern, kein Training) | ★★★ |
| EU-/CH-Infrastruktur (kein US-Cloud) | ★★☆ |
| Open Source und transparent | ★★☆ |
| Ersetzt keinen Anwalt | ★★☆ |

---

## 11. Referenz-URLs

- **App:** almalex.ch/chat
- **GitHub:** github.com/gartmeier/almalex
- **Datenquellen:** fedlex.admin.ch, bger.ch
- **Inferenz-Provider:** infomaniak.com
- **Error-Tracking:** bugsink.com
