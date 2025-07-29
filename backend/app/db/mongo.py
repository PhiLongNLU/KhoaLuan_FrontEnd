from beanie import init_beanie
import motor.motor_asyncio
from app.models.user import User, PasswordResetToken
from app.models.profile import Profile
from app.core.config import settings

async def init_db():
    client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGO_URI)
    
    await init_beanie(database=client[settings.MONGO_DB_NAME], document_models=[User, PasswordResetToken, Profile])