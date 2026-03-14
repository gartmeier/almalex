# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Linting and Formatting

Use `make check` and `make format` from the repo root.

### Database Management
- `alembic upgrade head` - Apply database migrations
- `alembic revision --autogenerate -m "description"` - Create new migration

### CLI Tools
- `python -m cli.main` - Access CLI commands
- `python -m cli.main load-fedlex` - Load Swiss legal documents
- `python -m cli.main load-entscheidsuche` - Load court decision documents
- `python -m cli.main act-status` - Check act processing status
- `python -m cli.main configure-act` - Configure act settings
- `python -m cli.main eval` - Run evaluation
- `python -m cli.main cleanup-chats` - Clean up old chat sessions
- `python -m cli.main shell` - Interactive shell with database access

### Application
- `fastapi dev app/main.py` - Run development server with hot reload on default port 8000
- `fastapi dev app/main.py --port 8001` - Run on alternate port
- `fastapi run app/main.py` - Run production server
- `uvicorn app.main:app --reload --port 8000 --log-level info` - Alternative development server

## Architecture Overview

This is a FastAPI-based RAG (Retrieval-Augmented Generation) system for Swiss legal documents using clean architecture:

### Layered Architecture
- **`app/api/v1/`** — Versioned API endpoints (chats)
- **`app/services/`** — Business logic: ChatService, EmbeddingService, LLMService
- **`app/repositories/`** — Data access: ChatRepository, ChunkRepository (hybrid RRF search)
- **`app/prompts/`** — System prompt construction (DE/EN/FR)
- **`app/core/`** — Infrastructure: config, clients, deps, redis, limiter, exceptions
- **`app/db/`** — SQLAlchemy models and session management
- **`app/schemas/`** — Pydantic request/response models

### Data Models
- **Chunk**: Legal document chunks with vector embeddings (3584 dimensions via pgvector)
- **Act, ActConfig, Article**: Structured legal act data
- **Decision, DecisionSyncState**: Court decisions and sync tracking
- **Chat, ChatMessage**: Conversation history
- Uses PostgreSQL with pgvector extension for similarity search

### API Structure
- `/api/chats/{chat_id}` - Chat management and message streaming
- Main app (`app/main.py`) includes versioned API router
- Sentry integration for error tracking (when `SENTRY_DSN` configured)

### Key Dependencies
- FastAPI with SQLAlchemy for web framework and ORM
- pgvector for vector similarity search
- OpenAI SDK for chat (`openai/gpt-oss-120b`) and embeddings (`bge_multilingual_gemma2`)
- Anthropic SDK, Cohere, Tenacity for additional AI/retry capabilities
- Redis for caching
- Alembic for database migrations

### Configuration
Environment variables loaded via Pydantic Settings from `.env`:
- `DATABASE_URL` - PostgreSQL connection with pgvector extension
- `REDIS_URL` - Redis connection
- `OPENAI_API_KEY` - OpenAI authentication
- `OPENAI_BASE_URL` - OpenAI-compatible API base URL
- `OPENAI_CHAT_MODEL` - Chat model identifier
- `OPENAI_EMBEDDING_MODEL` - Embedding model identifier
- `ANTHROPIC_API_KEY` - Anthropic authentication
- `SECRET_KEY` - JWT signing key
- `SENTRY_DSN` - Optional Sentry error tracking

### Additional Components
- **CLI Module** (`cli/`): Data loading, evaluation, and interactive tools
- **Database Migrations** (`alembic/versions/`): Schema versioning with pgvector support
