import os

import httpx
from fastapi import FastAPI, Request, Depends
from starlette.responses import RedirectResponse

from db import db
from model import Token
from utils import create_access_token
app = FastAPI()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")

# 1. Redirect to Google login
@app.get("/auth/google")
async def login_via_google():
    google_auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth"
        f"?client_id={GOOGLE_CLIENT_ID}"
        f"&response_type=code"
        f"&scope=openid%20email%20profile"
        f"&redirect_uri={GOOGLE_REDIRECT_URI}"
        f"&access_type=offline"
    )
    return RedirectResponse(url=google_auth_url)


# 2. Google callback: get token, user info, generate JWT
@app.get("/auth/google/callback", response_model=Token)
async def google_callback(request: Request):
    code = request.query_params.get("code")
    if not code:
        return {"error": "No code provided"}

    # 3. Exchange code -> token
    token_url = "https://oauth2.googleapis.com/token"
    async with httpx.AsyncClient() as client:
        token_resp = await client.post(token_url, data={
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": GOOGLE_REDIRECT_URI,
        })
        token_data = token_resp.json()
        access_token = token_data.get("access_token")

        # 4. Get user info from Google
        userinfo_resp = await client.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        user_info = userinfo_resp.json()
        email = user_info["email"]

        # 5. Save user to MongoDB if not exists
        user = await db.users.find_one({"email": email})
        if not user:
            result = await db.users.insert_one({"email": email, "oauth_provider": "google"})
            user_id = str(result.inserted_id)
        else:
            user_id = str(user["_id"])

        # 6. Issue JWT token
        jwt_token = create_access_token(data={"sub": email})
        return {"access_token": jwt_token}