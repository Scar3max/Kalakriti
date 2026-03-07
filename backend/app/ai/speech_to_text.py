"""
Speech to Text service — converts artisan voice recordings to text.
Supports Groq Whisper, OpenAI Whisper, or AssemblyAI.
"""

import os
import tempfile
import httpx
from groq import AsyncGroq

async def transcribe_audio(audio_url: str) -> str:
    """Transcribe a voice recording from its URL and return raw text."""
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY environment variable is not set.")
    
    client = AsyncGroq(api_key=api_key)
    
    # Download the audio file temporarily
    async with httpx.AsyncClient() as http_client:
        response = await http_client.get(audio_url)
        response.raise_for_status()
        
    # Whisper requires a filename with a supported extension
    # Using .m4a as it's a common output from media recorders
    with tempfile.NamedTemporaryFile(delete=False, suffix=".m4a") as tmp_file:
        tmp_file.write(response.content)
        tmp_file_path = tmp_file.name
        
    try:
        with open(tmp_file_path, "rb") as audio_file:
            transcription = await client.audio.transcriptions.create(
                model="whisper-large-v3", 
                file=audio_file
            )
        return transcription.text
    finally:
        os.remove(tmp_file_path)
