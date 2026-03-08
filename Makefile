.PHONY: backend-dev backend-format frontend-dev frontend-format

backend-dev:
	cd backend && uv run fastapi dev app/main.py

backend-format:
	cd backend && uv run ruff check --fix && uv run ruff format

frontend-dev:
	cd frontend && pnpm dev

frontend-format:
	cd frontend && pnpm format
