#!/usr/bin/env python3
"""
Email Service Testing Script
Tests Gmail SMTP configuration and email sending functionality
"""

import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_smtp_connection():
    """Test SMTP connection to Gmail"""
    print("🔍 Testing SMTP Connection...")
    
    smtp_server = os.getenv("SMTP_SERVER")
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    username = os.getenv("SMTP_USERNAME")
    password = os.getenv("SMTP_PASSWORD")
    
    print(f"📊 Configuration:")
    print(f"   SMTP Server: {smtp_server}")
    print(f"   SMTP Port: {smtp_port}")
    print(f"   Username: {username}")
    print(f"   Password: {'*' * 8 if password else 'NOT SET'}")
    
    if not all([smtp_server, username, password]):
        print("❌ Missing email configuration in .env file")
        print("\n💡 Required variables:")
        print("   SMTP_SERVER=smtp.gmail.com")
        print("   SMTP_PORT=587")
        print("   SMTP_USERNAME=your-email@gmail.com")
        print("   SMTP_PASSWORD=your-app-password")
        return False
    
    try:
        # Test connection
        print(f"\n🔗 Connecting to {smtp_server}:{smtp_port}...")
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        
        print("🔐 Attempting login...")
        server.login(username, password)
        
        print("✅ SMTP Connection Successful!")
        server.quit()
        return True
        
    except smtplib.SMTPAuthenticationError:
        print("❌ Authentication Failed!")
        print("\n💡 Possible solutions:")
        print("   1. Enable 2-Factor Authentication on Gmail")
        print("   2. Generate App Password: https://myaccount.google.com/security")
        print("   3. Check SMTP_USERNAME and SMTP_PASSWORD in .env")
        print("   4. Ensure no spaces in app password")
        return False
        
    except smtplib.SMTPConnectError:
        print("❌ Connection Failed!")
        print("\n💡 Possible solutions:")
        print("   1. Check internet connection")
        print("   2. Verify SMTP_SERVER=smtp.gmail.com")
        print("   3. Verify SMTP_PORT=587")
        return False
        
    except Exception as e:
        print(f"❌ Unexpected Error: {e}")
        return False

def send_test_email(to_email: str):
    """Send a test email"""
    print(f"\n📧 Sending test email to {to_email}...")
    
    smtp_server = os.getenv("SMTP_SERVER")
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    username = os.getenv("SMTP_USERNAME")
    password = os.getenv("SMTP_PASSWORD")
    from_email = os.getenv("FROM_EMAIL", username)
    from_name = os.getenv("FROM_NAME", "VoiceInvoice Team")
    
    try:
        # Create test email
        subject = "✅ VoiceInvoice Email Test - Configuration Working!"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>VoiceInvoice Email Test</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px;">🎙️ VoiceInvoice</h1>
                    <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0;">Email Configuration Test</p>
                </div>
                
                <div style="padding: 40px 20px;">
                    <h2 style="color: #1f2937; margin: 0 0 20px 0;">🎉 Email Service Working!</h2>
                    <p style="color: #6b7280; margin: 0 0 30px 0;">
                        Congratulations! Your VoiceInvoice email service is properly configured and working.
                    </p>
                    
                    <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin: 30px 0;">
                        <h3 style="color: #1f2937; margin: 0 0 15px 0;">✅ What's Working:</h3>
                        <ul style="color: #6b7280; margin: 0; padding-left: 20px;">
                            <li>SMTP Connection to Gmail</li>
                            <li>Email Authentication</li>
                            <li>HTML Email Sending</li>
                            <li>Beautiful Email Templates</li>
                        </ul>
                    </div>
                    
                    <p style="color: #059669; margin: 20px 0; font-size: 16px; font-weight: bold;">
                        🚀 Ready for OTP Authentication!
                    </p>
                    
                    <p style="color: #6b7280; margin: 20px 0; font-size: 14px;">
                        Your VoiceInvoice app can now send real OTP codes via email.
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
        
        print(f"✅ Test email sent successfully to {to_email}!")
        print(f"📬 Check your inbox at {to_email}")
        return True
        
    except Exception as e:
        print(f"❌ Failed to send test email: {e}")
        return False

def test_otp_email_template(to_email: str, otp_code: str = "123456"):
    """Send a test OTP email with the actual template"""
    print(f"\n🔐 Sending OTP email template test to {to_email}...")
    
    # Import and use the actual EmailService
    try:
        from app.services.email_service import EmailService
        
        email_service = EmailService()
        result = email_service.send_otp_email(to_email, otp_code, "testing")
        
        if result:
            print(f"✅ OTP email sent successfully!")
            print(f"📬 OTP Code: {otp_code}")
            print(f"📬 Check your inbox at {to_email}")
        else:
            print(f"❌ Failed to send OTP email")
            
        return result
        
    except ImportError:
        print("❌ Could not import EmailService - using manual template")
        return send_test_email(to_email)

def main():
    """Main testing function"""
    print("📧 VoiceInvoice Email Service Testing")
    print("=" * 60)
    
    # Test SMTP connection first
    if not test_smtp_connection():
        return
    
    # Get test email address
    test_email = input("\n📧 Enter your email address for testing: ").strip()
    
    if not test_email or "@" not in test_email:
        print("❌ Invalid email address")
        return
    
    print(f"\n🧪 Running email tests for {test_email}...")
    
    # Test 1: Basic email
    print("\n" + "="*60)
    print("TEST 1: Basic Email Functionality")
    send_test_email(test_email)
    
    # Test 2: OTP Email Template
    print("\n" + "="*60)
    print("TEST 2: OTP Email Template")
    test_otp_email_template(test_email, "987654")
    
    print(f"\n🎉 Email testing completed!")
    print(f"\n📋 Next Steps:")
    print("1. Check your email inbox")
    print("2. Verify both test emails arrived")
    print("3. If successful, your email service is ready!")
    print("4. Update your main app to use real email sending")

if __name__ == "__main__":
    main()
