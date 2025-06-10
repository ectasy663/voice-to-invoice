# 🚀 Backend Setup Guide: MongoDB + FastAPI + Email OTP

## 🎯 Goal

Create a secure backend system for OTP authentication with MongoDB database and FastAPI REST APIs.

## 📊 System Architecture

```
React Frontend → FastAPI Backend → MongoDB Database
                       ↓
                 Email Service (SMTP)
```

## 🗄️ Phase 1: MongoDB Database Setup

### Option A: MongoDB Atlas (Cloud - Recommended)

1. **Create MongoDB Atlas Account**

   ```
   1. Go to https://www.mongodb.com/atlas
   2. Sign up for free account
   3. Create new cluster (M0 Free tier)
   4. Create database user with password
   5. Add IP address to allowlist (0.0.0.0/0 for development)
   6. Get connection string
   ```

2. **Database Structure**

   ```javascript
   // Database: voiceinvoice_db

   // Collection: users
   {
     _id: ObjectId,
     email: "user@example.com",
     password_hash: "hashed_password",
     is_verified: false,
     created_at: ISODate,
     updated_at: ISODate
   }

   // Collection: otp_codes
   {
     _id: ObjectId,
     email: "user@example.com",
     otp_code: "123456",
     purpose: "login" | "signup",
     expires_at: ISODate,
     attempts: 0,
     max_attempts: 3,
     is_used: false,
     created_at: ISODate
   }

   // Collection: sessions
   {
     _id: ObjectId,
     user_id: ObjectId,
     session_token: "jwt_token",
     expires_at: ISODate,
     created_at: ISODate
   }
   ```

### Option B: Local MongoDB Installation

1. **Install MongoDB Community**
   ```bash
   # Download from https://www.mongodb.com/try/download/community
   # Install MongoDB Compass (GUI tool)
   # Start MongoDB service
   ```

## 🐍 Phase 2: FastAPI Backend Setup

### 1. Create Backend Directory

```bash
# In your project root
mkdir backend
cd backend
```

### 2. Python Environment Setup

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Upgrade pip
python -m pip install --upgrade pip
```

### 3. Install Dependencies

```bash
pip install fastapi uvicorn pymongo python-dotenv bcrypt pyjwt python-multipart email-validator smtplib-ssl python-jose[cryptography]
```

### 4. Create requirements.txt

```txt
fastapi==0.104.1
uvicorn==0.24.0
pymongo==4.6.0
python-dotenv==1.0.0
bcrypt==4.1.2
PyJWT==2.8.0
python-multipart==0.0.6
email-validator==2.1.0
python-jose[cryptography]==3.3.0
```

### 5. Environment Configuration

```env
# backend/.env
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/voiceinvoice_db
SECRET_KEY=your-super-secret-jwt-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Email Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@voiceinvoice.com
FROM_NAME=VoiceInvoice Team

# CORS
FRONTEND_URL=http://localhost:5173
```

## 🔧 Phase 3: FastAPI Implementation

### 1. Database Connection (`app/database/connection.py`)

```python
from pymongo import MongoClient
from pymongo.database import Database
import os
from dotenv import load_dotenv

load_dotenv()

class DatabaseManager:
    _instance = None
    _client = None
    _database = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DatabaseManager, cls).__new__(cls)
        return cls._instance

    def connect(self):
        if self._client is None:
            mongodb_url = os.getenv("MONGODB_URL")
            self._client = MongoClient(mongodb_url)
            self._database = self._client.voiceinvoice_db
        return self._database

    def close(self):
        if self._client:
            self._client.close()

# Global database instance
db_manager = DatabaseManager()
database = db_manager.connect()
```

### 2. Data Models (`app/models/`)

```python
# app/models/user.py
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

# app/models/otp.py
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
```

### 3. Services (`app/services/`)

```python
# app/services/email_service.py
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from typing import Optional

