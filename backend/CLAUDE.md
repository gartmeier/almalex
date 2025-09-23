# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Linting and Formatting
- `ruff check` - Run linting checks
- `ruff format` - Format code
- `ruff check --fix` - Auto-fix linting issues

### Database Management
- `alembic upgrade head` - Apply database migrations
- `alembic revision --autogenerate -m "description"` - Create new migration

### CLI Tools
- `python -m cli.main` - Access CLI commands for data loading and search
- `python -m cli.main load-fedlex` - Load Swiss legal documents
- `python -m cli.main load-bge` - Load BGE (Bundesgerichtsentscheide) documents
- `python -m cli.main search "query"` - Search documents with vector similarity
- `python -m cli.main prompt "question"` - Get AI-generated answer based on document context
- `python -m cli.main cleanup-chats` - Clean up old chat sessions
- `python -m cli.main fix-fedlex-urls` - Fix/update Fedlex document URLs
- `python -m cli.main shell` - Interactive shell with database access

### Application
- `fastapi dev app/main.py` - Run development server with hot reload on default port 8000
- `fastapi dev app/main.py --port 8001` - Run on alternate port
- `fastapi run app/main.py` - Run production server
- `uvicorn app.main:app --reload --port 8000 --log-level info` - Alternative development server

## Architecture Overview

This is a FastAPI-based RAG (Retrieval-Augmented Generation) system for Swiss legal documents with the following key components:

### Core Services
- **Search Functions** (`app/crud.py`): Vector similarity search using pgvector - `search()` and `search_similar()` functions handle document retrieval
- **AI Service** (`app/ai/service.py`): OpenAI integration for embeddings (`create_embedding()`), chat completion (`generate_text()`), and title generation
- **Redis** (`app/redis.py`): Caching layer for API responses
- **Rate Limiting** (`app/limiter.py`): SlowAPI-based rate limiting middleware

### Data Models
- **Document/DocumentChunk**: Legal documents stored with vector embeddings (1536 dimensions)
- **Chat/ChatMessage**: Conversation history with user interactions
- Uses PostgreSQL with pgvector extension for similarity search

### API Structure
- `/api/chats` - Chat management and message streaming endpoints
- Main app (`app/main.py`) includes API router with `/api` prefix
- Sentry integration for error tracking (when `SENTRY_DSN` configured)

### Key Dependencies
- FastAPI with SQLAlchemy for web framework and ORM
- pgvector for vector similarity search
- OpenAI API for embeddings and chat completion (models: gpt-4.1-nano, text-embedding-3-small)
- Redis for caching
- Alembic for database migrations

### Configuration
Environment variables loaded via Pydantic Settings from `.env`:
- `DATABASE_URL` - PostgreSQL connection with pgvector extension
- `REDIS_URL` - Redis connection
- `OPENAI_API_KEY` - OpenAI authentication
- `SECRET_KEY` - JWT signing key
- `SENTRY_DSN` - Optional Sentry error tracking

### Additional Components
- **CLI Module** (`cli/`): Standalone tools for data management, search, and interactive prompting
- **Database Migrations** (`alembic/versions/`): Schema versioning with pgvector support