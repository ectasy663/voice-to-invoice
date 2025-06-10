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
        print(f"OTP created for {email}: {otp_code}")
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
        
        print(f"OTP verified successfully for {email}")
        return {"success": True, "message": "OTP verified successfully"}
    
    async def cleanup_expired_otps(self):
        """Remove expired OTPs"""
        result = self.otp_collection.delete_many({
            "expires_at": {"$lt": datetime.utcnow()}
        })
        if result.deleted_count > 0:
            print(f"Cleaned up {result.deleted_count} expired OTPs")
