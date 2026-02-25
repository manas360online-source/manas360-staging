
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import os

def setup_database():
    conn = None
    try:
        # Connect to default postgres database
        conn = psycopg2.connect(
            dbname='postgres',
            user='postgres',
            password='postgres',
            host='127.0.0.1'
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = conn.cursor()
        
        # Check if database exists
        cur.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = 'manas360_pet_hub'")
        exists = cur.fetchone()
        if not exists:
            cur.execute('CREATE DATABASE manas360_pet_hub')
            print("Database manas360_pet_hub created.")
        else:
            print("Database manas360_pet_hub already exists.")
        
        cur.close()
        conn.close()

        # Connect to the new database and run schema
        conn = psycopg2.connect(
            dbname='manas360_pet_hub',
            user='postgres',
            password='postgres',
            host='127.0.0.1'
        )
        cur = conn.cursor()
        
        schema_path = os.path.join(os.path.dirname(__file__), 'schema.sql')
        with open(schema_path, 'r') as f:
            cur.execute(f.read())
        
        conn.commit()
        print("Schema applied successfully.")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error setting up database: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    setup_database()
