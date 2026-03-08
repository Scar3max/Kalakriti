import os
import sys
from dotenv import load_dotenv
from supabase import create_client, Client
import uuid

load_dotenv()
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

supabase: Client = create_client(url, key)

product_id = str(uuid.uuid4())
try:
    response = supabase.table("products").insert({
        "product_id": product_id,
        "artisan_id": "7454de05-b46e-4e0c-b6dc-88ba93f69f08",
        "price": 500,
        "image_url": "",
        "audio_url": "",
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
        "language": "en"
    }).execute()
    print("Success:", response.data)
except Exception as e:
    import traceback
    traceback.print_exc()
