from fastapi_users.authentication import AuthenticationBackend, BearerTransport, JWTStrategy
from .config import get_settings
from fastapi_users import FastAPIUsers
from app.models.users import User
from app.core.user_manager import get_user_manager
from beanie import PydanticObjectId

bearer_transport = BearerTransport(tokenUrl="auth/jwt/login")

def get_jwt_strategy() -> JWTStrategy:
    settings = get_settings()
    return JWTStrategy(secret=settings.auth_secret, lifetime_seconds=3600)

auth_backend = AuthenticationBackend(
    name="jwt",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)

fastapi_users = FastAPIUsers[User, PydanticObjectId](get_user_manager, [auth_backend])