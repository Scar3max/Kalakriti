"""
Product routes — CRUD operations + AI content generation trigger.
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.models.product import ProductCreate, ProductUpdate, ProductResponse
from app.database import get_db
from app.ai.content_generator import generate_product_content

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
    
    # By default only fetch published products
    query = db.table("products").select("*, artisans(*)").eq("status", "published")

    if category:
        query = query.eq("category", category)
    if search:
        query = query.ilike("title", f"%{search}%")

    # Pagination calculation
    offset = (page - 1) * limit
    
    response = query.range(offset, offset + limit - 1).execute()
    
    return {
        "products": response.data,
        "total": len(response.data), # For MVP simplicity
        "page": page,
        "limit": limit,
    }


@router.get("/{product_id}", response_model=dict)
async def get_product(product_id: str):
    """Get a single product by ID."""
    db = get_db()
    response = db.table("products").select("*, artisans(*)").eq("id", product_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"product": response.data[0]}


@router.post("/", response_model=dict)
async def create_product(product: ProductCreate):
    """Create a new product listing (draft)."""
    db = get_db()
    response = db.table("products").insert({
        "artisan_id": product.artisan_id,
        "price": product.price,
        "image_url": product.image_url,
        "audio_url": product.audio_url,
        "status": "draft"
    }).execute()
    
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create product list")
        
    return {"message": "Product creation successful", "product_id": response.data[0]["id"]}


@router.put("/{product_id}", response_model=dict)
async def update_product(product_id: str, product: ProductUpdate):
    """Update an existing product (e.g. after AI generation or manual edit)."""
    db = get_db()
    response = db.table("products").update(product.dict(exclude_unset=True)).eq("id", product_id).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to update product")
    return {"message": "Product updated successfully", "product": response.data[0]}


@router.post("/{product_id}/generate", response_model=dict)
async def generate_ai_content(product_id: str):
    """Trigger AI pipeline to generate title, description, story, and tags."""
    db = get_db()
    
    # 1. Fetch product data (must include image_url and/or audio_url)
    product_res = db.table("products").select("*").eq("id", product_id).execute()
    if not product_res.data:
        raise HTTPException(status_code=404, detail="Product not found")
        
    product = product_res.data[0]
    
    # 2. Invoke AI Pipeline
    # Using dummy values for now until STT and CV actually feed the content generator
    # For a real integration we would first pass audio->whisper and image->vision
    # then combine results into a text prompt.
    base_info = f"Product Image URL: {product.get('image_url', 'N/A')} and Audio Transcription: (pending)"
    ai_content = await generate_product_content(base_info)
    
    # 3. Update Product with AI generated fields
    update_data = {
        "title": ai_content.get("title"),
        "short_description": ai_content.get("short_description"),
        "full_description": ai_content.get("full_description"),
        "cultural_story": ai_content.get("cultural_story"),
        "category": ai_content.get("category"),
        "tags": ai_content.get("tags")
    }
    
    update_res = db.table("products").update(update_data).eq("id", product_id).execute()
    
    return {
        "message": "AI generation successful",
        "product": update_res.data[0] if update_res.data else None
    }


@router.post("/{product_id}/publish", response_model=dict)
async def publish_product(product_id: str):
    """Publish a draft product to the marketplace."""
    db = get_db()
    response = db.table("products").update({"status": "published"}).eq("id", product_id).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to publish product")
    return {"message": "Product published successfully", "product": response.data[0]}
