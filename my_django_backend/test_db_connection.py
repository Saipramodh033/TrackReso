#!/usr/bin/env python3
"""
Test script to check database connectivity
"""
import os
from dotenv import load_dotenv
import psycopg2
from urllib.parse import urlparse

# Load environment variables
load_dotenv()

def test_database_connection():
    database_url = os.getenv('DATABASE_URL')
    
    if not database_url:
        print("❌ No DATABASE_URL found in environment variables")
        return False
    
    print(f"🔗 Testing connection to: {database_url}")
    
    try:
        # Parse the database URL
        result = urlparse(database_url)
        
        print(f"Host: {result.hostname}")
        print(f"Port: {result.port}")
        print(f"Database: {result.path[1:]}")  # Remove leading slash
        print(f"Username: {result.username}")
        
        # Attempt connection
        connection = psycopg2.connect(database_url)
        cursor = connection.cursor()
        
        # Test query
        cursor.execute("SELECT version();")
        db_version = cursor.fetchone()
        
        print(f"✅ Connection successful!")
        print(f"Database version: {db_version[0]}")
        
        cursor.close()
        connection.close()
        return True
        
    except psycopg2.OperationalError as e:
        print(f"❌ Connection failed: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Database Connection Test")
    print("=" * 50)
    test_database_connection()
