
# MANAS360 Digital Pet Hub (PT06)

## Backend Setup
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

## Frontend Setup
cd frontend
flutter pub get
flutter run

## Database
Create PostgreSQL DB and run:
database/schema.sql
