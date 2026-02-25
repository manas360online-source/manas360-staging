from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP, Text, Float, Boolean, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    
    pets = relationship("UserPet", back_populates="owner", foreign_keys="[UserPet.user_id]")

class PetSpecies(Base):
    __tablename__ = "pet_species"
    id = Column(Integer, primary_key=True, index=True)
    species_key = Column(String(50), unique=True, nullable=False)
    display_name = Column(String(100), nullable=False)
    tier = Column(Integer, nullable=False) # 1, 2, 3
    environment = Column(String(50))
    personality = Column(JSON) # e.g. {"playful": 0.8, "calm": 0.3}
    therapeutic_tags = Column(JSON) # e.g. ["anxiety", "loneliness"]
    ai_system_prompt = Column(Text)
    rive_asset_url = Column(Text)
    price_monthly = Column(Integer) # in paisa
    price_own = Column(Integer) # in paisa
    created_at = Column(TIMESTAMP, server_default=func.now())

class UserPet(Base):
    __tablename__ = "user_pets"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    species_id = Column(Integer, ForeignKey("pet_species.id"))
    pet_name = Column(String(50))
    access_type = Column(String(20)) # 'free', 'subscription', 'owned', 'rx'
    prescribed_by = Column(Integer, ForeignKey("users.id"), nullable=True) # Assuming therapists are users
    rx_reason = Column(Text)

    # Live Stats
    happiness = Column(Float, default=50.0)
    energy = Column(Float, default=100.0)
    bond = Column(Float, default=0.0)
    hunger = Column(Float, default=0.0)
    xp = Column(Integer, default=0)
    level = Column(Integer, default=1)
    streak_days = Column(Integer, default=0)

    # AI Memory (Tier 3)
    memory_facts = Column(JSON, default=list) # []
    emotional_profile = Column(JSON, default=dict) # {}

    is_active = Column(Boolean, default=True)
    adopted_at = Column(TIMESTAMP, server_default=func.now())
    last_sync = Column(TIMESTAMP, onupdate=func.now())

    owner = relationship("User", foreign_keys=[user_id], back_populates="pets")
    species = relationship("PetSpecies")

class PetInteraction(Base):
    __tablename__ = "pet_interactions"
    id = Column(Integer, primary_key=True, index=True)
    user_pet_id = Column(Integer, ForeignKey("user_pets.id"))
    interaction_type = Column(String(30)) # 'touch', 'breathing', 'game', 'voice_chat'
    duration_secs = Column(Integer)
    xp_earned = Column(Integer)
    mood_before = Column(Float)
    mood_after = Column(Float)
    metadata_json = Column(JSON) # 'metadata' is often reserved
    created_at = Column(TIMESTAMP, server_default=func.now())

class PetConversation(Base):
    __tablename__ = "pet_conversations"
    id = Column(Integer, primary_key=True, index=True)
    user_pet_id = Column(Integer, ForeignKey("user_pets.id"))
    role = Column(String(10)) # 'user' or 'pet'
    content = Column(Text)
    emotion = Column(String(20))
    tokens_used = Column(Integer)
    cost_paisa = Column(Integer)
    created_at = Column(TIMESTAMP, server_default=func.now())

class MoodLog(Base):
    __tablename__ = "mood_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    mood_score = Column(Integer)
    created_at = Column(TIMESTAMP, server_default=func.now())
