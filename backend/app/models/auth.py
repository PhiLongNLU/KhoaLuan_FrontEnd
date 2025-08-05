from pydantic import BaseModel, EmailStr, field_validator

class ForgotPasswordSchema(BaseModel):
    email: EmailStr

class ResetPasswordSchema(BaseModel):
    token: str
    password: str

    @field_validator('password')
    @classmethod
    def password_length(cls, v: str) -> str:
        if len(v) <= 6:
            raise ValueError('Password must be longer than 6 characters')
        return v