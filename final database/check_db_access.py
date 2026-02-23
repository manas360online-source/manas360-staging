
import psycopg2
import os

def test_connection(user, password, dbname):
    try:
        print(f"Testing connection for user='{user}' db='{dbname}'...", end=" ")
        conn = psycopg2.connect(
            host="localhost",
            port=5432,
            dbname=dbname,
            user=user,
            password=password
        )
        print("✅ SUCCESS")
        conn.close()
        return True
    except Exception as e:
        print(f"❌ FAILED: {str(e).strip()}")
        return False

# Common default credentials to try
credentials = [
    ("postgres", "postgres", "postgres"),
    ("postgres", "admin", "postgres"),
    ("postgres", "password", "postgres"),
    ("postgres", "1234", "postgres"),
    ("postgres", "root", "postgres"),
    ("postgres", "", "postgres"),  # Empty password
]

print("🔍 Scanning for valid PostgreSQL credentials...")
found = False

for user, password, dbname in credentials:
    if test_connection(user, password, dbname):
        print(f"\n🎉 FOUND VALID CREDENTIALS!")
        print(f"User: {user}")
        print(f"Password: {password}")
        
        # Create .env file with these credentials
        with open('.env', 'w') as f:
            f.write(f"MANS360_DB_HOST=localhost\n")
            f.write(f"MANS360_DB_PORT=5432\n")
            f.write(f"MANS360_DB_NAME=mans360_dev\n")  # We'll need to create this maybe
            f.write(f"MANS360_DB_USER={user}\n")
            f.write(f"MANS360_DB_PASSWORD={password}\n")
        
        print("✅ Saved to .env file.")
        found = True
        break

if not found:
    print("\n❌ Could not find valid credentials for 'postgres' user.")
    print("Please create a .env file with your correct database credentials.")
