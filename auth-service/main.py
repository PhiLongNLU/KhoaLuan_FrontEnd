from datetime import datetime, timedelta

import httpx
import jwt
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from const import SECRET_KEY, ALGORITHM
from model import TokenData

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}


@app.post("/auth/api/google")
async def google(request : TokenData):
    print(request)
    access_token = request.token

    if not access_token:
        raise HTTPException(status_code=400, detail="Missing access token")

    user_info = await get_google_user_info(access_token)
    await generating_token(user_info)

    login_res = {
        "user" : user_info,
        "token" : access_token,
    }

    return login_res

async def generating_token(data : dict):
    to_encode = data.copy()
    expire = datetime.now() + timedelta(days=365)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, ALGORITHM)
    return encoded_jwt


async def get_google_user_info(access_token: str):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=400, detail="Invalid Google token")
