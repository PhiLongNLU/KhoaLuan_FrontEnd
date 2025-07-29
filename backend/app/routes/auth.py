import re
from fastapi import APIRouter, status, HTTPException
from app.models.user import User as UserModel, UserCredentials, UserOut
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.config import settings
from app.core.response import Response
from datetime import timedelta
from app.models.token import Token

route = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

EMAIL_REGEX = re.compile(r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)")

def validate_email(email: str):
    if not EMAIL_REGEX.match(email):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid email format"
        )

@route.post("/register", status_code=status.HTTP_201_CREATED, response_model=Response[UserOut])
async def create_user(user: UserCredentials):
    validate_email(user.email)
    existing_user = await UserModel.find_one(UserModel.email == user.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this email already exists"
        )

    hashed_password = get_password_hash(user.password)
    new_user = UserModel(email=user.email, hashed_password=hashed_password)
    await new_user.insert()

    return Response(
        status_code=status.HTTP_201_CREATED,
        message="User registered successfully",
        data=new_user
    )

@route.post("/login", response_model=Response[Token])
async def login(form_data: UserCredentials):
    validate_email(form_data.email)
    user = await UserModel.find_one(UserModel.email == form_data.email)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "id": str(user.id)}, expires_delta=access_token_expires
    )

    return Response(
        message="Login successful",
        data=Token(access_token=access_token, token_type="bearer")
    )
