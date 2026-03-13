from fastapi import APIRouter, Depends
from httpx_oauth.clients.google import GoogleOAuth2
from app.auth.auth_config import auth_backend, fastapi_users
from app.core.config import get_settings
from app.schemas.users import UserRead, UserCreate, UserUpdate
from app.auth.user_manager import get_user_manager

router = APIRouter()
settings = get_settings()

google_oauth_client = GoogleOAuth2(
    settings.google_client_id,
    settings.google_client_secret,
)

# JWT Auth router
router.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/jwt",
    tags=["auth"],
)

# Registration router
router.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    tags=["auth"],
)

# Users router
router.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/users",
    tags=["users"],
)

# Google OAuth router
router.include_router(
    fastapi_users.get_oauth_router(
        google_oauth_client,
        auth_backend,
        settings.auth_secret,
        associate_by_email=True,
        is_verified_by_default=True,
        redirect_url= f"{settings.frontend_url}/auth/oauth-callback",
        csrf_token_cookie_secure=False, #todo: wyjebac
        csrf_token_cookie_samesite="lax",
    ),
    prefix="/google",
    tags=["auth"],
)
