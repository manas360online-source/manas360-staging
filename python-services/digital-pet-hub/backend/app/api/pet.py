from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter()

# --- SCHEMAS ---

class PetSpeciesSchema(BaseModel):
    id: int
    species_key: str
    display_name: str
    tier: int
    environment: Optional[str]
    personality: Optional[dict]
    therapeutic_tags: Optional[List[str]]
    rive_asset_url: Optional[str]
    price_monthly: Optional[int]
    price_own: Optional[int]

    class Config:
        from_attributes = True

class UserPetSchema(BaseModel):
    id: int
    user_id: int
    species_id: int
    pet_name: Optional[str]
    access_type: str
    happiness: float
    energy: float
    bond: float
    hunger: float
    xp: int
    level: int
    streak_days: int
    species: PetSpeciesSchema

    class Config:
        from_attributes = True

class UserPetUpdate(BaseModel):
    happiness: Optional[float]
    energy: Optional[float]
    bond: Optional[float]
    hunger: Optional[float]
    xp: Optional[int]
    level: Optional[int]
    streak_days: Optional[int]

class InteractionCreate(BaseModel):
    interaction_type: str
    duration_secs: int
    xp_earned: int
    mood_before: Optional[float]
    mood_after: Optional[float]
    metadata_json: Optional[dict]

# --- ENDPOINTS ---

@router.get("/catalog", response_model=List[PetSpeciesSchema])
def get_catalog(db: Session = Depends(get_db)):
    species = db.query(models.PetSpecies).all()
    if not species:
        # Seed default species from Tech Spec
        defaults = [
            models.PetSpecies(
                species_key="golden_puppy", 
                display_name="Golden Puppy", 
                tier=2, 
                environment="Sunny Meadow",
                personality={"playful": 0.8, "calm": 0.3},
                therapeutic_tags=["anxiety", "joy"],
                price_monthly=9900,
                price_own=19900
            ),
            models.PetSpecies(
                species_key="wise_owl", 
                display_name="Wise Owl", 
                tier=2, 
                environment="Forest Library",
                personality={"calm": 0.9, "curious": 0.7},
                therapeutic_tags=["focus", "wisdom"]
            ),
            models.PetSpecies(
                species_key="phoenix", 
                display_name="Phoenix", 
                tier=3, 
                environment="Ashen Peaks",
                personality={"warm": 0.9, "resilient": 1.0},
                therapeutic_tags=["rebirth", "hope"]
            )
        ]
        db.add_all(defaults)
        db.commit()
        species = db.query(models.PetSpecies).all()
    return species

@router.post("/adopt", response_model=UserPetSchema)
def adopt_pet(species_id: int, user_id: int = 1, db: Session = Depends(get_db)):
    # Check if species exists
    species = db.query(models.PetSpecies).filter(models.PetSpecies.id == species_id).first()
    if not species:
        raise HTTPException(status_code=404, detail="Species not found")
    
    new_pet = models.UserPet(
        user_id=user_id,
        species_id=species_id,
        pet_name=f"My {species.display_name}",
        access_type="free" if species.tier == 1 else "owned"
    )
    db.add(new_pet)
    db.commit()
    db.refresh(new_pet)
    return new_pet

@router.get("/", response_model=List[UserPetSchema])
def get_my_pets(user_id: int = 1, db: Session = Depends(get_db)):
    # Helper for UI to get all pets for the default user
    pets = db.query(models.UserPet).filter(models.UserPet.user_id == user_id).all()
    if not pets:
        # Auto-adopt a Golden Puppy if none exist for demo
        get_catalog(db) # Ensure catalog seeded
        species = db.query(models.PetSpecies).filter(models.PetSpecies.species_key == "golden_puppy").first()
        if species:
            return [adopt_pet(species.id, user_id, db)]
    return pets

@router.get("/{pet_id}/state", response_model=UserPetSchema)
def get_pet_state(pet_id: int, db: Session = Depends(get_db)):
    pet = db.query(models.UserPet).filter(models.UserPet.id == pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
    return pet

@router.put("/{pet_id}/state", response_model=UserPetSchema)
def update_pet_state(pet_id: int, data: UserPetUpdate, db: Session = Depends(get_db)):
    pet = db.query(models.UserPet).filter(models.UserPet.id == pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
    
    for field, value in data.dict(exclude_unset=True).items():
        setattr(pet, field, value)
    
    db.commit()
    db.refresh(pet)
    return pet

@router.post("/{pet_id}/interactions")
def log_interaction(pet_id: int, data: InteractionCreate, db: Session = Depends(get_db)):
    pet = db.query(models.UserPet).filter(models.UserPet.id == pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
    
    new_interaction = models.PetInteraction(
        user_pet_id=pet_id,
        **data.dict()
    )
    db.add(new_interaction)
    
    # Update pet XP
    pet.xp += data.xp_earned
    # Simple level up logic
    pet.level = (pet.xp // 100) + 1
    
    db.commit()
    return {"message": "Interaction logged", "new_xp": pet.xp, "new_level": pet.level}

@router.post("/{pet_id}/chat")
def pet_text_chat(pet_id: int, message: str, db: Session = Depends(get_db)):
    # Placeholder for Claude AI Integration
    pet = db.query(models.UserPet).filter(models.UserPet.id == pet_id).first()
    if not pet or pet.species.tier < 3:
        raise HTTPException(status_code=403, detail="AI Chat requires a Tier 3 pet")
    
    return {
        "pet_name": pet.pet_name,
        "response": f"I received your message: '{message}'. (Claude AI Integration Pending)"
    }

@router.post("/{pet_id}/voice")
def pet_voice_chat(pet_id: int, db: Session = Depends(get_db)):
    # Placeholder for STT -> Claude -> TTS Pipeline
    pet = db.query(models.UserPet).filter(models.UserPet.id == pet_id).first()
    if not pet or pet.species.tier < 3:
        raise HTTPException(status_code=403, detail="Voice Chat requires a Tier 3 pet")
    return {"message": "Voice streaming endpoint ready (Placeholder)"}

@router.get("/{pet_id}/memory")
def get_pet_memory(pet_id: int, db: Session = Depends(get_db)):
    pet = db.query(models.UserPet).filter(models.UserPet.id == pet_id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
    return {"facts": pet.memory_facts, "emotional_profile": pet.emotional_profile}
