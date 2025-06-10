import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from typing import Optional

class EmailService:
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", 587))
        self.username = os.getenv("SMTP_USERNAME")
        self.password = os.getenv("SMTP_PASSWORD")
        self.from_email = os.getenv("FROM_EMAIL", self.username)
        self.from_name = os.getenv("FROM_NAME", "VoiceInvoice Team")
    
    def send_otp_email(self, to_email: str, otp_code: str, purpose: str) -> bool:
        """Send OTP email to user"""
        try:
            # Check if email is configured
            if not self.username or not self.password:
                print("⚠️  Email not configured - using demo mode")
                return True  # Return True for demo mode
            
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
            
            print(f"✅ Email sent successfully to {to_email}")
            return True
        except Exception as e:
            print(f"❌ Email sending failed: {str(e)}")
            return False
    
    def _generate_otp_email_html(self, otp_code: str, purpose: str) -> str:
        """Generate beautiful HTML email template for OTP"""
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
