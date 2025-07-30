from beanie import Document, Link, PydanticObjectId
from pydantic import Field, BaseModel, field_validator
from app.models.user import User
from datetime import datetime
from typing import List

class Conversation(Document):
    user: Link[User]
    title: str = Field(default="New Conversation")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_updated:datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "conversations"
        indexers = [
            "user",
            "created_at",
            "last_updated",
        ]
    
    async def update_last_updated(self):
        self.last_updated = datetime.utcnow()
        await self.save()

class ConversationOut(BaseModel):
    id: PydanticObjectId
    title: str
    user: PydanticObjectId
    created_at: datetime
    last_updated: datetime

    @field_validator("user", mode="before")
    @classmethod
    def get_user_id_from_link(cls, v):
        if isinstance(v, Link):
            return v.ref.id
        return v


class ConversationOutSimple(BaseModel):
    id: PydanticObjectId = Field(..., alias="_id")
    title: str

class ConversationCreate(BaseModel):
    title: str = "New Chat"

class ConversationUpdate(BaseModel):
    title: str