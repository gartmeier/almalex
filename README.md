# Almalex

A modern RAG (Retrieval-Augmented Generation) system for Swiss legal documents, built with FastAPI and React Router.

## Architecture

### Backend
- **FastAPI** with PostgreSQL and pgvector for vector similarity search
- **OpenAI API** integration for embeddings and chat completion
- **Redis** for caching
- **Alembic** for database migrations
- **CLI tools** for document loading and management

### Frontend
- **React Router** 7 with TypeScript
- **Tailwind CSS** with DaisyUI components
- **Radix UI** primitives
- **React Query** for state management

## Quick Start

### Prerequisites
- Python 3.13+
- Node.js 18+
- PostgreSQL with pgvector extension
- Redis
- OpenAI API key

### Backend Setup

```bash
cd backend
pip install -e .
```

Create `.env` file:
```env
DATABASE_URL=postgresql://user:password@localhost/almalex
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=your_openai_api_key
SECRET_KEY=your_secret_key
```

Run migrations and start server:
```bash
alembic upgrade head
fastapi dev app/main.py
```

### Frontend Setup

```bash
cd frontend
pnpm install
pnpm dev
```

### Load Documents

```bash
cd backend
python -m cli.main load-fedlex
```

## Development

### Backend Commands
- `ruff check` - Lint code
- `ruff format` - Format code
- `alembic revision --autogenerate -m "description"` - Create migration
- `python -m cli.main search "query"` - Search documents

### Frontend Commands
- `pnpm dev` - Development server
- `pnpm build` - Production build
- `pnpm typecheck` - Type checking
- `pnpm generate-client` - Generate API client

## Features

- **Vector Search**: Semantic search through Swiss legal documents using pgvector
- **Chat Interface**: Interactive chat with AI assistant for legal queries
- **Document RAG**: Retrieval-augmented generation for contextual responses
- **Rate Limiting**: Request throttling with Redis
- **Authentication**: JWT-based auth system
- **Real-time Updates**: Server-sent events for streaming responses

## API Endpoints

- `GET /api/chats` - List user chats
- `POST /api/chats` - Create new chat
- `POST /api/chats/{id}/messages` - Send message (streaming)
- `POST /api/auth/login` - User authentication