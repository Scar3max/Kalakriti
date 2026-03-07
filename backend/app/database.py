"""
Supabase client initializer.
The client is created once and reused across the application.
"""

from supabase import create_client, Client
from app.config import settings


def get_supabase_client() -> Client:
    """Create and return a Supabase client instance."""
    if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
        raise ValueError(
            "Supabase credentials not configured. "
            "Set SUPABASE_URL and SUPABASE_KEY in your .env file."
        )
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)


# Lazy-initialized client — will be set on first use
_supabase_client: Client | None = None


def get_db() -> Client:
    """Get the singleton Supabase client."""
    global _supabase_client
    if _supabase_client is None:
        _supabase_client = get_supabase_client()
    return _supabase_client
