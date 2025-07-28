from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, validator


class User(BaseModel):
    username: str
    email: str
    picture: str

class UserCreate(BaseModel):
    email: EmailStr
    password: str

    @validator('password')
    def password_length(cls, v):
        if len(v) <= 10:
            raise ValueError('Password must be longer than 10 characters')
        return v


class TokenData(BaseModel):
    token: str

class ValidateResponse(BaseModel):
    is_valid: bool
    user_info: Optional[User] = None
    error: Optional[str] = None

class UserOut(BaseModel):
    id: UUID
    email: EmailStr