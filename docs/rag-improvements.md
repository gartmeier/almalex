# RAG Improvement Plan

## Current Setup
- Embedding: bge_multilingual_gemma2 (3584d)
- Retrieval: hybrid search (pgvector L2 + PostgreSQL FTS, RRF k=60)
- Fixed top_k: 12 articles, 8 decisions
- Context: concatenated chunks with `\n---\n`
- Model: openai/gpt-oss-120b (dev)
- History: last 10 messages

## Improvements (prioritized by impact/effort)

### High Priority (low effort)

**Context construction** (do together):
- [ ] Score threshold cutoff — drop chunks below RRF score threshold instead of fixed top_k
- [ ] Group chunks by parent — group by act/decision, shared header per group
- [ ] Order groups by best chunk score — most relevant source first, logical order within group
- [ ] Metadata in headers — act name, article title, decision date as group headers

**Retrieval**:
- [ ] Conversation-aware retrieval — use conversation context, not just last message, for search query

### Medium Priority
- [ ] Query rewriting — LLM rephrases vague/conversational queries before embedding
- [ ] Deduplication — merge or keep best chunk when multiple from same source
- [ ] Truncate to token budget — cap context tokens to protect history window
- [ ] Dynamic top_k — adjust article/decision split based on query intent
- [ ] User-selectable model — let user choose between OSS models (GPT OSS, Mistral, Apertus, Qwen, Llama)

### Lower Priority (higher effort)
- [ ] Reranking — cross-encoder rerank after RRF fusion (e.g. Cohere rerank)
- [ ] Parent chunk retrieval — retrieve chunk but inject parent section for broader context
- [ ] Structured output — LLM returns JSON with answer + citations
- [ ] Retrieval logging — store retrieved chunks + RRF scores per query
- [ ] User feedback loop — flag bad answers, tie back to retrieved chunks
