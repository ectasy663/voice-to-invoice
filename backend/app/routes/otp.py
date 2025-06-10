from fastapi import APIRouter, HTTPException
from app.models.otp import OTPRequest, OTPVerification, OTPResponse
from app.services.otp_service import OTPService
from app.services.email_service import EmailService

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
otp_service = OTPService()
email_service = EmailService()

@router.post("/send-otp", response_model=OTPResponse)
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
        
        return OTPResponse(
            success=True,
            message="OTP sent successfully",
            email=request.email
        )
    except Exception as e:
        print(f"Error in send_otp: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify-otp", response_model=OTPResponse)
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
        
        return OTPResponse(
            success=True,
            message=result["message"],
            email=request.email
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in verify_otp: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
