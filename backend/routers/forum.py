"""
Forum API Router
Endpoints for managing forum threads and replies
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from database import get_db
from models.models import ForumThread, ForumReply
from schemas.schemas import (
    ForumThreadCreate, ForumThreadResponse, ForumThreadDetail, ForumThreadList,
    ForumReplyCreate, ForumReplyResponse
)

router = APIRouter()

# ===== THREAD ENDPOINTS =====

@router.post("/threads", response_model=ForumThreadResponse, status_code=201)
def create_thread(thread: ForumThreadCreate, db: Session = Depends(get_db)):
    """Create a new forum thread"""
    db_thread = ForumThread(
        author_name=thread.author_name,
        category=thread.category,
        title=thread.title,
        content=thread.content,
        views=0,
        likes=0
    )
    db.add(db_thread)
    db.commit()
    db.refresh(db_thread)
    
    # Add reply_count
    db_thread.reply_count = 0
    
    return db_thread

@router.get("/threads", response_model=ForumThreadList)
def get_threads(
    category: str = Query(None, description="Filter by category"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """Get all forum threads with optional category filter"""
    query = db.query(
        ForumThread,
        func.count(ForumReply.id).label("reply_count")
    ).outerjoin(ForumReply, ForumThread.id == ForumReply.thread_id).group_by(ForumThread.id)
    
    if category:
        query = query.filter(ForumThread.category == category)
    
    # Get total count
    total = query.count()
    
    # Order by pinned first, then by creation date
    results = query.order_by(
        ForumThread.is_pinned.desc(),
        ForumThread.created_at.desc()
    ).offset(offset).limit(limit).all()
    
    # Format threads with reply count
    threads = []
    for thread, reply_count in results:
        thread_dict = {
            "id": thread.id,
            "author_name": thread.author_name,
            "category": thread.category,
            "title": thread.title,
            "content": thread.content,
            "views": thread.views,
            "likes": thread.likes,
            "is_pinned": thread.is_pinned,
            "is_locked": thread.is_locked,
            "created_at": thread.created_at,
            "reply_count": reply_count
        }
        threads.append(ForumThreadResponse(**thread_dict))
    
    return {"threads": threads, "total": total}

@router.get("/threads/{thread_id}", response_model=ForumThreadDetail)
def get_thread(thread_id: int, db: Session = Depends(get_db)):
    """Get a specific thread with all replies"""
    thread = db.query(ForumThread).filter(ForumThread.id == thread_id).first()
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")
    
    # Increment view count
    thread.views += 1
    db.commit()
    
    # Get replies
    replies = db.query(ForumReply).filter(ForumReply.thread_id == thread_id).order_by(ForumReply.created_at.asc()).all()
    
    # Format response
    thread_dict = {
        "id": thread.id,
        "author_name": thread.author_name,
        "category": thread.category,
        "title": thread.title,
        "content": thread.content,
        "views": thread.views,
        "likes": thread.likes,
        "is_pinned": thread.is_pinned,
        "is_locked": thread.is_locked,
        "created_at": thread.created_at,
        "reply_count": len(replies),
        "replies": replies
    }
    
    return ForumThreadDetail(**thread_dict)

@router.post("/threads/{thread_id}/like")
def like_thread(thread_id: int, db: Session = Depends(get_db)):
    """Increment the like count for a thread"""
    thread = db.query(ForumThread).filter(ForumThread.id == thread_id).first()
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")
    
    thread.likes += 1
    db.commit()
    
    return {"message": "❤️ Thread liked", "likes": thread.likes}

@router.delete("/threads/{thread_id}")
def delete_thread(thread_id: int, db: Session = Depends(get_db)):
    """Delete a thread (admin only - TODO: add auth)"""
    thread = db.query(ForumThread).filter(ForumThread.id == thread_id).first()
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")
    
    db.delete(thread)
    db.commit()
    
    return {"message": "Thread deleted successfully"}

# ===== REPLY ENDPOINTS =====

@router.post("/threads/{thread_id}/replies", response_model=ForumReplyResponse, status_code=201)
def create_reply(thread_id: int, reply: ForumReplyCreate, db: Session = Depends(get_db)):
    """Create a new reply to a thread"""
    # Check if thread exists
    thread = db.query(ForumThread).filter(ForumThread.id == thread_id).first()
    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")
    
    if thread.is_locked:
        raise HTTPException(status_code=403, detail="Thread is locked")
    
    db_reply = ForumReply(
        thread_id=thread_id,
        author_name=reply.author_name,
        content=reply.content,
        likes=0
    )
    db.add(db_reply)
    db.commit()
    db.refresh(db_reply)
    
    return db_reply

@router.post("/replies/{reply_id}/like")
def like_reply(reply_id: int, db: Session = Depends(get_db)):
    """Increment the like count for a reply"""
    reply = db.query(ForumReply).filter(ForumReply.id == reply_id).first()
    if not reply:
        raise HTTPException(status_code=404, detail="Reply not found")
    
    reply.likes += 1
    db.commit()
    
    return {"message": "❤️ Reply liked", "likes": reply.likes}

@router.delete("/replies/{reply_id}")
def delete_reply(reply_id: int, db: Session = Depends(get_db)):
    """Delete a reply (admin only - TODO: add auth)"""
    reply = db.query(ForumReply).filter(ForumReply.id == reply_id).first()
    if not reply:
        raise HTTPException(status_code=404, detail="Reply not found")
    
    db.delete(reply)
    db.commit()
    
    return {"message": "Reply deleted successfully"}
