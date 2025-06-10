from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.otp import router as otp_router
from app.routes.auth import router as auth_router
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
app.include_router(otp_router)
app.include_router(auth_router)

@app.get("/")
async def root():
    return {"message": "VoiceInvoice API is running!", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "voiceinvoice-api"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
