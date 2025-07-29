from beanie import Document, Link
from app.models.user import User
from datetime import datetime

class Profile(Document):
    user: Link[User]
    username: str
    phone: str
    avatar: str
    lastLogin: datetime
    lastUpdated: datetime

    class Settings:
        name = "profiles"