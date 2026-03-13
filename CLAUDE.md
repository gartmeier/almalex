# CLAUDE.md

## Development Commands

Always use the root Makefile instead of running commands directly:

- `make check` - Run all linting and type checking (ruff, typecheck, prettier)
- `make format` - Auto-fix and format all code (ruff + prettier)
- `make backend-dev` - Start FastAPI dev server
- `make frontend-dev` - Start React Router dev server

Do NOT run `pnpm typecheck`, `ruff check`, `prettier`, etc. directly.
