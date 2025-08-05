from beanie import Document, Link, PydanticObjectId
from pydantic import Field, BaseModel, field_validator
from app.models.user import User
from app.models.conversation import Conversation
from datetime import datetime

class Message(Document):
    conversation: Link[Conversation]
    sender_type: str
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "messages"
        indexes=[
            "conversation",
            "created_at"
        ]

class MessageOut(BaseModel):
    id: PydanticObjectId
    conversation: PydanticObjectId
    sender_type: str
    content: str
    created_at: datetime

    @field_validator("conversation", mode="before")
    @classmethod
    def get_conversation_id_from_link(cls, v):
        if isinstance(v, Link):
            return v.ref.id
        if isinstance(v, Document):
            return v.id
        return v

class MessageCreate(BaseModel):
    conversation_id: PydanticObjectId
    content: str