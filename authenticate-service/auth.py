from datetime import datetime, timedelta, timezone
import os

from dotenv import load_dotenv
from passlib.context import CryptContext
import jwt

from model import User

load_dotenv()

API_SECRET_KEY = os.getenv('API_SECRET_KEY')
ALGORITHM = os.getenv('ALGORITHM')
# For encode and decode the
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Create access token
def create_access_token(user: User):
    to_encode = user.__dict__.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=365)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, API_SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
