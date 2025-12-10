"""
Prayer Wall API Router
Endpoints for managing prayer requests
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.models import Prayer
from schemas.schemas import PrayerCreate, PrayerResponse, PrayerList

router = APIRouter()

@router.post("/", response_model=PrayerResponse, status_code=201)
def create_prayer(prayer: PrayerCreate, db: Session = Depends(get_db)):
    """Create a new prayer request"""
    db_prayer = Prayer(
        name=prayer.name,
        category=prayer.category,
        request=prayer.request,
        pray_count=0
    )
    db.add(db_prayer)
    db.commit()
    db.refresh(db_prayer)
    return db_prayer

@router.get("/", response_model=PrayerList)
def get_prayers(
    category: str = Query(None, description="Filter by category"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """Get all approved prayers with optional category filter"""
    query = db.query(Prayer).filter(Prayer.is_approved == True)
    
    if category and category != "all":
        query = query.filter(Prayer.category == category)
    
    total = query.count()
    prayers = query.order_by(Prayer.created_at.desc()).offset(offset).limit(limit).all()
    
    return {"prayers": prayers, "total": total}

@router.get("/{prayer_id}", response_model=PrayerResponse)
def get_prayer(prayer_id: int, db: Session = Depends(get_db)):
    """Get a specific prayer by ID"""
    prayer = db.query(Prayer).filter(Prayer.id == prayer_id).first()
    if not prayer:
        raise HTTPException(status_code=404, detail="Prayer not found")
    return prayer

@router.post("/{prayer_id}/pray")
def pray_for_request(prayer_id: int, db: Session = Depends(get_db)):
    """Increment the pray count for a prayer request"""
    prayer = db.query(Prayer).filter(Prayer.id == prayer_id).first()
    if not prayer:
        raise HTTPException(status_code=404, detail="Prayer not found")
    
    prayer.pray_count += 1
    db.commit()
    db.refresh(prayer)
    
    return {"message": "🙏 Prayer count updated", "pray_count": prayer.pray_count}

@router.delete("/{prayer_id}")
def delete_prayer(prayer_id: int, db: Session = Depends(get_db)):
    """Delete a prayer request (admin only - TODO: add auth)"""
    prayer = db.query(Prayer).filter(Prayer.id == prayer_id).first()
    if not prayer:
        raise HTTPException(status_code=404, detail="Prayer not found")
    
    db.delete(prayer)
    db.commit()
    
    return {"message": "Prayer deleted successfully"}
