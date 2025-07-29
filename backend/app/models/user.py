from uuid import UUID, uuid4
from beanie import Document
from pydantic import EmailStr, Field
from pydantic import BaseModel, EmailStr, validator

class User(Document):
    id: UUID = Field(default_factory=uuid4, alias="_id")
    email: EmailStr
    hashed_password: str

    class Settings:
        name = "users"

class UserCredentials(BaseModel):
    email: EmailStr
    password: str

    @validator('password')
    def password_length(cls, v):
        if len(v) <= 6:
            raise ValueError('Password must be longer than 6 characters')
        return v
    
class UserOut(BaseModel):
    id: UUID
    email: EmailStr