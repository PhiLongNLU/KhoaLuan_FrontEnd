from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from app.db.mongo import init_db
from app.routes import auth

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def start_db():
    try:
        await init_db()
    except Exception as e:
        print(e)

app.include_router(auth.route)

@app.get("/", tags=["Root"])
async def root():
    return {"message": "Welcome to your beanie powered app!"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="localhost", port=8000, reload=True)
