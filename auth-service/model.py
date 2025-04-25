from pydantic import BaseModel, EmailStr


class User(BaseModel):
    username: str
    email: str
    picture: str

class TokenData(BaseModel):
    token: str