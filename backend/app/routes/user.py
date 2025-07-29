from fastapi import APIRouter, HTTPException, status, Depends
from beanie import PydanticObjectId
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from app.models.profile import Profile
from app.models.user import User
from app.core.response import Response
from app.core.config import settings

route = APIRouter(
    prefix="/users",
    tags=["User"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("id")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = await User.get(PydanticObjectId(user_id))
    if user is None:
        raise credentials_exception
    return user

@route.get("/{user_id}/profile", response_model=Response[Profile])
async def get_profile_by_user_id(user_id: PydanticObjectId):
    profile = await Profile.find_one(Profile.user.id == user_id, fetch_links=False)

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found"
        )

    return Response(data=profile)

@route.get("/me", response_model=Response[Profile])
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    profile = await Profile.find_one(Profile.user.id == current_user.id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found"
        )
    return Response(data=profile)