from pydantic import BaseModel, EmailStr
from typing import Optional


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None


class User(BaseModel):
    google_id: str
    email: EmailStr
    name: Optional[str] = None
    picture: Optional[str] = None
