from datetime import datetime, timedelta

import httpx
import jwt
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from const import SECRET_KEY, ALGORITHM, CLIENT_ID
from model import TokenData
from google.oauth2 import id_token
from google.auth.transport import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/auth/api")
async def root():
    return {"message": "Hello World"}

@app.post("/google")
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


async def validate_google_token(token: str) -> dict:
    """Core validation function reusable across endpoints"""
    try:
        id_infor = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            CLIENT_ID
        )

        # Verify the token was issued by Google
        if id_infor['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError("Wrong issuer")

        return {
            "valid": True,
            "user_info": {
                "email": id_infor['email'],
                "name": id_infor.get('name'),
                "picture": id_infor.get('picture'),
                "email_verified": id_infor.get('email_verified', False)
            }
        }
    except ValueError as e:
        return {
            "valid": False,
            "error": str(e)
        }




