# Almalex Backend

FastAPI-based RAG (Retrieval-Augmented Generation) system for Swiss legal documents.

## Features

- **Vector Search**: Semantic search using pgvector and OpenAI embeddings
- **Chat Interface**: Streaming chat API with conversation history
- **Document Management**: Load and index Swiss legal documents (Fedlex, BGE)
- **Rate Limiting**: Request throttling for API protection
- **Caching**: Redis-based response caching

## Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL with pgvector extension
- **ORM**: SQLAlchemy
- **AI**: OpenAI API (embeddings & chat)
- **Cache**: Redis
- **Migrations**: Alembic

## Prerequisites

- Python 3.13+
- [uv](https://github.com/astral-sh/uv) package manager
- PostgreSQL with pgvector extension
- Redis server
- OpenAI API key

## Installation

1. Install dependencies using uv:
```bash
# Install uv if you haven't already
curl -LsSf https://astral.sh/uv/install.sh | sh

# Install project dependencies (creates .venv automatically)
uv sync --dev
```

2. Activate the virtual environment:
```bash
# On Linux/macOS
source .venv/bin/activate

# On Windows
.venv\Scripts\activate

# Or use uv run to run commands without activation
# Example: uv run python app/main.py
```

3. Set up environment variables:
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration
# - Add your OpenAI API key
# - Update database credentials if needed
# - Generate a new SECRET_KEY with: openssl rand -hex 32
```

4. Run database migrations:
```bash
alembic upgrade head
```

## Development

> **Note:** All commands below assume you've activated the virtual environment with `source .venv/bin/activate`

### Run the server
```bash
# Development server with hot reload
fastapi dev app/main.py

# Alternative port
fastapi dev app/main.py --port 8001

# Production server
fastapi run app/main.py

# Alternative with uvicorn
uvicorn app.main:app --reload --port 8000 --log-level info
```

### Linting & Formatting
```bash
ruff check          # Run linting
ruff format         # Format code
ruff check --fix    # Auto-fix issues
```

### Database Migrations
```bash
alembic upgrade head                                    # Apply migrations
alembic revision --autogenerate -m "description"       # Create migration
```

## CLI Commands

The backend includes CLI tools for data management:

```bash
# Load Swiss legal documents
python -m cli.main load-fedlex

# Load court decisions
python -m cli.main load-bge

# Search documents
python -m cli.main search "query"

# Get AI-generated answer
python -m cli.main prompt "question"

# Maintenance commands
python -m cli.main cleanup-chats      # Remove old chats
python -m cli.main fix-fedlex-urls    # Update document URLs

# Interactive shell
python -m cli.main shell
```

## API Endpoints

- `GET /api/chats` - List all chats
- `GET /api/chats/{chat_id}` - Get chat details
- `POST /api/chats/{chat_id}/messages` - Send message (SSE streaming)

## Architecture

### Data Flow
1. User sends message to chat endpoint
2. Message embedding created via OpenAI
3. Vector similarity search in pgvector
4. Top-k document chunks retrieved
5. Context + query sent to OpenAI
6. Streaming response to client

### Key Components

- **Models** (`app/db/models.py`): Document, DocumentChunk, Chat, ChatMessage
- **CRUD** (`app/crud.py`): Database operations and vector search
- **AI Service** (`app/ai/service.py`): OpenAI integration
- **API Routes** (`app/api/routes/`): REST endpoints
- **CLI** (`cli/`): Command-line tools

## License

See parent repository for license information.