
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.api import pet, auth
from app.database import engine, Base
from app import models
import os

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="MANAS360 Digital Pet Hub")

# Mount static files
static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
app.mount("/static", StaticFiles(directory=static_dir), name="static")

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(pet.router, prefix="/pets", tags=["Pets"])

@app.get("/")
def root():
    index_path = os.path.join(static_dir, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "MANAS360 Digital Pet Hub API Running"}
