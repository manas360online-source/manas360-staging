
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import os

# Load environment variables
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Load credentials from .env, falling back to defaults
DB_USER = os.getenv('MANS360_DB_USER', 'postgres')
DB_PASS = os.getenv('MANS360_DB_PASSWORD', 'admin') # Default local password
DB_HOST = os.getenv('MANS360_DB_HOST', 'localhost')
DB_PORT = os.getenv('MANS360_DB_PORT', '5432')
TARGET_DB = os.getenv('MANS360_DB_NAME', 'mans360_dev')

def create_database():
    try:
        # Connect to default 'postgres' db to create new db
        conn = psycopg2.connect(
            user=DB_USER,
            password=DB_PASS,
            host=DB_HOST,
            port=DB_PORT,
            dbname="postgres"
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = conn.cursor()
        
        # Check if db exists
        cur.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{TARGET_DB}'")
        exists = cur.fetchone()
        
        if not exists:
            print(f"🛠️  Creating database '{TARGET_DB}'...")
            cur.execute(f"CREATE DATABASE {TARGET_DB}")
            print(f"✅ Database '{TARGET_DB}' created successfully!")
        else:
            print(f"✅ Database '{TARGET_DB}' already exists.")
            
        cur.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error creating database: {e}")
        return False

if __name__ == "__main__":
    create_database()
