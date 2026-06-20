from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import logging

from app.config import settings
from app.api.routes import decisions, chat, simulation, report

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============================================
# IMPORTANT: Tables are created manually
# DO NOT uncomment the lines below
# ============================================
# from app.database.session import engine, Base
# Base.metadata.create_all(bind=engine)

logger.info("✅ Using manually created database tables")
logger.info("   Tables should exist in the database")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    debug=settings.DEBUG
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["localhost", "127.0.0.1"]
)

# Include routers
app.include_router(decisions.router, prefix="/api/decisions", tags=["decisions"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(simulation.router, prefix="/api/simulation", tags=["simulation"])
app.include_router(report.router, prefix="/api/report", tags=["report"])

@app.get("/")
async def root():
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "operational",
        "database": "manual_tables"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "tables": "manual"
    }

@app.get("/api/verify-tables")
async def verify_tables():
    """Verify that all required tables exist"""
    from app.database.session import SessionLocal
    from sqlalchemy import text
    
    try:
        db = SessionLocal()
        tables_to_check = ['users', 'decisions', 'decision_context', 'scenarios', 'tradeoffs', 'sessions']
        existing_tables = []
        
        for table in tables_to_check:
            try:
                result = db.execute(text(f"SHOW TABLES LIKE '{table}'"))
                if result.fetchone():
                    existing_tables.append(table)
            except:
                pass
        
        missing_tables = [t for t in tables_to_check if t not in existing_tables]
        
        return {
            "status": "success",
            "existing_tables": existing_tables,
            "missing_tables": missing_tables,
            "all_present": len(missing_tables) == 0
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
    finally:
        db.close()