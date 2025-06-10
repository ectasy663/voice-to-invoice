from fastapi import APIRouter, HTTPException
from app.models.user import UserCreate, UserLogin, UserResponse
from app.services.user_service import UserService
from app.services.otp_service import OTPService

router = APIRouter(prefix="/api/users", tags=["Users"])
user_service = UserService()
otp_service = OTPService()

@router.post("/register")
async def register_user(user_data: UserCreate):
    """Register a new user"""
    try:
        result = await user_service.create_user(user_data)
        
        if not result["success"]:
            raise HTTPException(status_code=400, detail=result["message"])
        
        return {
            "success": True,
            "message": result["message"],
            "user_id": result["user_id"]
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in register_user: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login")
async def login_user(user_data: UserLogin):
    """Authenticate user login"""
    try:
        result = await user_service.authenticate_user(user_data)
        
        if not result["success"]:
            raise HTTPException(status_code=401, detail=result["message"])
        
        return {
            "success": True,
            "message": result["message"],
            "user": result["user"]
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in login_user: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify/{email}")
async def verify_user_email(email: str):
    """Mark user email as verified"""
    try:
        result = await user_service.verify_user(email)
        
        if not result["success"]:
            raise HTTPException(status_code=404, detail=result["message"])
        
        return {
            "success": True,
            "message": result["message"]
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in verify_user_email: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{email}", response_model=UserResponse)
async def get_user(email: str):
    """Get user information"""
    try:
        user = await user_service.get_user(email)
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return UserResponse(
            email=user["email"],
            is_verified=user["is_verified"],
            created_at=user["created_at"]
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in get_user: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
