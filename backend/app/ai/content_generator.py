"""
Content Generator — uses LLM to generate product listing content.
Produces: title, description, cultural story, tags.
"""

import os
import json
from groq import AsyncGroq

async def generate_product_content(
    raw_text: str, image_analysis: dict | None = None
) -> dict:
    """
    Generate structured product content from raw transcription text.
    
    Returns:
        dict with keys: title, short_description, full_description,
        cultural_story, category, tags, seo_keywords
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY environment variable is not set.")
        
    client = AsyncGroq(api_key=api_key)
    
    # Construct context context
    context = f'Here is the artisan\'s voice transcription about their product:\n"{raw_text}"'
    
    if image_analysis:
        context += f"\n\nHere is some visual analysis of the product:\n{json.dumps(image_analysis, indent=2)}"
        
    prompt = (
        "You are an expert copywriter for an e-commerce platform that sells authentic Indian handmade crafts. "
        "Based on the provided information, generate compelling product listing content. "
        "Output the response in JSON format strictly adhering to these keys:\n"
        "- title (string): Catchy, SEO-friendly product title\n"
        "- short_description (string): A 1-2 sentence quick summary\n"
        "- full_description (string): Detailed product description highlighting features, dimensions, etc.\n"
        "- cultural_story (string): The cultural background, artisan story, or heritage behind the craft\n"
        "- category (string): The main product category\n"
        "- tags (list of strings): 5-10 relevant tags\n"
        "- seo_keywords (list of strings): 5-10 keywords for search optimization\n"
    )

    response = await client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": prompt},
            {"role": "user", "content": context}
        ],
        response_format={ "type": "json_object" },
        max_tokens=1000,
        temperature=0.7
    )
    
    content = response.choices[0].message.content
    if not content:
        return {}
        
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        return {}
