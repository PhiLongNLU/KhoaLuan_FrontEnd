from fastapi import HTTPException
from db import db
from utils import hash_password, verify_password, create_access_token
from model import UserCreate

async def register_user(user: UserCreate):
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pwd = hash_password(user.password)
    new_user = {"email": user.email, "password": hashed_pwd}
    result = await db.users.insert_one(new_user)
    return str(result.inserted_id)

async def authenticate_user(email: str, password: str):
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(password, user["password"]):
        return None
    return user