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
- `python -m cli.main search "query"` - Search documents
- `python -m cli.main shell` - Interactive shell

### Application
- `fastapi dev app/main.py` - Run development server with hot reload
- `fastapi run app/main.py` - Run production server

## Architecture Overview

This is a FastAPI-based RAG (Retrieval-Augmented Generation) system for Swiss legal documents with the following key components:

### Core Services
- **RAG Service** (`app/services/rag.py`): Vector similarity search using pgvector for document retrieval
- **AI Service** (`app/ai/service.py`): OpenAI integration for embeddings, chat completion, and title generation
- **Redis** (`app/redis.py`): Caching layer

### Data Models
- **Document/DocumentChunk**: Legal documents stored with vector embeddings (1536 dimensions)
- **Chat/ChatMessage**: Conversation history with user interactions
- Uses PostgreSQL with pgvector extension for similarity search

### API Structure
- `/api/auth` - Authentication endpoints
- `/api/chats` - Chat management and message streaming
- Main app (`app/main.py`) includes API router with `/api` prefix

### Key Dependencies
- FastAPI with SQLAlchemy for web framework and ORM
- pgvector for vector similarity search
- OpenAI API for embeddings and chat completion (models: gpt-4.1-nano, text-embedding-3-small)
- Redis for caching
- Alembic for database migrations

### Configuration
Environment variables loaded via Pydantic Settings from `.env`:
- `DATABASE_URL` - PostgreSQL connection
- `REDIS_URL` - Redis connection  
- `OPENAI_API_KEY` - OpenAI authentication
- `SECRET_KEY` - JWT signing key

### CLI Tools
Separate CLI module for data management tasks like loading legal documents and performing searches outside the web interface.