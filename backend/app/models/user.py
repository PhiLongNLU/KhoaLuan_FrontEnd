from uuid import UUID, uuid4
from beanie import Document
from pydantic import EmailStr, Field

class User(Document):
    id: UUID = Field(default_factory=uuid4, alias="_id")
    email: EmailStr
    hashed_password: str

    class Settings:
        name = "users"