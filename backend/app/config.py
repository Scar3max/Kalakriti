"""
Application configuration — loads environment variables and provides
centralized config for all services (Supabase, Cloudinary, AI APIs).
"""

import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Central settings class. All values sourced from .env file."""

    # --- Application ---
    APP_NAME: str = "Kala-Kriti API"
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"
    API_VERSION: str = "v1"
    CORS_ORIGINS: list[str] = os.getenv(
        "CORS_ORIGINS", "http://localhost:3000"
    ).split(",")

    # --- Supabase ---
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")

    # --- Cloudinary ---
    CLOUDINARY_CLOUD_NAME: str = os.getenv("CLOUDINARY_CLOUD_NAME", "")
    CLOUDINARY_API_KEY: str = os.getenv("CLOUDINARY_API_KEY", "")
    CLOUDINARY_API_SECRET: str = os.getenv("CLOUDINARY_API_SECRET", "")

    # --- AI Services (Groq) ---
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    AI_API_KEY: str = os.getenv("AI_API_KEY", "")  # legacy alias
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "groq")  # groq | openai | gemini

    # --- Speech to Text ---
    STT_API_KEY: str = os.getenv("STT_API_KEY", "")
    STT_PROVIDER: str = os.getenv("STT_PROVIDER", "groq")  # groq | assemblyai


settings = Settings()
