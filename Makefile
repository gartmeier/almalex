.PHONY: backend-dev frontend-dev

backend-dev:
	cd backend && uv run fastapi dev app/main.py

frontend-dev:
	cd frontend && pnpm dev
