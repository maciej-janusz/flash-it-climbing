from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment and optional .env file."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = Field(default="Flash It API", description="Application name")
    mongo_user: str = Field(default="flashit", description="MongoDB username")
    mongo_password: str = Field(default="flashitpassword", description="MongoDB password")
    mongo_host: str = Field(default="mongodb", description="MongoDB host")
    mongo_port: int = Field(default=27017, ge=1, le=65535, description="MongoDB port")
    mongo_db: str = Field(default="flashit", description="MongoDB database name")

    @property
    def mongo_uri(self) -> str:
        return (
            f"mongodb://{self.mongo_user}:{self.mongo_password}"
            f"@{self.mongo_host}:{self.mongo_port}/?authSource=admin"
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()
