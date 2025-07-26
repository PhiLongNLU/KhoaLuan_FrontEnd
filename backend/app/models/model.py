from typing import Optional

from pydantic import BaseModel, EmailStr


class User(BaseModel):
    username: str
    email: str
    picture: str

class TokenData(BaseModel):
    token: str

class ValidateResponse(BaseModel):
    is_valid: bool
    user_info: Optional[User] = None
    error: Optional[str] = None