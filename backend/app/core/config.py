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
        "openai/gpt-oss-120b",
        "qwen3",
        "llama3",
        "swiss-ai/Apertus-70B-Instruct-2509",
        "mistral3",
    ]

    # Query expansion
    query_expansion_model: str | None = None

    # Search settings
    search_article_top_k: int = 12
    search_decision_top_k: int = 8


settings = Settings()  # type: ignore
