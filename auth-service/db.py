from motor.motor_asyncio import AsyncIOMotorClient
import os

MONGO_URL = os.getenv("MONGO_URL", "your_mongodb_atlas_connection_string")
client = AsyncIOMotorClient(MONGO_URL)
db = client.auth_db #database name