
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models
from pydantic import BaseModel

router = APIRouter()

class LoginSchema(BaseModel):
    email: str
    password: str

@router.post("/login")
def login(data: LoginSchema, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if not user:
        # For demo purposes, if no user exists, create a default one
        if data.email == "test@example.com" and data.password == "password":
            new_user = models.User(email=data.email, password_hash="hashed_password")
            db.add(new_user)
            db.commit()
            return {"token": "demo-token-for-new-user"}
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return {"token": "dummy-jwt-token"}
