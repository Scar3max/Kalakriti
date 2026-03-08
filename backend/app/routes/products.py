"""
Product routes — CRUD operations + AI content generation trigger.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
import uuid
from app.models.product import ProductCreate, ProductUpdate, ProductResponse
from app.database import get_db
from app.ai.content_generator import generate_product_content
from app.ai.speech_to_text import transcribe_audio
from app.ai.image_analyzer import analyze_image

router = APIRouter()


@router.get("/", response_model=dict)
async def list_products(
    category: Optional[str] = None,
    craft_type: Optional[str] = None,
    region: Optional[str] = None,
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=50),
):
    """List products with optional filters and pagination."""
    db = get_db()

    # Fetch published products, joining artisan + user info
    query = db.table("products").select(
        "*, artisans(*, users(name, email))"
    ).eq("status", "published")

    if category:
        query = query.eq("category", category)
    if search:
        query = query.ilike("title", f"%{search}%")

    # Pagination calculation
    offset = (page - 1) * limit

    response = query.range(offset, offset + limit - 1).execute()

    # Flatten artisan name into each product for frontend convenience
    products = []
    for p in response.data:
        artisan_data = p.get("artisans") or {}
        user_data = artisan_data.pop("users", {}) or {}
        artisan_data["name"] = user_data.get("name", "Unknown Artisan")
        p["artisans"] = artisan_data
        products.append(p)

    return {
        "products": products,
        "total": len(products),
        "page": page,
        "limit": limit,
    }


@router.get("/{product_id}", response_model=dict)
async def get_product(product_id: str):
    """Get a single product by ID."""
    db = get_db()
    response = db.table("products").select(
        "*, artisans(*, users(name, email, phone))"
    ).eq("product_id", product_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Product not found")

    product = response.data[0]
    # Flatten artisan name
    artisan_data = product.get("artisans") or {}
    user_data = artisan_data.pop("users", {}) or {}
    artisan_data["name"] = user_data.get("name", "Unknown Artisan")
    artisan_data["email"] = user_data.get("email", "")
    artisan_data["phone"] = user_data.get("phone", "")
    product["artisans"] = artisan_data

    return {"product": product}


@router.post("/", response_model=dict)
async def create_product(product: ProductCreate):
    """Create a new product listing (draft)."""
    db = get_db()
    
    # Resolve artisan_id from user_id if needed
    artisan_id_to_use = product.artisan_id
    artisan_check = db.table("artisans").select("artisan_id").eq("artisan_id", artisan_id_to_use).execute()
    if not artisan_check.data:
        # Check if the id provided is actually a user_id
        user_check = db.table("artisans").select("artisan_id").eq("user_id", artisan_id_to_use).execute()
        if user_check.data:
            artisan_id_to_use = user_check.data[0]["artisan_id"]
        else:
            raise HTTPException(status_code=400, detail="Artisan profile not found for this user.")

    product_id = str(uuid.uuid4())
    response = db.table("products").insert({
        "product_id": product_id,
        "artisan_id": artisan_id_to_use,
        "price": product.price,
        "image_url": product.image_url or "",
        "audio_url": product.audio_url,
        "title": "Untitled Draft",
        "description": "Pending AI generation",
        "category": "General",
        "status": "draft",
        "is_published": False,
        "is_available": True,
        "is_flagged": False,
        "ai_generated": False,
        "stock_quantity": 1,
        "currency": "INR",
        "language": "en",
    }).execute()

    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create product listing")

    return {
        "message": "Product creation successful",
        "product_id": response.data[0]["product_id"],
    }


@router.put("/{product_id}", response_model=dict)
async def update_product(product_id: str, product: ProductUpdate):
    """Update an existing product (e.g. after AI generation or manual edit)."""
    db = get_db()
    response = (
        db.table("products")
        .update(product.dict(exclude_unset=True))
        .eq("product_id", product_id)
        .execute()
    )
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to update product")
    return {"message": "Product updated successfully", "product": response.data[0]}


@router.post("/{product_id}/generate", response_model=dict)
async def generate_ai_content(product_id: str):
    """
    Trigger the full AI pipeline:
    1. Speech-to-text (if audio_url present)
    2. Image analysis (if image_url present)
    3. Content generation using transcription + image analysis
    4. Update product with generated content
    """
    db = get_db()

    # 1. Fetch product data
    product_res = (
        db.table("products")
        .select("*")
        .eq("product_id", product_id)
        .execute()
    )
    if not product_res.data:
        raise HTTPException(status_code=404, detail="Product not found")

    product = product_res.data[0]

    # 2. Speech-to-Text — transcribe the voice recording
    transcription = ""
    if product.get("audio_url"):
        try:
            transcription = await transcribe_audio(product["audio_url"])
        except Exception as e:
            print(f"[AI] Speech-to-text failed: {e}")
            transcription = ""

    # 3. Image Analysis — extract visual metadata
    image_analysis = None
    if product.get("image_url"):
        try:
            image_analysis = await analyze_image(product["image_url"])
        except Exception as e:
            print(f"[AI] Image analysis failed: {e}")
            image_analysis = None

    # 4. Content Generation — create title, description, cultural story, tags
    raw_text = transcription or "A handmade Indian craft product"
    ai_content = await generate_product_content(raw_text, image_analysis)

    # 5. Update product with AI-generated fields
    update_data = {
        "title": ai_content.get("title", "Untitled"),
        "description": ai_content.get("full_description") or ai_content.get("short_description", ""),
        "cultural_story": ai_content.get("cultural_story", ""),
        "category": ai_content.get("category", "General"),
        "tags": ai_content.get("tags", []),
        "seo_keywords": ai_content.get("seo_keywords", []),
        "raw_voice_text": transcription,
        "ai_generated": True,
    }

    update_res = (
        db.table("products")
        .update(update_data)
        .eq("product_id", product_id)
        .execute()
    )

    return {
        "message": "AI generation successful",
        "product": update_res.data[0] if update_res.data else None,
    }


@router.post("/{product_id}/publish", response_model=dict)
async def publish_product(product_id: str):
    """Publish a draft product to the marketplace."""
    db = get_db()
    response = (
        db.table("products")
        .update({"status": "published", "is_published": True})
        .eq("product_id", product_id)
        .execute()
    )
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to publish product")
    return {"message": "Product published successfully", "product": response.data[0]}
