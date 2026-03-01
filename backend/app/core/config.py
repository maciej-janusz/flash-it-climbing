from functools import lru_cache
from typing import Optional
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from fastapi_users import fastapi_users


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

    auth_secret: str = Field(default="secretkey", description="Auth secret")
    
    google_client_id: str = Field(..., description="Auth secret")
    google_client_secret: str = Field(..., description="Auth secret")

    frontend_url: str = Field(default="http://localhost:3000", description="Frontend URL")
    api_base_url: str = Field(default="http://localhost:8000", description="API base URL")

    @property
    def mongo_uri(self) -> str:
        return (
            f"mongodb://{self.mongo_user}:{self.mongo_password}"
            f"@{self.mongo_host}:{self.mongo_port}/?authSource=admin"
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()
