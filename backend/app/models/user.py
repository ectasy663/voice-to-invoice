from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    email: EmailStr
    is_verified: bool = False
    created_at: datetime
    updated_at: datetime

class UserResponse(BaseModel):
    email: EmailStr
    is_verified: bool
    created_at: datetime
