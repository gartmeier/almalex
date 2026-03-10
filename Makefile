.PHONY: backend-dev frontend-dev check format

backend-dev:
	cd backend && uv run fastapi dev app/main.py

frontend-dev:
	cd frontend && pnpm dev

check: 
	cd backend && uv run ruff check
	cd frontend && pnpm typecheck
	cd frontend && prettier --check .

format:
	cd backend && uv run ruff check --fix && uv run ruff format
	cd frontend && pnpm format
