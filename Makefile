.PHONY: backend-run frontend-run

backend-run:
	cd backend && uv run fastapi dev app/main.py

frontend-run:
	cd frontend && pnpm dev
