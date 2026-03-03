from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.models.users import OAuthAccount, User

from app.core.config import get_settings
from app.db.mongo import create_client, init_beanie_for_models
from app.db.seeder import seed_countries
from app.models.routebase import Route, Crag, Country
from app.api.v1.endpoints.routebase import router as routebase_router
from app.api.v1.endpoints.auth import router as auth_router
from starlette.middleware.sessions import SessionMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """
    Handle application startup and shutdown events.
    Initializes database client, models, and seeds initial data.
    """
    settings = get_settings()
    client = create_client()
    db = client[settings.mongo_db]

    await init_beanie_for_models(db, [Route, Crag, Country, User])
    await seed_countries()

    try:
        yield
    finally:
        client.close()

        
settings = get_settings()

app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    
)

app.add_middleware(
    SessionMiddleware, 
    secret_key=settings.auth_secret, 
    https_only=False,  #todo: wyjebac
    same_site="lax"
)

app.include_router(routebase_router)
app.include_router(auth_router, prefix="/auth")

