from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.models.users import OAuthAccount, User

from app.core.config import get_settings
from app.db.mongo import create_client, init_beanie_for_models
from app.db.seeder import seed_countries
from app.models.routebase import Route, Crag, Country
from app.api.v1.routebase import router as routebase_router
from app.core.auth import auth_backend, fastapi_users

from app.schemas.users import UserRead, UserCreate, UserUpdate

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

app.include_router(routebase_router)

app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/auth/jwt",
    tags=["auth"],
)

app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/users",
    tags=["users"],
)
