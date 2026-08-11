FROM ghcr.io/astral-sh/uv:python3.13-bookworm-slim

ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy
ENV PATH=/app/.venv/bin:$PATH
WORKDIR /app

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev --no-install-project

COPY alembic.ini ./
COPY alembic ./alembic
COPY app ./app
COPY cli ./cli

RUN useradd --create-home app && chown -R app:app /app
USER app
EXPOSE 8000
CMD ["fastapi", "run", "--workers", "4", "--host", "0.0.0.0", "--port", "8000", "app/main.py"]
