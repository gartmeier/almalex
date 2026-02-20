from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    secret_key: str
    database_url: str
    redis_url: str = "redis://localhost:6379/0"
    sentry_dsn: str | None = None
    anthropic_api_key: str
    infomaniak_api_key: str
    infomaniak_chat_product_id: str
    infomaniak_chat_model: str
    infomaniak_embedding_product_id: str
    infomaniak_embedding_model: str = "bge_multilingual_gemma2"
    cohere_api_key: str
    cohere_rerank_model: str = "rerank-multilingual-v3.0"
    hf_token: str | None = None


@lru_cache()
def get_settings():
    return Settings()  # type: ignore


settings = get_settings()
