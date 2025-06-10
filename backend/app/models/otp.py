from pydantic import BaseModel, EmailStr
from typing import Literal
from datetime import datetime

class OTPRequest(BaseModel):
    email: EmailStr
    purpose: Literal["login", "signup"]

class OTPVerification(BaseModel):
    email: EmailStr
    otp_code: str
    purpose: Literal["login", "signup"]

class OTPCode(BaseModel):
    email: EmailStr
    otp_code: str
    purpose: str
    expires_at: datetime
    attempts: int = 0
    max_attempts: int = 3
    is_used: bool = False
    created_at: datetime

class OTPResponse(BaseModel):
    success: bool
    message: str
    email: str
