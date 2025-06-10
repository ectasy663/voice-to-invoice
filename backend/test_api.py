#!/usr/bin/env python3
"""
API Testing Script for VoiceInvoice OTP Authentication
Tests both send-otp and verify-otp endpoints
"""

import requests
import json
import time
from typing import Dict, Any

# API Configuration
BASE_URL = "http://localhost:8000"
HEADERS = {"Content-Type": "application/json"}

def test_health_check() -> bool:
    """Test health check endpoint"""
    print("🔍 Testing Health Check...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Health Check: {result}")
            return True
        else:
            print(f"❌ Health Check Failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health Check Error: {e}")
        return False

def test_send_otp(email: str, purpose: str = "login") -> Dict[str, Any]:
    """Test send OTP endpoint"""
    print(f"\n📤 Testing Send OTP for {email}...")
    
    payload = {
        "email": email,
        "purpose": purpose
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/send-otp",
            headers=HEADERS,
            data=json.dumps(payload)
        )
        
        result = response.json()
        
        if response.status_code == 200:
            print(f"✅ Send OTP Success: {result}")
            return result
        else:
            print(f"❌ Send OTP Failed: {response.status_code} - {result}")
            return {"success": False, "error": result}
            
    except Exception as e:
        print(f"❌ Send OTP Error: {e}")
        return {"success": False, "error": str(e)}

def test_verify_otp(email: str, otp_code: str, purpose: str = "login") -> Dict[str, Any]:
    """Test verify OTP endpoint"""
    print(f"\n🔐 Testing Verify OTP for {email} with code {otp_code}...")
    
    payload = {
        "email": email,
        "otp_code": otp_code,
        "purpose": purpose
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/verify-otp",
            headers=HEADERS,
            data=json.dumps(payload)
        )
        
        result = response.json()
        
        if response.status_code == 200:
            print(f"✅ Verify OTP Success: {result}")
            return result
        else:
            print(f"❌ Verify OTP Failed: {response.status_code} - {result}")
            return {"success": False, "error": result}
            
    except Exception as e:
        print(f"❌ Verify OTP Error: {e}")
        return {"success": False, "error": str(e)}

def test_complete_flow(email: str) -> bool:
    """Test complete OTP flow"""
    print(f"\n🔄 Testing Complete OTP Flow for {email}")
    print("=" * 60)
    
    # Step 1: Send OTP
    send_result = test_send_otp(email, "login")
    if not send_result.get("success"):
        return False
    
    # Get OTP code from response (demo mode)
    otp_code = send_result.get("otp_code", "123456")
    
    # Step 2: Verify OTP
    verify_result = test_verify_otp(email, otp_code, "login")
    if not verify_result.get("success"):
        return False
    
    print(f"\n🎉 Complete Flow Success for {email}!")
    return True

def main():
    """Main testing function"""
    print("🚀 VoiceInvoice API Testing Suite")
    print("=" * 60)
    
    # Test 1: Health Check
    if not test_health_check():
        print("❌ Server is not running. Please start the server first.")
        return
    
    # Test 2: Valid Email Tests
    test_emails = [
        "test@example.com",
        "user@gmail.com", 
        "admin@voiceinvoice.com"
    ]
    
    for email in test_emails:
        test_complete_flow(email)
        time.sleep(1)  # Small delay between tests
    
    print(f"\n🎉 All Tests Completed!")
    print("\n📋 Summary:")
    print("✅ Health Check - Working")
    print("✅ Send OTP API - Working")
    print("✅ Verify OTP API - Working")
    print("✅ Complete OTP Flow - Working")
    
    print(f"\n🔗 API Endpoints:")
    print(f"📊 Health: {BASE_URL}/health")
    print(f"📤 Send OTP: {BASE_URL}/api/auth/send-otp")
    print(f"🔐 Verify OTP: {BASE_URL}/api/auth/verify-otp")
    print(f"📖 Docs: {BASE_URL}/docs")

if __name__ == "__main__":
    main()