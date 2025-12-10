# Vision For Israel - Backend Setup Guide

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- PostgreSQL 15+
- Docker & Docker Compose (optional)

### Local Development Setup

1. **Create Python Virtual Environment**
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
```

2. **Install Dependencies**
```powershell
pip install -r requirements.txt
```

3. **Configure Environment**
```powershell
cp .env.example .env
# Edit .env with your database credentials
```

4. **Start PostgreSQL**
```powershell
# If using Docker:
docker run --name vfi-postgres -e POSTGRES_USER=vfi_user -e POSTGRES_PASSWORD=vfi_password -e POSTGRES_DB=vfi_db -p 5432:5432 -d postgres:15-alpine
```

5. **Run the API**
```powershell
python main.py
```

API will be available at: **http://localhost:8080**

### Docker Setup (Recommended for Production)

1. **Build and Start All Services**
```powershell
docker-compose up --build
```

This will start:
- PostgreSQL database (port 5432)
- FastAPI backend (port 8080)
- Nginx web server (port 80)

2. **Access the Application**
- Website: http://localhost
- API: http://localhost/api
- API Docs: http://localhost:8080/docs

### API Endpoints

#### Prayer Wall
- `POST /api/prayers` - Create prayer request
- `GET /api/prayers` - Get all prayers
- `POST /api/prayers/{id}/pray` - Increment pray count
- `GET /api/prayers/{id}` - Get specific prayer

#### Forum
- `POST /api/forum/threads` - Create thread
- `GET /api/forum/threads` - Get all threads
- `GET /api/forum/threads/{id}` - Get thread with replies
- `POST /api/forum/threads/{id}/replies` - Create reply
- `POST /api/forum/threads/{id}/like` - Like thread

#### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Database Schema

**Users Table:**
- id, username, email, hashed_password, full_name, is_active, is_admin, created_at

**Prayers Table:**
- id, user_id, name, category, request, pray_count, is_approved, created_at, updated_at

**Forum Threads Table:**
- id, user_id, author_name, category, title, content, views, likes, is_pinned, is_locked, created_at, updated_at

**Forum Replies Table:**
- id, thread_id, user_id, author_name, content, likes, created_at, updated_at

### Frontend Integration

Update JavaScript files to use API:

```javascript
// Example: Create prayer
async function submitPrayer(name, category, request) {
    const response = await fetch('http://localhost:8080/api/prayers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, category, request })
    });
    return await response.json();
}

// Example: Get prayers
async function getPrayers(category = null) {
    const url = category 
        ? `http://localhost:8080/api/prayers?category=${category}`
        : 'http://localhost:8080/api/prayers';
    const response = await fetch(url);
    return await response.json();
}
```

### Next Steps

1. ✅ Backend API created
2. ✅ Database models defined
3. ✅ Docker configuration ready
4. ⏳ Update frontend JavaScript to use API instead of localStorage
5. ⏳ Deploy to production server
6. ⏳ Add user authentication to frontend
7. ⏳ Implement admin dashboard

## 🔧 Development Commands

```powershell
# Start API in development mode
uvicorn main:app --reload --host 0.0.0.0 --port 8080

# Create database migration
alembic revision --autogenerate -m "description"

# Run migrations
alembic upgrade head

# View API documentation
# Open browser: http://localhost:8080/docs

# Stop Docker containers
docker-compose down

# View logs
docker-compose logs -f api
```

## 🛠️ Troubleshooting

**Database connection error:**
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Ensure firewall allows port 5432

**CORS errors:**
- Add your frontend URL to CORS_ORIGINS in .env
- Restart API after changes

**Import errors:**
- Ensure virtual environment is activated
- Run `pip install -r requirements.txt` again

## 📚 Resources

- FastAPI Docs: https://fastapi.tiangolo.com/
- SQLAlchemy: https://docs.sqlalchemy.org/
- PostgreSQL: https://www.postgresql.org/docs/
- Docker: https://docs.docker.com/

---
🇮🇱 **Vision For Israel** - Supporting Israel and sharing God's love
