from beanie import init_beanie
import motor.motor_asyncio
from app.models.user import User

async def init_db():
    client = motor.motor_asyncio.AsyncIOMotorClient("mongodb://localhost:27017")
    
    await init_beanie(database=client.khoaluan_db, document_models=[User])