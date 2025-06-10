#!/usr/bin/env python3
"""
Security Verification Script for VoiceInvoice Project
"""

import os
import subprocess

def main():
    print("🔒 VoiceInvoice Security Verification")
    print("=" * 40)
    
    # Check 1: Git tracking
    print("🔍 Checking git status for .env files...")
    try:
        result = subprocess.run(['git', 'ls-files'], capture_output=True, text=True)
        tracked_files = result.stdout.strip().split('\n') if result.stdout.strip() else []
        env_files = [f for f in tracked_files if f.endswith('.env') and not f.endswith('.env.example')]
        
        if env_files:
            print("❌ SECURITY ISSUE: .env files are being tracked!")
            for file in env_files:
                print(f"   - {file}")
        else:
            print("✅ Good! No .env files are being tracked.")
    except:
        print("⚠️  Git check failed")
    
    # Check 2: Environment files
    print("\n📁 Checking environment files...")
    files = [
        ('.env.example', 'Frontend template'),
        ('backend/.env.example', 'Backend template'),
        ('.env', 'Frontend config'),
        ('backend/.env', 'Backend config')
    ]
    
    for file_path, desc in files:
        if os.path.exists(file_path):
            print(f"✅ {desc}: {file_path}")
        else:
            if '.example' in file_path:
                print(f"❌ Missing {desc}: {file_path}")
            else:
                print(f"⚠️  Missing {desc}: {file_path} (copy from .example)")
    
    # Check 3: Gitignore
    print("\n📝 Checking .gitignore...")
    if os.path.exists('.gitignore'):
        with open('.gitignore', 'r') as f:
            content = f.read()
        if '.env' in content:
            print("✅ .gitignore properly configured")
        else:
            print("⚠️  .gitignore missing .env patterns")
    else:
        print("❌ .gitignore not found")
    
    print("\n" + "=" * 40)
    print("🎉 Security check completed!")
    print("📖 Read SECURITY_SETUP.md for detailed setup instructions")

if __name__ == "__main__":
    main()
