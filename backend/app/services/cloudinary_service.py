"""
Cloudinary upload service — handles image and audio uploads.
"""

import os
import cloudinary
import cloudinary.uploader
from fastapi import HTTPException

# Configure cloudinary using env variables
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)


async def upload_image(file_bytes: bytes, filename: str) -> str:
    """Upload image to Cloudinary and return the URL."""
    try:
        response = cloudinary.uploader.upload(
            file_bytes,
            resource_type="image",
            folder="kalakriti/images"
        )
        return response.get("secure_url")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")


async def upload_audio(file_bytes: bytes, filename: str) -> str:
    """Upload audio to Cloudinary and return the URL."""
    try:
        response = cloudinary.uploader.upload(
            file_bytes,
            resource_type="video", # Cloudinary uses "video" for audio files
            folder="kalakriti/audio"
        )
        return response.get("secure_url")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Audio upload failed: {str(e)}")
