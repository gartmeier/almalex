# CLAUDE.md

## Development Commands

Always use the root Makefile instead of running commands directly:

- `make backend-dev` - Start FastAPI dev server
- `make frontend-dev` - Start React Router dev server
- `make frontend-typecheck` - Run frontend typecheck
- `make format` - Auto-fix and format all code (ruff + prettier)

Do NOT run `pnpm typecheck`, `ruff check`, `prettier`, etc. directly.

## Dev Servers

Assume backend and frontend dev servers are always running. Do not start them.
