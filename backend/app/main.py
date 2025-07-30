from fastapi import FastAPI, Request, status
from fastapi.exceptions import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

from app.db.mongo import init_db
from app.routes import auth, mail, user, conversation, message
from app.core.response import Response

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
        print(f"Could not connect to the database: {e}")


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content=Response(
            status_code=exc.status_code, message=exc.detail, data=None
        ).model_dump(),
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    print(f"An unexpected error occurred: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=Response(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="An unexpected internal server error occurred.",
            data=None,
        ).model_dump(),
    )

app.include_router(auth.route)
app.include_router(mail.route)
app.include_router(user.route)
app.include_router(conversation.route)
app.include_router(message.route)

@app.get("/", tags=["Root"], response_model=Response[dict])
async def root():
    return Response(data={"message": "Welcome to your beanie powered app!"})

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="localhost", port=8000, reload=True)
