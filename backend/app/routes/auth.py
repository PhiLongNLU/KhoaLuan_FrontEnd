import re
import random
from fastapi import APIRouter, status, HTTPException, BackgroundTasks
from app.models.user import User as UserModel, UserCredentials, UserOut, PasswordResetToken
from app.models.auth import ForgotPasswordSchema, ResetPasswordSchema
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.config import settings
from app.core.response import Response
from datetime import timedelta, datetime
from app.models.token import Token
from app.services.mail_service import send_email

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

@route.post("/forgot-password", status_code=status.HTTP_202_ACCEPTED, response_model=Response)
async def forgot_password(data: ForgotPasswordSchema, background_tasks: BackgroundTasks):
    validate_email(data.email)
    user = await UserModel.find_one({"email": data.email})

    if user:
        # Delete any existing tokens for this user to ensure only one is valid
        await PasswordResetToken.find(PasswordResetToken.user.id == user.id).delete()

        reset_token = str(random.randint(100000, 999999))
        
        token_doc = PasswordResetToken(token=reset_token, user=user)
        await token_doc.insert()

        email_subject = "Password Reset Request"
        email_body = f"""
        <p>Hi {user.email},</p>
        <p>You requested a password reset. Here is your token:</p>
        <p><b>{reset_token}</b></p>
        <p>This token will expire in {settings.PASSWORD_RESET_TOKEN_EXPIRE_MINUTES} minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
        """
        background_tasks.add_task(
            send_email,
            subject=email_subject,
            recipients=[user.email],
            body=email_body,
            html=email_body
        )

    return Response(
        status_code=status.HTTP_202_ACCEPTED,
        message="If an account with that email exists, a password reset link has been sent."
    )

@route.post("/reset-password", response_model=Response)
async def reset_password(data: ResetPasswordSchema, background_tasks: BackgroundTasks):
    token_doc = await PasswordResetToken.find_one(PasswordResetToken.token == data.token, fetch_links=True)

    if not token_doc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token")

    expire_time = token_doc.created_at + timedelta(minutes=settings.PASSWORD_RESET_TOKEN_EXPIRE_MINUTES)
    if datetime.utcnow() > expire_time:
        await token_doc.delete()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Token has expired")

    user = token_doc.user
    hashed_password = get_password_hash(data.password)
    await user.set({UserModel.hashed_password: hashed_password})
    await token_doc.delete()

    return Response(message="Password has been reset successfully.")
