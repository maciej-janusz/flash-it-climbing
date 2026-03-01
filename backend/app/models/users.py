import uuid
from typing import List, Optional
from beanie import Document, init_beanie
from fastapi_users_db_beanie import BeanieBaseUser, BaseOAuthAccount
from pydantic import Field
from pymongo.collation import Collation

class OAuthAccount(BaseOAuthAccount):
    pass

class User(BeanieBaseUser, Document):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    
    picture: Optional[str] = None
    oauth_accounts: List[OAuthAccount] = []

    class Settings:
        name = "users"
        email_collation = Collation("en", strength=2)