class EmailService:
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER")
        self.smtp_port = int(os.getenv("SMTP_PORT", 587))
        self.username = os.getenv("SMTP_USERNAME")
        self.password = os.getenv("SMTP_PASSWORD")
        self.from_email = os.getenv("FROM_EMAIL")
        self.from_name = os.getenv("FROM_NAME")

    def send_otp_email(self, to_email: str, otp_code: str, purpose: str) -> bool:
        try:
            # Create email content
            subject = f"Your VoiceInvoice Verification Code - {otp_code}"
            html_content = self._generate_otp_email_html(otp_code, purpose)

            # Create message
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = f"{self.from_name} <{self.from_email}>"
            message["To"] = to_email

            # Add HTML content
            html_part = MIMEText(html_content, "html")
            message.attach(html_part)

            # Send email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.username, self.password)
                server.send_message(message)

            return True
        except Exception as e:
            print(f"Email sending failed: {str(e)}")
            return False

    def _generate_otp_email_html(self, otp_code: str, purpose: str) -> str:
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>VoiceInvoice Verification Code</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px;">🎙️ VoiceInvoice</h1>
                    <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0;">Voice to Invoice Conversion</p>
                </div>

                <div style="padding: 40px 20px;">
                    <h2 style="color: #1f2937; margin: 0 0 20px 0;">Verification Code</h2>
                    <p style="color: #6b7280; margin: 0 0 30px 0;">
                        Your verification code to {purpose} VoiceInvoice is:
                    </p>

                    <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                        <div style="font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px;">
                            {otp_code}
                        </div>
                    </div>

                    <p style="color: #ef4444; margin: 20px 0; font-size: 14px;">
                        ⚠️ This code will expire in 5 minutes for security.
                    </p>

                    <p style="color: #6b7280; margin: 20px 0; font-size: 14px;">
                        If you didn't request this code, please ignore this email.
                    </p>
                </div>

                <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                        © 2025 VoiceInvoice. All rights reserved.
                    </p>
                </div>
            </div>
        </body>
        </html>
        """

# app/services/otp_service.py
import secrets
import string
from datetime import datetime, timedelta
from typing import Optional
from app.database.connection import database

class OTPService:
    def __init__(self):
        self.otp_collection = database.otp_codes
        self.expiry_minutes = 5
        self.max_attempts = 3

    def generate_otp(self) -> str:
        """Generate 6-digit OTP"""
        return ''.join(secrets.choice(string.digits) for _ in range(6))

    async def create_otp(self, email: str, purpose: str) -> str:
        """Create and store OTP for email"""
        # Clean up any existing OTPs for this email/purpose
        await self.cleanup_expired_otps()
        self.otp_collection.delete_many({
            "email": email,
            "purpose": purpose,
            "is_used": False
        })

        # Generate new OTP
        otp_code = self.generate_otp()
        expires_at = datetime.utcnow() + timedelta(minutes=self.expiry_minutes)

        otp_data = {
            "email": email,
            "otp_code": otp_code,
            "purpose": purpose,
            "expires_at": expires_at,
            "attempts": 0,
            "max_attempts": self.max_attempts,
            "is_used": False,
            "created_at": datetime.utcnow()
        }

        self.otp_collection.insert_one(otp_data)
        return otp_code

    async def verify_otp(self, email: str, otp_code: str, purpose: str) -> dict:
        """Verify OTP and return result"""
        otp_record = self.otp_collection.find_one({
            "email": email,
            "purpose": purpose,
            "is_used": False
        })

        if not otp_record:
            return {"success": False, "message": "No valid OTP found"}

        # Check expiration
        if datetime.utcnow() > otp_record["expires_at"]:
            self.otp_collection.delete_one({"_id": otp_record["_id"]})
            return {"success": False, "message": "OTP expired"}

        # Check attempts
        if otp_record["attempts"] >= otp_record["max_attempts"]:
            self.otp_collection.delete_one({"_id": otp_record["_id"]})
            return {"success": False, "message": "Too many attempts"}

        # Increment attempts
        self.otp_collection.update_one(
            {"_id": otp_record["_id"]},
            {"$inc": {"attempts": 1}}
        )

        # Check OTP code
        if otp_record["otp_code"] != otp_code:
            return {"success": False, "message": "Invalid OTP code"}

        # Mark as used
        self.otp_collection.update_one(
            {"_id": otp_record["_id"]},
            {"$set": {"is_used": True}}
        )

        return {"success": True, "message": "OTP verified successfully"}

    async def cleanup_expired_otps(self):
        """Remove expired OTPs"""
        self.otp_collection.delete_many({
            "expires_at": {"$lt": datetime.utcnow()}
        })
```

### 4. API Routes (`app/routes/`)

```python
# app/routes/otp.py
from fastapi import APIRouter, HTTPException
from app.models.otp import OTPRequest, OTPVerification
from app.services.otp_service import OTPService
from app.services.email_service import EmailService

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
otp_service = OTPService()
email_service = EmailService()

@router.post("/send-otp")
async def send_otp(request: OTPRequest):
    """Send OTP to email address"""
    try:
        # Generate OTP
        otp_code = await otp_service.create_otp(request.email, request.purpose)

        # Send email
        email_sent = email_service.send_otp_email(
            to_email=request.email,
            otp_code=otp_code,
            purpose=request.purpose
        )

        if not email_sent:
            raise HTTPException(status_code=500, detail="Failed to send email")

        return {
            "success": True,
            "message": "OTP sent successfully",
            "email": request.email
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify-otp")
async def verify_otp(request: OTPVerification):
    """Verify OTP code"""
    try:
        result = await otp_service.verify_otp(
            email=request.email,
            otp_code=request.otp_code,
            purpose=request.purpose
        )

        if not result["success"]:
            raise HTTPException(status_code=400, detail=result["message"])

        return {
            "success": True,
            "message": result["message"],
            "email": request.email
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### 5. Main Application (`app/main.py`)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import otp
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="VoiceInvoice API",
    description="Backend API for VoiceInvoice OTP Authentication",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(otp.router)

@app.get("/")
async def root():
    return {"message": "VoiceInvoice API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "voiceinvoice-api"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## 🚀 Phase 4: Running the Backend

### 1. Start FastAPI Server

```bash
# In backend directory with virtual environment activated
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Test API Endpoints

```bash
# Test health check
curl http://localhost:8000/health

# Test send OTP
curl -X POST "http://localhost:8000/api/auth/send-otp" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "purpose": "login"}'

# Test verify OTP
curl -X POST "http://localhost:8000/api/auth/verify-otp" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "otp_code": "123456", "purpose": "login"}'
```

## 🔧 Phase 5: Frontend Integration

### 1. Update React Frontend

```typescript
// src/utils/apiService.ts
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const sendOTP = async (email: string, purpose: "login" | "signup") => {
  const response = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, purpose }),
  });

  if (!response.ok) {
    throw new Error("Failed to send OTP");
  }

  return response.json();
};

export const verifyOTP = async (
  email: string,
  otp_code: string,
  purpose: "login" | "signup"
) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp_code, purpose }),
  });

  if (!response.ok) {
    throw new Error("Invalid OTP");
  }

  return response.json();
};
```

### 2. Update Environment Variables

```env
# frontend/.env
VITE_API_BASE_URL=http://localhost:8000
VITE_SIMULATE_EMAIL=false
```

## 📊 Next Steps

1. **Database Setup**: Choose MongoDB Atlas or local MongoDB
2. **Backend Implementation**: Create FastAPI project structure
3. **Email Configuration**: Set up SMTP credentials
4. **Frontend Updates**: Replace EmailJS with API calls
5. **Testing**: Test complete flow
6. **Deployment**: Deploy to production servers

## 🛡️ Security Considerations

- ✅ JWT tokens for session management
- ✅ Password hashing with bcrypt
- ✅ Rate limiting for API endpoints
- ✅ CORS configuration
- ✅ Environment variable security
- ✅ OTP expiration and attempt limits

Would you like me to help you implement any specific phase? Let me know which step you'd like to start with!
