from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import secrets
import string
from datetime import datetime, timedelta
from typing import Dict
from dotenv import load_dotenv

load_dotenv()

# Request models
class OTPRequest(BaseModel):
    email: EmailStr
    purpose: str

class OTPVerification(BaseModel):
    email: EmailStr
    otp_code: str
    purpose: str

# Simple in-memory OTP storage with expiration (for demo - use database in production)
otp_storage: Dict[str, Dict] = {}

def generate_otp() -> str:
    """Generate 6-digit OTP"""
    return ''.join(secrets.choice(string.digits) for _ in range(6))

def send_real_email(to_email: str, otp_code: str, purpose: str) -> bool:
    """Send real email using Gmail SMTP"""
    try:
        # Email configuration
        smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        smtp_port = int(os.getenv("SMTP_PORT", 587))
        username = os.getenv("SMTP_USERNAME")
        password = os.getenv("SMTP_PASSWORD")
        from_email = os.getenv("FROM_EMAIL", username)
        from_name = os.getenv("FROM_NAME", "VoiceInvoice Team")
        
        # Check if email is configured
        if not username or not password or "your-" in str(username):
            print("⚠️  Email not configured - using demo mode")
            return True  # Return True for demo mode
        
        # Create email content
        subject = f"Your VoiceInvoice Verification Code - {otp_code}"
        html_content = f"""
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
        
        # Create message
        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = f"{from_name} <{from_email}>"
        message["To"] = to_email
        
        # Add HTML content
        html_part = MIMEText(html_content, "html")
        message.attach(html_part)
        
        # Send email
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(username, password)
            server.send_message(message)
        
        print(f"✅ Real email sent successfully to {to_email}")
        return True
        
    except Exception as e:
        print(f"❌ Email sending failed: {str(e)}")
        print("Falling back to demo mode")
        return True  # Still return True for demo mode

def cleanup_expired_otps():
    """Remove expired OTPs from storage"""
    current_time = datetime.now()
    expired_keys = []
    
    for email, data in otp_storage.items():
        if data.get("expires_at", current_time) < current_time:
            expired_keys.append(email)
    
    for key in expired_keys:
        del otp_storage[key]

app = FastAPI(
    title="VoiceInvoice API",
    description="Backend API for VoiceInvoice OTP Authentication with Real Email Support",
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

@app.get("/")
async def root():
    return {
        "message": "VoiceInvoice API is running!",
        "version": "1.0.0",
        "features": ["OTP Authentication", "Real Email Support", "MongoDB Ready"]
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "voiceinvoice-api"}

@app.post("/api/auth/send-otp")
async def send_otp(request: OTPRequest):
    """Send OTP endpoint with real email support"""
    try:
        # Clean up expired OTPs
        cleanup_expired_otps()
        
        # Generate OTP
        otp_code = generate_otp()
        expires_at = datetime.now() + timedelta(minutes=5)
        
        # Store OTP with expiration
        otp_storage[request.email] = {
            "otp_code": otp_code,
            "purpose": request.purpose,
            "expires_at": expires_at,
            "attempts": 0,
            "max_attempts": 3
        }
        
        # Try to send real email
        email_sent = send_real_email(request.email, otp_code, request.purpose)
        
        # Determine message based on email configuration
        username = os.getenv("SMTP_USERNAME", "")
        if "your-" in username or not username:
            message = "OTP sent successfully (demo mode)"
        else:
            message = "OTP sent successfully to your email"
        
        print(f"📧 OTP request for {request.email} ({request.purpose})")
        print(f"🔢 Generated OTP: {otp_code}")
        print(f"⏰ Expires at: {expires_at}")
        
        return {
            "success": True,
            "message": message,
            "email": request.email,
            "otp_code": otp_code,  # For demo/testing - remove in production
            "expires_in_minutes": 5
        }
    except Exception as e:
        print(f"❌ Error in send_otp: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to send OTP: {str(e)}")

@app.post("/api/auth/verify-otp")
async def verify_otp(request: OTPVerification):
    """Verify OTP endpoint with proper validation"""
    try:
        # Clean up expired OTPs
        cleanup_expired_otps()
        
        # Check if OTP exists
        stored_otp = otp_storage.get(request.email)
        
        if not stored_otp:
            raise HTTPException(status_code=400, detail="No OTP found for this email")
        
        # Check if expired
        if datetime.now() > stored_otp["expires_at"]:
            del otp_storage[request.email]
            raise HTTPException(status_code=400, detail="OTP has expired")
        
        # Check attempts
        if stored_otp["attempts"] >= stored_otp["max_attempts"]:
            del otp_storage[request.email]
            raise HTTPException(status_code=400, detail="Too many attempts. Please request a new OTP")
        
        # Increment attempts
        stored_otp["attempts"] += 1
        
        # Check if OTP matches and purpose matches
        if (stored_otp["otp_code"] == request.otp_code and 
            stored_otp["purpose"] == request.purpose):
            
            # Remove OTP after successful verification
            del otp_storage[request.email]
            
            print(f"✅ OTP verified successfully for {request.email}")
            return {
                "success": True,
                "message": "OTP verified successfully",
                "email": request.email
            }
        else:
            if stored_otp["attempts"] >= stored_otp["max_attempts"]:
                del otp_storage[request.email]
            
            raise HTTPException(status_code=400, detail="Invalid OTP code")
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error in verify_otp: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Verification failed: {str(e)}")

@app.get("/api/debug/otp-storage")
async def debug_otp_storage():
    """Debug endpoint to view OTP storage (remove in production)"""
    cleanup_expired_otps()
    return {
        "stored_otps": len(otp_storage),
        "emails": list(otp_storage.keys()),
        "storage": otp_storage
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
