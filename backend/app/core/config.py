from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    secret_key: str = None
    database_url: str = None
    redis_url: str = "redis://localhost:6379/0"
    openai_api_key: str = None
    openai_model: str = "gpt-4.1-nano"
    openai_embedding_model: str = "text-embedding-3-small"


@lru_cache()
def get_settings():
    return Settings()


settings = get_settings()
