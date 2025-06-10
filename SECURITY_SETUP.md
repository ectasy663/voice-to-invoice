# 🔒 Security Setup Guide

This guide helps you set up your environment variables securely for the VoiceInvoice application.

## ⚠️ Important Security Notes

- **NEVER** commit `.env` files to version control
- **NEVER** share your `.env` files publicly
- **ALWAYS** use strong, unique passwords and keys
- **ALWAYS** use environment variables for sensitive data

## 🚀 Quick Setup

### 1. Frontend Environment Setup

```bash
# Copy the example file
cp .env.example .env

# Edit the .env file with your values
# Note: Only needed if using EmailJS instead of backend email service
```

### 2. Backend Environment Setup

```bash
# Navigate to backend directory
cd backend

# Copy the example file
cp .env.example .env

# Edit the .env file with your actual credentials
```

## 🔑 Required Configuration

### Database Setup

Choose one of the following options:

#### Option A: Local MongoDB (Recommended for Development)

```env
MONGODB_URL=mongodb://localhost:27017/voiceinvoice_db
```

#### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster and get your connection string
3. Replace the URL:

```env
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/voiceinvoice_db?retryWrites=true&w=majority
```

### Security Keys

#### Generate a Strong JWT Secret Key

```bash
# Option 1: Using OpenSSL (recommended)
openssl rand -hex 32

# Option 2: Using Python
python -c "import secrets; print(secrets.token_hex(32))"

# Option 3: Online generator (use trusted sources only)
# Visit: https://generate-secret.vercel.app/32
```

Add the generated key to your `.env`:

```env
SECRET_KEY=your-generated-secret-key-here
```

### Email Configuration

#### Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:

   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Click "App passwords" under 2-Step Verification
   - Select "Mail" and generate a password
   - Use this 16-character password (not your regular Gmail password)

3. **Update your `.env` file**:

```env
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-16-character-app-password
FROM_EMAIL=your-email@gmail.com
```

#### Alternative Email Providers

- **Outlook/Hotmail**: `smtp.outlook.com:587`
- **Yahoo**: `smtp.mail.yahoo.com:587`
- **Custom SMTP**: Contact your provider for settings

## 🛡️ Security Best Practices

### 1. Environment File Security

```bash
# Set proper file permissions (Linux/Mac)
chmod 600 .env
chmod 600 backend/.env

# Verify files are ignored by git
git status  # Should not show .env files
```

### 2. Production Deployment

- Use platform-specific environment variable systems
- **Heroku**: Config Vars in dashboard
- **Vercel**: Environment Variables in project settings
- **AWS**: Parameter Store or Secrets Manager
- **Docker**: Docker secrets or environment files

### 3. Key Rotation

- Rotate JWT secret keys regularly
- Update email passwords periodically
- Monitor for any unauthorized access

## 🔍 Troubleshooting

### Common Issues

#### Email Not Working

```bash
# Test email configuration
cd backend
python test_email.py
```

#### Database Connection Failed

```bash
# Check MongoDB status (local)
mongosh --eval "db.adminCommand('ping')"

# Test database connection
cd backend
python test_api.py
```

#### JWT Token Issues

- Ensure SECRET_KEY is properly set
- Check for special characters in environment variables
- Verify file encoding (should be UTF-8)

## 📋 Environment Variables Checklist

### Backend (.env)

- [ ] `MONGODB_URL` - Database connection string
- [ ] `SECRET_KEY` - Strong JWT secret (32+ characters)
- [ ] `SMTP_USERNAME` - Email address
- [ ] `SMTP_PASSWORD` - App password (not regular password)
- [ ] `FROM_EMAIL` - Email address for sending
- [ ] `FROM_NAME` - Display name for emails

### Frontend (.env) - Optional

- [ ] `VITE_API_BASE_URL` - Backend API URL
- [ ] `VITE_EMAILJS_*` - EmailJS credentials (if using)

## 🆘 Getting Help

If you encounter issues:

1. **Check the logs**: Look for error messages in terminal
2. **Verify credentials**: Double-check all environment variables
3. **Test connectivity**: Use provided test scripts
4. **Read documentation**: Check service-specific guides

## 📚 Additional Resources

- [MongoDB Atlas Setup](https://docs.atlas.mongodb.com/getting-started/)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [Environment Variable Security](https://blog.gitguardian.com/secrets-api-management/)

---

⚠️ **Remember**: Security is everyone's responsibility. When in doubt, ask for help rather than risk exposing sensitive information!
