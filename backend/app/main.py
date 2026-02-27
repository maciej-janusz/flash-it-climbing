from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.db.mongo import create_client, init_beanie_for_models
from app.db.seeder import seed_countries
from app.models.routebase import Route, Crag, Country
from app.api.v1.routebase import router as routebase_router

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    settings = get_settings()
    client = create_client()
    db = client[settings.mongo_db]

    await init_beanie_for_models(db, [Route, Crag, Country])
    await seed_countries()

    try:
        yield
    finally:
        client.close()
        


app = FastAPI(title=get_settings().app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routebase_router)