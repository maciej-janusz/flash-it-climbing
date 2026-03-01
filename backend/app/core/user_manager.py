from fastapi import Depends
from fastapi_users import BaseUserManager, UUIDIDMixin
from fastapi_users_db_beanie import BeanieUserDatabase
from app.core.config import get_settings
from app.models.users import User, OAuthAccount
from beanie import PydanticObjectId
from typing import Optional
from fastapi import Request
import httpx

class UserManager(BaseUserManager[User, PydanticObjectId]):
    settings = get_settings()
    reset_password_token_secret = settings.auth_secret
    verification_token_secret = settings.auth_secret

    def parse_id(self, value: any) -> PydanticObjectId:
        if isinstance(value, PydanticObjectId):
            return value
        return PydanticObjectId(value)
    

async def get_user_db():
    yield BeanieUserDatabase(User, OAuthAccount)

async def get_user_manager(user_db=Depends(get_user_db)):
    yield UserManager(user_db)