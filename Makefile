.PHONY: backend-dev frontend-dev frontend-typecheck format

backend-dev:
	cd backend && uv run fastapi dev app/main.py

frontend-dev:
	cd frontend && pnpm dev

frontend-typecheck:
	cd frontend && pnpm typecheck

format:
	cd backend && uv run ruff check --fix && uv run ruff format
	cd frontend && pnpm format
