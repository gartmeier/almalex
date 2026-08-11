# Alma Lex

**Swiss Legal AI** - An AI-powered platform for exploring Swiss law through natural language conversations.

## About

Alma Lex is a demo project by [Joshua Gartmeier](https://www.linkedin.com/in/gartmeier/) showcasing how AI can democratize access to Swiss legal information. The platform uses RAG (Retrieval-Augmented Generation) to search and analyze official Swiss legal sources, including:

- Systematic Collection of Swiss Federal Law (SR)
- Federal Court decisions

## Who is this for?

- **Legal professionals** exploring AI applications in law
- **Developers** interested in RAG systems and legal tech
- **Students & researchers** needing quick Swiss legal references
- **Anyone** curious about Swiss law and AI capabilities

## ⚠️ Important Disclaimers

- **Demo only**: This is a technical demonstration, not legal advice
- **Public chats**: All conversations are accessible via URL - avoid sharing sensitive data
- **Auto-deletion**: Chats expire 30 days after last activity
- **Professional consultation**: For actual legal matters, consult qualified lawyers

## Project Structure

This monorepo contains:

- **[`/backend`](backend/README.md)** - FastAPI application with PostgreSQL, pgvector, and OpenAI integration
- **[`/frontend`](frontend/README.md)** - React Router v7 application with TypeScript and Tailwind CSS

## Docker deployment

Production images are published to GitHub Container Registry on every push to `main`:

- `ghcr.io/gartmeier/almalex-backend:<commit-sha>`
- `ghcr.io/gartmeier/almalex-frontend:<commit-sha>`

PostgreSQL and Redis data live in named Docker volumes. The frontend and backend bind only to host ports `8011` and `8010`, respectively, for the host reverse proxy.

### Server setup

1. Install Docker Engine with the Compose plugin and clone the repository to `/var/www/almalex.ch`.
2. Copy `.env.example` to `.env` and set `POSTGRES_PASSWORD`.
3. Copy `backend/.env.example` to `backend/.env`, set the API credentials and generate a new `SECRET_KEY`. Compose overrides `DATABASE_URL` and `REDIS_URL`.
4. Back up the existing PostgreSQL database and restore it into the `almalex-postgres-1` container before switching production traffic. A fresh installation can skip this step.
5. Set the optional `VITE_SENTRY_DSN` GitHub secret if frontend error reporting is enabled.

Images default to the `latest` tag. Deploy manually on the server:

```bash
docker compose pull
docker compose up -d --wait --remove-orphans
```

Compose applies database migrations before starting the backend. For an immutable deployment or rollback, set `IMAGE_TAG` in `.env` to a published commit SHA and run the same commands. If the GHCR packages are private, authenticate once with a classic personal access token that has `read:packages` permission.

Schedule the containerized document sync with the host's cron daemon (`crontab -e`):

```cron
0 5 * * * cd /var/www/almalex.ch && /usr/bin/docker compose run --rm sync >> /var/log/almalex-sync.log 2>&1
```

Cron uses the server's timezone. Running the command manually triggers an immediate sync.

For local builds, run `docker compose build` followed by `docker compose up -d --wait`. The backend requires `backend/.env` even when Compose supplies its database and Redis URLs.
