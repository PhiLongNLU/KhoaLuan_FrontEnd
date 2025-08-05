from datetime import datetime

from beanie import Document, Link, PydanticObjectId
from pydantic import BaseModel, EmailStr, Field, field_validator

class User(Document):
    id: PydanticObjectId = Field(default_factory=PydanticObjectId, alias="_id")
    email: EmailStr
    hashed_password: str

    class Settings:
        name = "users"
    
class UserOut(BaseModel):
    id: PydanticObjectId
    email: EmailStr

class PasswordResetToken(Document):
    token: str = Field(..., index=True, unique=True)
    user: Link[User]
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "password_reset_tokens"