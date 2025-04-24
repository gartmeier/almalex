from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    secret_key: str = None
    database_url: str = None
    openai_api_key: str = None


@lru_cache()
def get_settings():
    return Settings()


settings = get_settings()
