"""
Authentication routes — register and login.
Uses Supabase Auth under the hood.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.models.user import UserCreate, UserResponse
from app.database import get_db

router = APIRouter()


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/register", response_model=dict)
async def register(user: UserCreate):
    """Register a new user (buyer or artisan)."""
    db = get_db()

    try:
        # 1. Create user in Supabase Auth
        response = db.auth.sign_up({
            "email": user.email,
            "password": user.password,
            "options": {
                "data": {
                    "name": user.name,
                    "role": user.role,
                    "phone": user.phone,
                    "location": user.location,
                }
            },
        })

        if response.user:
            # 2. Also insert into public.users table
            # The Supabase auth trigger may not always create this, so we upsert.
            try:
                db.table("users").upsert({
                    "id": response.user.id,
                    "name": user.name,
                    "email": user.email,
                    "phone": user.phone or "",
                    "role": user.role,
                    "location": user.location or "",
                    "firebase_uid": response.user.id,  # Map Supabase auth ID
                    "is_active": True,
                }).execute()
            except Exception as insert_err:
                print(f"[Auth] Users table upsert warning: {insert_err}")

            return {
                "message": "Registration successful",
                "user": {
                    "id": response.user.id,
                    "email": response.user.email,
                    "role": user.role,
                    "name": user.name,
                },
            }
        else:
            raise HTTPException(status_code=400, detail="Failed to create user")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login", response_model=dict)
async def login(credentials: LoginRequest):
    """Login with email and password."""
    db = get_db()

    try:
        response = db.auth.sign_in_with_password({
            "email": credentials.email,
            "password": credentials.password,
        })

        if response.session:
            # Fetch user data from public.users table
            user_data = (
                db.table("users")
                .select("*")
                .eq("id", response.user.id)
                .execute()
            )
            db_user = user_data.data[0] if user_data.data else {}

            return {
                "message": "Login successful",
                "token": response.session.access_token,
                "user": {
                    "id": response.user.id,
                    "email": response.user.email,
                    "role": db_user.get("role", "buyer"),
                    "name": db_user.get("name", ""),
                },
            }
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
