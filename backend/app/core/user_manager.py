from fastapi import Depends
from fastapi_users import BaseUserManager, UUIDIDMixin
from fastapi_users_db_beanie import BeanieUserDatabase
from app.core.config import get_settings
from app.models.users import User, OAuthAccount
from beanie import PydanticObjectId
from typing import Optional
from fastapi import Request
import httpx
from fastapi_users import exceptions
import secrets

class UserManager(BaseUserManager[User, PydanticObjectId]):
    settings = get_settings()
    reset_password_token_secret = settings.auth_secret
    verification_token_secret = settings.auth_secret

    def parse_id(self, value: any) -> PydanticObjectId:
        if isinstance(value, PydanticObjectId):
            return value
        return PydanticObjectId(value)

    async def on_after_register(self, user: User, request: Optional[Request] = None):
        print(f"User {user.id} has registered.")

    async def oauth_callback(
        self,
        oauth_name: str,
        access_token: str,
        account_id: str,
        account_email: str,
        expires_at: int | None = None,
        refresh_token: str | None = None,
        request: Request | None = None,
        *,
        associate_by_email: bool = False,
        is_verified_by_default: bool = False,
    ) -> User:
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            profile_data = response.json() if response.status_code == 200 else {}

        user = None
        try:
            user = await self.user_db.get_by_oauth_account(oauth_name, account_id)
        except exceptions.UserNotExists:
            user = None

        if user is None and associate_by_email:
            try:
                user = await self.get_by_email(account_email)
            except exceptions.UserNotExists:
                user = None

        oauth_account_dict = {
            "oauth_name": oauth_name,
            "access_token": access_token,
            "account_id": account_id,
            "account_email": account_email,
            "expires_at": expires_at,
            "refresh_token": refresh_token,
        }

        if user is None:
            random_password = secrets.token_urlsafe(32)
            hashed_password = self.password_helper.hash(random_password)
            
            user_dict = {
                "email": account_email,
                "first_name": profile_data.get("given_name"),
                "last_name": profile_data.get("family_name"),
                "hashed_password": hashed_password,
                "picture": profile_data.get("picture"),
                "is_active": True,
                "is_verified": is_verified_by_default,
                "oauth_accounts": [oauth_account_dict],
            }
            return await self.user_db.create(user_dict)
        
        found_oauth = False
        for i, existing_oauth in enumerate(user.oauth_accounts):
            if existing_oauth.oauth_name == oauth_name and existing_oauth.account_id == account_id:
                user.oauth_accounts[i].access_token = access_token
                user.oauth_accounts[i].refresh_token = refresh_token
                found_oauth = True
                break
        
        if not found_oauth:
            user.oauth_accounts.append(OAuthAccount(**oauth_account_dict))

        update_fields = {"oauth_accounts": [oa.model_dump() for oa in user.oauth_accounts]}
        if not user.first_name: update_fields["first_name"] = profile_data.get("given_name")
        if not user.last_name: update_fields["last_name"] = profile_data.get("family_name")
        if not user.picture: update_fields["picture"] = profile_data.get("picture")

        await user.update({"$set": update_fields})
        return user

async def get_user_db():
    yield BeanieUserDatabase(User, OAuthAccount)

async def get_user_manager(user_db=Depends(get_user_db)):
    yield UserManager(user_db)

'''
{"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OWE1ZTEyZGQ4NjhjM2I3N2Y4NTNjODAiLCJhdWQiOlsiZmFzdGFwaS11c2VyczphdXRoIl0sImV4cCI6MTc3MjQ4MjM2NX0.lV1oeGcSZ_9LGM3UeRBd8iMyRDQbW-YSvPb6LjGRZn0","token_type":"bearer"}
'''