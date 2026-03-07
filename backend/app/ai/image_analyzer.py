"""
Image Analyzer — detects product category, material, colors, and craft type
from product images. Uses vision AI models.
"""

import os
import json
from groq import AsyncGroq

async def analyze_image(image_url: str) -> dict:
    """
    Analyze a product image and extract structured metadata.
    
    Returns:
        dict with keys: category, material, colors, craft_type, tags, seo_keywords
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY environment variable is not set.")
        
    client = AsyncGroq(api_key=api_key)
    
    prompt = (
        "Analyze this product image and extract the following details in JSON format. "
        "The JSON MUST have these exact keys: "
        "'category' (string), 'material' (string), 'colors' (list of strings), "
        "'craft_type' (string), 'tags' (list of strings), 'seo_keywords' (list of strings)."
    )
    
    response = await client.chat.completions.create(
        model="llama-3.2-90b-vision-preview",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": image_url,
                        },
                    },
                ],
            }
        ],
        response_format={ "type": "json_object" },
        max_tokens=500,
    )
    
    content = response.choices[0].message.content
    if not content:
        return {}
    
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        return {}
