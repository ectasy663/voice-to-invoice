#!/usr/bin/env python3
"""
MongoDB Database Initialization Script for VoiceInvoice
This script sets up the database collections and indexes.
"""

import os
import sys
from dotenv import load_dotenv
from pymongo import MongoClient, ASCENDING
from pymongo.errors import ConnectionFailure, OperationFailure

# Load environment variables
load_dotenv()

def test_connection():
    """Test MongoDB connection"""
    print("🔍 Testing MongoDB Connection...")
    
    try:
        mongodb_url = os.getenv("MONGODB_URL")
        if not mongodb_url:
            print("❌ MONGODB_URL not found in environment variables")
            return False
            
        # Use a shorter timeout for testing
        client = MongoClient(mongodb_url, serverSelectionTimeoutMS=5000)
        # Test connection
        client.admin.command('ping')
        print("✅ MongoDB connection successful!")
        
        # Get database
        db = client.voiceinvoice_db
        print(f"📊 Connected to database: {db.name}")
        
        return client, db
        
    except ConnectionFailure as e:
        print(f"❌ MongoDB connection failed: {e}")
        print("\n💡 Solutions:")
        print("1. If using MongoDB Atlas:")
        print("   - Update MONGODB_URL with your actual connection string")
        print("   - Add your IP address to allowlist (0.0.0.0/0 for development)")
        print("   - Check username/password in connection string")
        print("\n2. If using local MongoDB:")
        print("   - Make sure MongoDB service is running")
        print("   - Use: MONGODB_URL=mongodb://localhost:27017/voiceinvoice_db")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

def create_collections(db):
    """Create required collections with indexes"""
    print("\n🏗️  Creating Collections and Indexes...")
    
    collections_to_create = [
        {
            'name': 'users',
            'indexes': [
                {'fields': [('email', ASCENDING)], 'unique': True},
                {'fields': [('created_at', ASCENDING)], 'unique': False}
            ]
        },
        {
            'name': 'otp_codes',
            'indexes': [
                {'fields': [('email', ASCENDING), ('purpose', ASCENDING)], 'unique': False},
                {'fields': [('expires_at', ASCENDING)], 'unique': False, 'expireAfterSeconds': 0}
            ]
        }
    ]
    
    for collection_info in collections_to_create:
        collection_name = collection_info['name']
        
        # Create collection if it doesn't exist
        if collection_name not in db.list_collection_names():
            db.create_collection(collection_name)
            print(f"✅ Created collection: {collection_name}")
        else:
            print(f"📝 Collection already exists: {collection_name}")
        
        # Create indexes
        collection = db[collection_name]
        for index_info in collection_info['indexes']:
            try:
                if 'expireAfterSeconds' in index_info:
                    collection.create_index(
                        index_info['fields'],
                        unique=index_info.get('unique', False),
                        expireAfterSeconds=index_info['expireAfterSeconds']
                    )
                else:
                    collection.create_index(
                        index_info['fields'],
                        unique=index_info.get('unique', False)
                    )
                print(f"✅ Created index on {collection_name}: {index_info['fields']}")
            except OperationFailure as e:
                if "already exists" in str(e):
                    print(f"📝 Index already exists on {collection_name}: {index_info['fields']}")
                else:
                    print(f"⚠️  Index creation warning on {collection_name}: {e}")

def show_database_info(db):
    """Display database information"""
    print(f"\n📊 Database Information:")
    print(f"Database Name: {db.name}")
    print(f"Collections: {db.list_collection_names()}")
    
    for collection_name in db.list_collection_names():
        collection = db[collection_name]
        count = collection.count_documents({})
        print(f"  - {collection_name}: {count} documents")

def main():
    """Main function"""
    print("🚀 VoiceInvoice MongoDB Setup")
    print("=" * 50)
    
    # Test connection
    result = test_connection()
    if not result:
        sys.exit(1)
    
    client, db = result
    
    try:
        # Create collections and indexes
        create_collections(db)
        
        # Show database info
        show_database_info(db)
        
        print("\n🎉 Database setup completed successfully!")
        print("\n📋 Next Steps:")
        print("1. Update your .env file with correct MongoDB connection string")
        print("2. Configure email settings (SMTP_USERNAME, SMTP_PASSWORD)")
        print("3. Run the FastAPI server: uvicorn app.main:app --reload")
        
    except Exception as e:
        print(f"❌ Setup failed: {e}")
        sys.exit(1)
    finally:
        client.close()

if __name__ == "__main__":
    main()
