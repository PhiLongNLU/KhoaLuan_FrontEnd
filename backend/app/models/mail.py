from pydantic import BaseModel, EmailStr
from typing import List, Optional

class EmailSchema(BaseModel):
    recipients: List[EmailStr]
    subject: str
    body: str
    html: Optional[str] = None