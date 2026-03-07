# Kala-Kriti Backend

AI-Driven Digital Marketplace for Indian Artisans — Backend API.

## Tech Stack
- **Framework**: FastAPI
- **Database**: Supabase PostgreSQL
- **Storage**: Cloudinary
- **AI**: Configurable (Groq / OpenAI / Gemini)

## Setup

```bash
# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file with your credentials
cp .env.example .env

# Run development server
uvicorn app.main:app --reload --port 8000
```

## API Documentation
Once running, visit: `http://localhost:8000/docs`

## Project Structure
```
backend/
├── app/
│   ├── main.py          # FastAPI entry point
│   ├── config.py        # Environment configuration
│   ├── database.py      # Supabase client
│   ├── models/          # Pydantic data models
│   ├── schemas/         # Request/response schemas
│   ├── routes/          # API endpoint handlers
│   ├── services/        # Business logic
│   ├── ai/              # AI pipeline (STT, LLM, Vision)
│   └── utils/           # Shared utilities
├── requirements.txt
└── README.md
```
