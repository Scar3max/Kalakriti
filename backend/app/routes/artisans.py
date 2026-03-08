"""
Artisan routes — profile management and product listing by artisan.
"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import uuid
from app.models.user import ArtisanProfile
from app.database import get_db
from pydantic import BaseModel

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

    # DB PK is `artisan_id` (auto-generated UUID).
    # `name` lives on the `users` table, not `artisans`.
    # We store `location` as "city, state" for display purposes.
    artisan_data = {
        "artisan_id": str(uuid.uuid4()),
        "user_id": user.id,
        "craft_type": data.craft_type,
        "bio": data.bio,
        "state": data.state,
        "city": data.city,
        "location": f"{data.city}, {data.state}",
        "rating": 0.0,
        "total_reviews": 0,
        "verification_status": "pending",
    }

    try:
        result = db.table("artisans").insert(artisan_data).execute()
        # Also update the user's name on the users table if provided
        if data.name:
            db.table("users").update({"name": data.name}).eq("id", user.id).execute()
        return {"message": "Artisan profile created", "artisan": result.data[0] if result.data else None}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{artisan_id}", response_model=dict)
async def get_artisan_profile(artisan_id: str):
    """
    Get an artisan's public profile.
    Accepts either an artisan_id (UUID from artisans table)
    or a user_id (UUID from users table).
    """
    db = get_db()

    # First try by artisan_id (primary key)
    response = db.table("artisans").select("*, users(name, email, phone)").eq("artisan_id", artisan_id).execute()

    # If not found, try by user_id (for login-redirect lookups)
    if not response.data:
        response = db.table("artisans").select("*, users(name, email, phone)").eq("user_id", artisan_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Artisan not found")

    # Flatten user name into the artisan profile for frontend convenience
    profile = response.data[0]
    user_data = profile.pop("users", {}) or {}
    profile["name"] = user_data.get("name", "")
    profile["email"] = user_data.get("email", "")

    return {"profile": profile}


@router.put("/{artisan_id}", response_model=dict)
async def update_artisan_profile(artisan_id: str, profile: ArtisanProfile):
    """Update artisan profile (bio, craft type, etc.)."""
    db = get_db()
    update_data = profile.dict(exclude_unset=True)
    
    name = update_data.pop("name", None)
    email = update_data.pop("email", None)

    # Remove fields that shouldn't be updated directly
    update_data.pop("artisan_id", None)
    user_id = update_data.pop("user_id", None)

    target_user_id = user_id

    # Update artisans table first if there are any fields left
    if update_data:
        response = db.table("artisans").update(update_data).eq("artisan_id", artisan_id).execute()
        if not response.data:
            # Try by user_id as fallback
            response = db.table("artisans").update(update_data).eq("user_id", artisan_id).execute()
        if not response.data:
            raise HTTPException(status_code=400, detail="Failed to update profile")
        target_user_id = response.data[0]["user_id"]
    
    # Update users table if name or email changed
    if (name or email) and not target_user_id:
        res = db.table("artisans").select("user_id").eq("artisan_id", artisan_id).execute()
        if not res.data:
            res = db.table("artisans").select("user_id").eq("user_id", artisan_id).execute()
        if res.data:
            target_user_id = res.data[0]["user_id"]
            
    if target_user_id and (name or email):
        user_update = {}
        if name: user_update["name"] = name
        if email: user_update["email"] = email
        db.table("users").update(user_update).eq("id", target_user_id).execute()

    return {"message": "Profile updated successfully"}


@router.get("/{artisan_id}/products", response_model=dict)
async def get_artisan_products(artisan_id: str):
    """Get all products listed by a specific artisan."""
    db = get_db()

    # Try by artisan_id first
    response = db.table("products").select("*").eq("artisan_id", artisan_id).execute()

    # If empty, the caller might have passed user_id — look up the artisan_id first
    if not response.data:
        artisan_res = db.table("artisans").select("artisan_id").eq("user_id", artisan_id).execute()
        if artisan_res.data:
            actual_artisan_id = artisan_res.data[0]["artisan_id"]
            response = db.table("products").select("*").eq("artisan_id", actual_artisan_id).execute()

    return {"products": response.data, "artisan_id": artisan_id}
