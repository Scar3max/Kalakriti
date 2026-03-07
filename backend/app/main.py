"""
Kala-Kriti FastAPI Backend — Main Entry Point

Registers all route modules, configures CORS, and exposes the
/health endpoint for uptime checks.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import auth, products, artisans, orders, upload

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.API_VERSION,
    description="AI-Driven Digital Marketplace for Indian Artisans",
)

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Register API Routes ---
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(artisans.router, prefix="/api/artisans", tags=["Artisans"])
app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])
app.include_router(upload.router, prefix="/api/upload", tags=["Upload"])


@app.get("/", tags=["Health"])
async def root():
    """Root health-check endpoint."""
    return {
        "service": settings.APP_NAME,
        "version": settings.API_VERSION,
        "status": "running",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """Detailed health-check endpoint."""
    return {"status": "healthy", "service": settings.APP_NAME}
