"""
Vision For Israel - FastAPI Backend
Main application entry point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import database
from database import engine, Base

# Import routers
from routers import prayers, forum, auth

# Create database tables
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Starting Vision For Israel API...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created")
    yield
    # Shutdown
    print("👋 Shutting down API...")

# Initialize FastAPI app
app = FastAPI(
    title="Vision For Israel API",
    description="Backend API for Vision For Israel website - Supporting Israel and sharing God's love",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
origins = os.getenv("CORS_ORIGINS", "http://localhost:8000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(prayers.router, prefix="/api/prayers", tags=["Prayer Wall"])
app.include_router(forum.router, prefix="/api/forum", tags=["Forum"])

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "🇮🇱 Vision For Israel API",
        "status": "online",
        "version": "1.0.0",
        "endpoints": {
            "prayers": "/api/prayers",
            "forum": "/api/forum",
            "auth": "/api/auth"
        }
    }

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
