from fastapi import FastAPI, Request, HTTPException
import httpx

import auth
import db
from auth import create_access_token

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/api/auth/{id}")
async def delete_user():
    return {"message": "Hello World"}


@app.post("/api/auth/google")
async def google_auth(request: Request):
    auth_header = request.headers.get("authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")

    access_token = auth_header.split(" ")[1]

    # Call Google API
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"}
        )

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch user info")

    user_data = response.json()
    user = await db.get_user(user_data["id"])

    if not user:
        user = {
            "google_id": user_data["id"],
            "email": user_data.get("email"),
            "name": user_data.get("name"),
            "picture": user_data.get("picture")
        }
        await db.insert_user(user)

    return auth.create_access_token(user)
