from collections.abc import Sequence
from typing import Type

from beanie import Document, init_beanie
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from ..core.config import get_settings


def create_client() -> AsyncIOMotorClient:
    settings = get_settings()
    return AsyncIOMotorClient(settings.mongo_uri)


async def init_beanie_for_models(
    db: AsyncIOMotorDatabase, document_models: Sequence[Type[Document]]
) -> None:
    await init_beanie(database=db, document_models=list(document_models))
    print("Beanie inited successfully")

