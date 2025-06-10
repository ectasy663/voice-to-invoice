import bcrypt
from datetime import datetime, timedelta
from typing import Optional
from app.database.connection import database
from app.models.user import UserCreate, UserLogin, User

class UserService:
    def __init__(self):
        self.users_collection = database.users
    
    def hash_password(self, password: str) -> str:
        """Hash password using bcrypt"""
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def verify_password(self, password: str, hashed_password: str) -> bool:
        """Verify password against hash"""
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
    
    async def create_user(self, user_data: UserCreate) -> dict:
        """Create new user"""
        # Check if user already exists
        existing_user = self.users_collection.find_one({"email": user_data.email})
        if existing_user:
            return {"success": False, "message": "User already exists"}
        
        # Hash password
        hashed_password = self.hash_password(user_data.password)
        
        # Create user document
        user_doc = {
            "email": user_data.email,
            "password_hash": hashed_password,
            "is_verified": False,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Insert user
        result = self.users_collection.insert_one(user_doc)
        
        if result.inserted_id:
            print(f"User created: {user_data.email}")
            return {"success": True, "message": "User created successfully", "user_id": str(result.inserted_id)}
        else:
            return {"success": False, "message": "Failed to create user"}
    
    async def authenticate_user(self, user_data: UserLogin) -> dict:
        """Authenticate user credentials"""
        # Find user
        user = self.users_collection.find_one({"email": user_data.email})
        if not user:
            return {"success": False, "message": "User not found"}
        
        # Verify password
        if not self.verify_password(user_data.password, user["password_hash"]):
            return {"success": False, "message": "Invalid password"}
        
        print(f"User authenticated: {user_data.email}")
        return {
            "success": True, 
            "message": "Authentication successful",
            "user": {
                "email": user["email"],
                "is_verified": user["is_verified"],
                "created_at": user["created_at"]
            }
        }
    
    async def verify_user(self, email: str) -> dict:
        """Mark user as verified"""
        result = self.users_collection.update_one(
            {"email": email},
            {"$set": {"is_verified": True, "updated_at": datetime.utcnow()}}
        )
        
        if result.modified_count > 0:
            print(f"User verified: {email}")
            return {"success": True, "message": "User verified successfully"}
        else:
            return {"success": False, "message": "User not found"}
    
    async def get_user(self, email: str) -> Optional[dict]:
        """Get user by email"""
        user = self.users_collection.find_one({"email": email})
        if user:
            # Remove sensitive data
            user.pop("password_hash", None)
            user["_id"] = str(user["_id"])
        return user
