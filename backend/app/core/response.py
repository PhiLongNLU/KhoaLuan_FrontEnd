from pydantic import BaseModel, Field
from typing import Generic, TypeVar, Optional

T = TypeVar("T")

class Response(BaseModel, Generic[T]):
    status_code: int = Field(200, description="HTTP status code")
    message: str = Field("Success", description="Response message")
    data: Optional[T] = None