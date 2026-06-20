import pymysql
import os
from dotenv import load_dotenv
import re

def reset_database():
    """Reset the database for DecisionLens AI"""
    
    print("🔄 Resetting DecisionLens AI Database...")
    print("=" * 50)
    
    # Load environment variables
    load_dotenv()
    
    # Get database URL
    database_url = os.getenv('DATABASE_URL', 'mysql+pymysql://root:@localhost:3306/decisionlens')
    
    # Parse URL
    pattern = r'mysql\+pymysql://([^:]+):([^@]*)@([^:]+):(\d+)/(.+)'
    match = re.match(pattern, database_url)
    
    if not match:
        print("❌ Invalid DATABASE_URL format")
        return False
    
    username, password, host, port, database = match.groups()
    
    print(f"📡 Connecting to MySQL at {host}:{port}")
    
    try:
        # Connect without database
        connection = pymysql.connect(
            host=host,
            user=username,
            password=password or '',
            port=int(port)
        )
        
        with connection.cursor() as cursor:
            # Drop database if exists
            cursor.execute(f"DROP DATABASE IF EXISTS {database}")
            print(f"✅ Dropped database '{database}'")
            
            # Create fresh database
            cursor.execute(f"CREATE DATABASE {database}")
            print(f"✅ Created fresh database '{database}'")
            
            # Use the database
            cursor.execute(f"USE {database}")
            print(f"✅ Connected to '{database}'")
            
            # Show all databases
            cursor.execute("SHOW DATABASES")
            databases = cursor.fetchall()
            print("\n📋 Available databases:")
            for db in databases:
                print(f"  - {db[0]}")
        
        connection.close()
        print("=" * 50)
        print("🎉 Database reset complete!")
        print("\n📝 Next steps:")
        print("1. Run 'python run.py' to create tables")
        print("2. The application will automatically create all tables")
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\n💡 Troubleshooting:")
        print("1. Make sure MySQL is running in XAMPP")
        print("2. Check your username and password in .env")
        return False

if __name__ == "__main__":
    reset_database()