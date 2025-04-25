from pydantic import BaseModel
from model import User

class LoginResponse(BaseModel):
    access_token: str
    user: User