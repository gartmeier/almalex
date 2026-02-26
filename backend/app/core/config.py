from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    secret_key: str
    database_url: str
    redis_url: str = "redis://localhost:6379/0"
    sentry_dsn: str | None = None
    anthropic_api_key: str
    openai_api_key: str
    openai_base_url: str
    openai_chat_model: str
    openai_embedding_model: str
    bulk_embedding_api_key: str
    bulk_embedding_base_url: str
    bulk_embedding_model: str
    bulk_embedding_batch_size: int = 100


settings = Settings()  # type: ignore
