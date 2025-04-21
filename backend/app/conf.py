from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    database_url: str = None
    openai_api_key: str = None


@lru_cache()
def get_settings():
    return Settings()


settings = get_settings()
