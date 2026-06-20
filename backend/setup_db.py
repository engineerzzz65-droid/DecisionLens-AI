import pymysql
import os
from dotenv import load_dotenv
import re

def setup_database():
    """Setup the database for DecisionLens AI"""
    
    print("🔧 Setting up DecisionLens AI Database...")
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
        print("Expected: mysql+pymysql://username:password@host:port/database")
        return False
    
    username, password, host, port, database = match.groups()
    
    print(f"📡 Connecting to MySQL at {host}:{port}")
    print(f"👤 Username: {username}")
    print(f"🗄️  Database: {database}")
    
    try:
        # Connect to MySQL
        connection = pymysql.connect(
            host=host,
            user=username,
            password=password or '',
            port=int(port)
        )
        
        with connection.cursor() as cursor:
            # Create database
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {database}")
            print(f"✅ Database '{database}' created/verified")
            
            # Check if we can use the database
            cursor.execute(f"USE {database}")
            print(f"✅ Connected to '{database}'")
            
            # Create a test table to verify
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS test_connection (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    test_value VARCHAR(50),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            print("✅ Test table created")
            
            # Insert test data
            cursor.execute("INSERT INTO test_connection (test_value) VALUES ('Connection successful!')")
            connection.commit()
            print("✅ Test data inserted")
            
            # Verify
            cursor.execute("SELECT * FROM test_connection")
            result = cursor.fetchone()
            print(f"✅ Test query successful: {result[1]}")
            
            # Clean up
            cursor.execute("DROP TABLE test_connection")
            connection.commit()
            print("✅ Test table cleaned up")
        
        connection.close()
        print("=" * 50)
        print("🎉 Database setup complete!")
        print("\n📝 Next steps:")
        print("1. Run 'python run.py' to start the backend")
        print("2. Visit http://localhost:8000/docs for API docs")
        print("3. Start the frontend with 'npm run dev'")
        return True
        
    except pymysql.err.OperationalError as e:
        print(f"❌ Connection error: {e}")
        print("\n💡 Troubleshooting:")
        print("1. Make sure MySQL is running in XAMPP")
        print("2. Check your username and password")
        print("3. Try the default XAMPP settings: root with no password")
        print("4. Update DATABASE_URL in .env file")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    setup_database()