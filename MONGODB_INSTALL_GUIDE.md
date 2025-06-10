# 🛠️ MongoDB Local Installation Guide

## Step 1: Download and Install MongoDB Community Server

1. **Download MongoDB Community Server**:
   - Go to: https://www.mongodb.com/try/download/community
   - Select:
     - Version: 7.0.x (Current)
     - Platform: Windows
     - Package: msi
   - Click "Download"

2. **Install MongoDB**:
   - Run the downloaded .msi file
   - Choose "Complete" installation
   - Install as Windows Service (recommended)
   - Install MongoDB Compass (GUI tool)

3. **Verify Installation**:
   ```powershell
   # After installation, restart PowerShell and run:
   mongod --version
   mongo --version
   ```

## Step 2: Start MongoDB Service

```powershell
# Start MongoDB service
net start MongoDB

# Check if MongoDB is running
netstat -an | findstr :27017
```

## Step 3: Create Database and Collections

```powershell
# Connect to MongoDB
mongo

# In MongoDB shell:
use voiceinvoice_db
db.createCollection("users")
db.createCollection("otp_codes")
db.createCollection("sessions")

# Exit MongoDB shell
exit
```

## MongoDB Connection String for Local Setup:
```
MONGODB_URL=mongodb://localhost:27017/voiceinvoice_db
```

Once you've installed MongoDB, come back and I'll continue with the backend setup!
