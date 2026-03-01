from typing import Optional
from pydantic import EmailStr, Field, field_validator
from fastapi_users import schemas
from app.schemas.utils import Hidden, BasicModel, PyObjectId
import re

class BaseUser(BasicModel):
    first_name: str = Field(..., min_length=2)
    last_name: str = Field(..., min_length=2)
    picture: Optional[str] = Field(None)

class UserCreate(schemas.BaseUserCreate, BaseUser):
    email: EmailStr
    password: str = Field(..., min_length=8)
    
    is_active: Hidden[bool] = True
    is_superuser: Hidden[bool] = False
    is_verified: Hidden[bool] = False

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if not re.search(r"[A-Z]", v):
            raise ValueError("At least 1 uppercase letter required")
        if not re.search(r"[a-z]", v):
            raise ValueError("At least 1 lowercase letter required")
        if not re.search(r"\d", v):
            raise ValueError("At least 1 digit required")
        return v

class UserRead(schemas.BaseUser[PyObjectId], BaseUser):
    pass

class UserUpdate(schemas.BaseUserUpdate, BaseUser):
    pass