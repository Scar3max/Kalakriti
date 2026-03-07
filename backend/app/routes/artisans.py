"""
Artisan routes — profile management and product listing by artisan.
"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.models.user import ArtisanProfile
from app.database import get_db
from pydantic import BaseModel
import uuid
from datetime import datetime

router = APIRouter()
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Extract user from Supabase JWT"""
    db = get_db()
    token = credentials.credentials
    try:
        res = db.auth.get_user(token)
        if not res or not res.user:
            raise HTTPException(status_code=401, detail="Invalid token")
        return res.user
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

class ArtisanCreateForm(BaseModel):
    craft_type: str
    bio: str
    state: str
    city: str
    name: str = ""

@router.post("/profile", response_model=dict)
def create_artisan_profile(data: ArtisanCreateForm, user=Depends(get_current_user)):
    """Create an artisan profile tied to the authenticated user ID."""
    db = get_db()
    
    # In many setups, the `id` from public.users matches the artisan profile's primary key `id`.
    # We will use the `user.id` as the artisan `id` for 1-to-1 linkage.
    artisan_data = {
        "id": user.id,   # Assuming 'id' is used in frontend routes to query artisan profile
        "user_id": user.id,
        "name": data.name,
        "craft_type": data.craft_type,
        "bio": data.bio,
        "location": f"{data.city}, {data.state}",
        "rating": 0.0,
        "verification_status": "pending"
    }
    
    # Try inserting. Note: we don't handle duplicate insertions robustly here (Supabase will throw error)
    try:
        db.table("artisans").insert(artisan_data).execute()
        return {"message": "Artisan profile created"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{artisan_id}", response_model=dict)
async def get_artisan_profile(artisan_id: str):
    """Get an artisan's public profile."""
    db = get_db()
    response = db.table("artisans").select("*").eq("id", artisan_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Artisan not found")
    return {"profile": response.data[0]}


@router.put("/{artisan_id}", response_model=dict)
async def update_artisan_profile(artisan_id: str, profile: ArtisanProfile):
    """Update artisan profile (bio, craft type, etc.)."""
    db = get_db()
    response = db.table("artisans").update(profile.dict(exclude_unset=True)).eq("id", artisan_id).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to update profile")
    return {"message": "Profile updated successfully", "profile": response.data[0]}


@router.get("/{artisan_id}/products", response_model=dict)
async def get_artisan_products(artisan_id: str):
    """Get all products listed by a specific artisan."""
    db = get_db()
    response = db.table("products").select("*").eq("artisan_id", artisan_id).execute()
    return {"products": response.data, "artisan_id": artisan_id}

