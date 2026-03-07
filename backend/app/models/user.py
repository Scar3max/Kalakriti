"""
User model — represents both buyers and artisans.
Uses Supabase as the data store (no ORM, direct REST calls).
"""

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    """Shared user fields."""
    name: str
    email: EmailStr
    phone: Optional[str] = None
    role: str = "buyer"  # "buyer" or "artisan"
    location: Optional[str] = None


class UserCreate(UserBase):
    """Fields required to create a new user."""
    password: str


class UserResponse(UserBase):
    """Fields returned from the API."""
    id: str
    created_at: datetime

    class Config:
        from_attributes = True


class ArtisanProfile(BaseModel):
    """Extended profile for artisan users."""
    artisan_id: Optional[str] = None
    user_id: str
    craft_type: Optional[str] = None
    bio: Optional[str] = None
    rating: float = 0.0
    verification_status: str = "pending"

    class Config:
        from_attributes = True
