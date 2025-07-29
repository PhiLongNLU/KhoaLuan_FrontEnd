from datetime import datetime

from beanie import Document, Link, PydanticObjectId
from pydantic import BaseModel, EmailStr, Field, field_validator

class User(Document):
    email: EmailStr
    hashed_password: str

    class Settings:
        name = "users"

class UserCredentials(BaseModel):
    email: EmailStr
    password: str

    @field_validator('password')
    @classmethod
    def password_length(cls, v: str) -> str:
        if len(v) <= 6:
            raise ValueError('Password must be longer than 6 characters')
        return v
    
class UserOut(BaseModel):
    id: PydanticObjectId
    email: EmailStr

class PasswordResetToken(Document):
    token: str = Field(..., index=True, unique=True)
    user: Link[User]
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "password_reset_tokens"