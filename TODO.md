 # RAG Improvements

## Phase 1: Context & Prompt (Quick Wins)

- [x] **System Prompt konsolidieren**
  - [x] 3 Sprachvarianten (DE/FR/EN) durch einen englischen System-Prompt ersetzen
  - [x] Sprachanweisung: Antwort = Sprache der Frage, Englisch → Deutsch
  - [x] Schweizer Rechtschreibung (ss statt ß) und Swiss French (nonante, septante) Regeln
  - [x] FR-Abkürzungs-Mapping einbauen (OR→CO, ZGB→CC, StGB→CP, SchKG→LP, BV→Cst., ArG→LTr)
  - [x] Anwendbarkeitsprüfung via `path`-Attribut in Prompt aufnehmen
  - [x] Quellentyp-Hierarchie: Gesetz = primär, BGE = Konkretisierung
  - [x] Response-Struktur: Direkte Antwort → Rechtsgrundlage → Rechtsprechung → Einschränkungen

- [ ] **Zitationsformat umstellen**
  - [ ] `[Art. X OR](#id)` ersetzen durch `[ref:ID]` Marker
  - [ ] Stream-Parser implementieren: Buffer mit `[ref:...]` Erkennung
  - [ ] `sources_lookup` Dict aufbauen (ID → title, path, url, text_excerpt)
  - [ ] `sources` Event am Ende des Streams senden

- [ ] **Kontext-Block strukturieren**
  - [ ] XML-artige Tags als Strukturformat (kein valides XML, kein Escaping)
  - [ ] `build_source_block()` Funktion: `<sources>` → `<legislation>` → `<decisions>`
  - [ ] Attribute pro `<article>`: id, sr, law, path, status, language, url
  - [ ] Attribute pro `<decision>`: id, court, applies, decision_language, url
  - [ ] `safe_attr()` für Anführungszeichen in Attribut-Werten

- [ ] **SR-Pfad als Kontext mitgeben**
  - [ ] Hierarchischen Pfad pro Gesetzesartikel generieren (z.B. `SR 220 › OR › 10. Titel › 2. Abschnitt`)
  - [ ] Pfad in `<article path="...">` Attribut einfügen

## Phase 2: Retrieval-Architektur

- [ ] **Getrennte Retrieval-Pipelines**
  - [ ] Separates Retrieval für Gesetzesartikel (Top 10)
  - [ ] Separates Retrieval für BGE (Top 10)
  - [ ] Garantierte Slots: min. 5 Artikel + min. 5 BGE nach Merge
  - [ ] Scores zwischen Pools nicht vergleichen

- [ ] **Weiches Boosting nach SR-Kategorie**
  - [ ] Query-Klassifikation: Rechtsgebiet, Rechtssubjekt, national/international
  - [ ] Boost/Penalty auf Retrieval-Score (kein harter Filter)
  - [ ] `preferred_categories` → ×1.2, `deprioritized_categories` → ×0.5

## Phase 3: BGE-Zitationen

- [ ] **Zitationen extrahieren**
  - [ ] Aus BGE-Texten zitierte Gesetzesartikel extrahieren
  - [ ] In Metadaten speichern (`cited_articles` Array)

- [ ] **Graph-Lookup implementieren**
  - [ ] BGE → Artikel: Zitierte Gesetzesartikel automatisch nachziehen
  - [ ] Artikel → BGE: Relevanteste BGEs finden die einen Artikel anwenden
  - [ ] Deduplizierung nach Graph-Enrichment

- [ ] **Datenmodell erweitern**
  - [ ] `decisions.applies` Feld (Array von Artikel-IDs)
  - [ ] Index auf `cited_articles` für schnelle Lookups

## Phase 4: LLM-Reranker

- [ ] **Anwendbarkeitsprüfung mit Haiku**
  - [ ] Reranker-Prompt: sachlicher, persönlicher, räumlicher, zeitlicher Geltungsbereich
  - [ ] Parallel einzeln (1 Call pro Chunk, async)
  - [ ] Input: Top 20–25 vom bge-reranker-v2-m3
  - [ ] Output: Top 5–8 mit `applicable`, `confidence`, `relevance_type`
  - [ ] Confidence-Threshold: > 0.6

- [ ] **Pipeline-Integration**
  - [ ] Retrieval (Top 50–80) → bge-reranker (Top 20–25) → LLM-Reranker (Top 5–8) → Generierung
  - [ ] Logging: Welche Artikel warum rausgefiltert wurden

## Phase 5: Quellenanzeige Frontend

- [ ] **Stream-Events implementieren**
  - [ ] `text` Event: Normaler Antworttext
  - [ ] `citation` Event: Fussnoten-Nummer + source_id
  - [ ] `sources` Event: Quellendetails am Ende

- [ ] **Quellen-UI**
  - [ ] Inline-Fussnoten (klickbare Badges)
  - [ ] Quellenleiste unter der Antwort
  - [ ] Expandierbare Quellenkarten (Gesetz vs. BGE visuell unterscheiden)
  - [ ] Deep-Links zu Fedlex / bger.ch
  - [ ] Regeste in Nutzersprache auf Quellenkarten

## Phase 6: Mehrsprachigkeit

- [ ] **Regeste multilingual**
  - [ ] `decision_summaries` Tabelle (decision_id, language, text, embedding)
  - [ ] Retrieval über Regeste in Nutzersprache
  - [ ] Erwägungen in Originalsprache nachladen
  - [ ] `<summary language="fr">` + `<reasoning language="de">` im Kontext

- [ ] **Gesetzestexte FR indexieren** (Top-Gesetze zuerst)
  - [ ] `law_article_texts` Tabelle (article_id, language, text, embedding)
  - [ ] Priorität: OR, ZGB, StGB, SchKG, ArG, MietR
  - [ ] Fedlex FR-Texte importieren
  - [ ] Embeddings berechnen
  - [ ] Retrieval mit Sprachpräferenz (soft penalty, kein harter Filter)
  - [ ] Deduplizierung: Gleicher Artikel in mehreren Sprachen → Nutzersprache bevorzugen

## Evaluation

- [ ] **Test-Set aufbauen**
  - [ ] Fälle wo falsches Rechtsgebiet retrieved wird (BPG statt OR, DBA statt DBG)
  - [ ] Layperson-Queries DE + FR
  - [ ] Cross-Domain Queries (Bund + Kanton)
  - [ ] Metriken: Recall@20, MRR, DocType Coverage, Latency P95

- [ ] **A/B Testing pro Phase**
  - [ ] Baseline messen vor jeder Änderung
  - [ ] Inkrementelle Verbesserung validieren
