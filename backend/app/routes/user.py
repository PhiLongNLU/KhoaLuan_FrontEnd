from fastapi import APIRouter, HTTPException, status
from beanie import PydanticObjectId
from app.models.profile import Profile
from app.core.response import Response

route = APIRouter(
    prefix="/users",
    tags=["User"]
)

@route.get("/{user_id}/profile", response_model=Response[Profile])
async def get_profile_by_user_id(user_id: PydanticObjectId):
    profile = await Profile.find_one(Profile.user.id == user_id, fetch_links=False)

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found"
        )

    return Response(data=profile)