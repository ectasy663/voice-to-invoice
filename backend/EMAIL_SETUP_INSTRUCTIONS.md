# 📧 Gmail Email Service Setup Guide

## 🎯 Objective

Configure Gmail to send real OTP emails through your VoiceInvoice app.

## 📋 Prerequisites

- Gmail account
- 2-Factor Authentication enabled

## 🔧 Step-by-Step Setup

### Step 1: Enable 2-Factor Authentication

1. Go to https://myaccount.google.com/security
2. Click on "2-Step Verification"
3. Follow the setup process if not already enabled

### Step 2: Generate App Password

1. Go to https://myaccount.google.com/security
2. Click on "2-Step Verification"
3. Scroll down to "App passwords"
4. Click "Generate app password"
5. Select "Mail" or "Other" and name it "VoiceInvoice"
6. Copy the 16-character password (example: `abcd efgh ijkl mnop`)

### Step 3: Update Environment Variables

Update your `backend/.env` file:

```env
# Email Configuration (Real Gmail Setup)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=abcd-efgh-ijkl-mnop
FROM_EMAIL=your-email@gmail.com
FROM_NAME=VoiceInvoice Team
```

### Step 4: Test Email Configuration

Run the email test script to verify your setup.

## 🚨 Important Notes

- **Never commit your app password** to version control
- **Use environment variables** for all sensitive data
- **App passwords are specific to each application**
- **Remove spaces** from the app password when copying

## 🔒 Security Best Practices

1. **Environment Variables**: Store credentials in `.env` file
2. **Gitignore**: Ensure `.env` is in your `.gitignore`
3. **App Passwords**: Use app-specific passwords, not your main password
4. **Rate Limiting**: Gmail has sending limits (500 emails/day for free accounts)

## 📊 Testing Commands

```bash
# Test email configuration
python test_email.py

# Test complete API with real emails
python test_api.py
```

## 🛠️ Troubleshooting

### Common Issues:

1. **"Authentication failed"**

   - Verify 2FA is enabled
   - Check app password is correct (no spaces)
   - Ensure SMTP_USERNAME matches the Gmail account

2. **"Connection refused"**

   - Check SMTP_SERVER=smtp.gmail.com
   - Check SMTP_PORT=587
   - Verify internet connection

3. **"Too many login attempts"**
   - Wait 1-2 hours and try again
   - Check if account is temporarily locked

### Solutions:

- Double-check all environment variables
- Verify Gmail account settings
- Test with a simple email first
