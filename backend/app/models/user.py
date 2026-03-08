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
    """Extended profile for artisan users — matches DB artisans table."""
    name: Optional[str] = None
    email: Optional[str] = None
    artisan_id: Optional[str] = None
    user_id: Optional[str] = None
    craft_type: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    rating: Optional[float] = 0.0
    total_reviews: Optional[int] = 0
    verification_status: Optional[str] = "pending"
    profile_image_url: Optional[str] = None

    class Config:
        from_attributes = True
