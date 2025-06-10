from pymongo import MongoClient
from pymongo.database import Database
import os
from dotenv import load_dotenv

load_dotenv()

class DatabaseManager:
    _instance = None
    _client = None
    _database = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DatabaseManager, cls).__new__(cls)
        return cls._instance
    
    def connect(self):
        if self._client is None:
            mongodb_url = os.getenv("MONGODB_URL")
            self._client = MongoClient(mongodb_url)
            self._database = self._client.voiceinvoice_db
        return self._database
    
    def close(self):
        if self._client:
            self._client.close()

# Global database instance
db_manager = DatabaseManager()
database = db_manager.connect()
