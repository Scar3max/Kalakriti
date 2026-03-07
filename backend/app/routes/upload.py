"""
Upload routes — handles image and audio file uploads to Cloudinary.
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.cloudinary_service import upload_image as srv_upload_image, upload_audio as srv_upload_audio

router = APIRouter()


@router.post("/image", response_model=dict)
async def upload_image(file: UploadFile = File(...)):
    """Upload a product image to Cloudinary."""
    allowed_types = ["image/jpeg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(allowed_types)}",
        )
    
    file_bytes = await file.read()
    url = await srv_upload_image(file_bytes, file.filename)
    
    return {"message": "Image uploaded successfully", "url": url}


@router.post("/audio", response_model=dict)
async def upload_audio(file: UploadFile = File(...)):
    """Upload a voice recording to Cloudinary."""
    allowed_types = ["audio/wav", "audio/mpeg", "audio/webm", "audio/ogg", "audio/mp4"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(allowed_types)}",
        )
        
    file_bytes = await file.read()
    url = await srv_upload_audio(file_bytes, file.filename)
    
    return {"message": "Audio uploaded successfully", "url": url}
