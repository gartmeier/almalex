# Changelog

## v0.3.0 (2026-03-14)

### RAG Pipeline
- Migrate from Cohere to Infomaniak + Anthropic contextual retrieval
- Replace tool-calling architecture with classic RAG pipeline
- Add cross-encoder reranker to RAG pipeline
- Add multilingual query expansion for BM25 search
- Add hybrid BM25 + vector search with HNSW index
- Parallelize bulk embedding with thread pool (HF Inference Endpoints)
- Add `GET /api/search` endpoint

### Data & Ingestion
- Add Decision model with headline/chamber fields, rewrite entscheidsuche loader
- Add load-fedlex and load-bge CLI commands with context generation
- Decouple embedding from chunk creation
- Add chunk active column to skip embedding
- Handle invalid dates, NUL bytes, and duplicates in loaders
- Add source_url support for decisions and articles

### Frontend & Chat
- Redesign chat UI to match website with locale-prefixed routes
- Browser-based chat storage with stateless API (privacy-first)
- Redesign thinking block with animated streaming and collapsible UI
- Redesign sources as pill badges with per-message streaming status
- Add model selector to message input
- Add reasoning token support with SSE streaming
- Add remark-gfm for markdown tables and strikethrough
- Add status indicators for chat message processing
- Truncate long source chips with tooltip on hover

### Website
- Create marketing website with landing page
- Add mobile hamburger nav and OG images
- Add sitemap.xml and robots.txt for SEO
- Enable static prerendering for all marketing pages
- Standardize design tokens (text sizes, border-radius, shadows)
- Split policies into Datenschutz and Impressum pages per language
- Add dark mode toggle with cookie-based SSR persistence
- Add dark mode logo variants and theme-aware favicon

### Infrastructure & DX
- Restructure backend to clean architecture (repositories, services, API layers)
- Enable SSR with React Router and fs-routes
- Replace Sentry with Bugsink for error tracking
- Add Counter.dev analytics tracking
- Add LEXam benchmark eval command
- Add MIT License
- Standardize on Makefile commands
