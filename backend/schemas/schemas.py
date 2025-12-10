"""
Pydantic Schemas for Request/Response validation
"""

from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

# ===== USER SCHEMAS =====
class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# ===== PRAYER SCHEMAS =====
class PrayerBase(BaseModel):
    name: str
    category: str
    request: str

class PrayerCreate(PrayerBase):
    pass

class PrayerResponse(PrayerBase):
    id: int
    pray_count: int
    is_approved: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class PrayerList(BaseModel):
    prayers: List[PrayerResponse]
    total: int

# ===== FORUM SCHEMAS =====
class ForumThreadBase(BaseModel):
    author_name: str
    category: str
    title: str
    content: str

class ForumThreadCreate(ForumThreadBase):
    pass

class ForumReplyBase(BaseModel):
    author_name: str
    content: str

class ForumReplyCreate(ForumReplyBase):
    pass

class ForumReplyResponse(ForumReplyBase):
    id: int
    thread_id: int
    likes: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class ForumThreadResponse(ForumThreadBase):
    id: int
    views: int
    likes: int
    is_pinned: bool
    is_locked: bool
    created_at: datetime
    reply_count: int = 0
    
    class Config:
        from_attributes = True

class ForumThreadDetail(ForumThreadResponse):
    replies: List[ForumReplyResponse] = []

class ForumThreadList(BaseModel):
    threads: List[ForumThreadResponse]
    total: int

# ===== AUTH SCHEMAS =====
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class LoginRequest(BaseModel):
    username: str
    password: str
