import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("DATABASE_URL not found in .env")
    exit(1)

SQL = """
-- Create Artisans Table
CREATE TABLE IF NOT EXISTS public.artisans (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    craft_type TEXT,
    bio TEXT,
    rating NUMERIC DEFAULT 0.0,
    verification_status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artisan_id UUID REFERENCES public.artisans(id) ON DELETE CASCADE,
    title TEXT,
    short_description TEXT,
    full_description TEXT,
    cultural_story TEXT,
    price NUMERIC NOT NULL,
    image_url TEXT,
    audio_url TEXT,
    category TEXT,
    tags TEXT[],
    status TEXT DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    buyer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
"""

def init_db():
    print("Connecting to Supabase Database...")
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        print("Executing table creation queries...")
        cur.execute(SQL)
        conn.commit()
        cur.close()
        conn.close()
        print("Tables created successfully!")
    except Exception as e:
        print("Error creating tables:", e)

if __name__ == "__main__":
    init_db()
