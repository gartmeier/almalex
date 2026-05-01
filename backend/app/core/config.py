from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # App
    debug: bool = False
    secret_key: str
    contact_email: str | None = None
    sentry_dsn: str | None = None

    # Database & Redis
    database_url: str
    redis_url: str = "redis://localhost:6379/0"

    # OpenAI-compatible chat API
    openai_api_key: str
    openai_base_url: str
    openai_chat_model: str
    openai_embedding_model: str
    openai_reasoning_effort: str = "medium"
    openai_max_completion_tokens: int = 1500

    # Bulk embedding
    bulk_embedding_api_key: str
    bulk_embedding_base_url: str
    bulk_embedding_model: str
    bulk_embedding_batch_size: int
    bulk_embedding_max_workers: int

    # Anthropic
    anthropic_api_key: str

    # Allowed chat models
    allowed_models: list[str] = [
        "google/gemma-4-31B-it",
        "Qwen/Qwen3.5-122B-A10B-FP8",
        "mistralai/Ministral-3-14B-Instruct-2512",
        "swiss-ai/Apertus-70B-Instruct-2509",
    ]

    # Query expansion
    query_expansion_model: str | None = None

    # Cohere reranker
    cohere_api_key: str
    cohere_base_url: str
    cohere_rerank_model: str = "BAAI/bge-reranker-v2-m3"

    # Search settings
    search_article_top_k: int = 12
    search_decision_top_k: int = 8
    rerank_article_candidates: int = 24
    rerank_decision_candidates: int = 16


settings = Settings()  # type: ignore
