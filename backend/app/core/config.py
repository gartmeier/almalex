from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    secret_key: str
    database_url: str
    redis_url: str = "redis://localhost:6379/0"
    sentry_dsn: str | None = None
    anthropic_api_key: str
    openai_api_key: str
    openai_base_url: str
    openai_chat_model: str
    openai_embedding_model: str
    cohere_api_key: str
    cohere_base_url: str
    cohere_rerank_model: str


@lru_cache()
def get_settings():
    return Settings()  # type: ignore


settings = get_settings()
