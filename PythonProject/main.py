from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.security import HTTPBearer
from fastapi.middleware.cors import CORSMiddleware
import httpx
import redis

import const

app = FastAPI()
security = HTTPBearer()


#configuration
AUTH_SERVICE_URL = const.AUTH_SERVICE_URL
REDIS_HOST = const.REDIS_HOST

SERVICES_ROUTER= {
    "service-name" : "domain-name"
}

#redis for token caching
redis_client = redis.Redis(host=REDIS_HOST, port=6379, db=0)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


async def validate_token(token: str) -> dict:
    """Check with auth service + cache valid tokens"""
    # Check cache first
    cached = redis_client.get(f"token:{token}")
    if cached:
        return {"valid": True}
    else :
        return {"valid": False}

@app.post("/auth/google")
async def google_auth(request: Request):
    # Forward login request to actual backend
    async with httpx.AsyncClient() as client:
        body = await request.json()
        response = await client.post("http://localhost:8000/auth/api/google", json=body)
    return response.json()

@app.api_route("/{service}/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def gateway_proxy(
        service: str,
        path: str,
        request: Request,
        token: str
):
    # Validate token
    auth = await validate_token(token)
    if not auth["valid"]:
        raise HTTPException(status_code=401, detail=auth.get("detail", "Unauthorized"))

    # Route to target service
    if service not in SERVICES_ROUTER:
        raise HTTPException(status_code=404, detail="Service not found")

    # Forward request
    async with httpx.AsyncClient() as client:
        response = await client.request(
            request.method,
            f"{SERVICES_ROUTER[service]}/{path}",
            headers={"X-User-Email": auth["user"]["email"]},
            content=await request.body(),
            timeout=30.0
        )

        return response.json()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=8001)