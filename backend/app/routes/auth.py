import re
from fastapi import APIRouter, status, HTTPException, Body
from app.models.model import UserCreate, UserOut
from app.models.user import User as UserModel
from app.core.security import get_password_hash

route = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

EMAIL_REGEX = re.compile(r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)")

@route.post("/register", status_code=status.HTTP_201_CREATED, response_model=UserOut)
async def create_user(user: UserCreate):
    if not EMAIL_REGEX.match(user.email):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid email format"
        )

    existing_user = await UserModel.find_one(UserModel.email == user.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this email already exists"
        )

    hashed_password = get_password_hash(user.password)
    new_user = UserModel(email=user.email, hashed_password=hashed_password)
    await new_user.insert()

    return new_user
