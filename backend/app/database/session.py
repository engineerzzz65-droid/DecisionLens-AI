from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings
import time

# Connection pool settings for stability
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,  # Check connection before using
    pool_recycle=3600,   # Recycle connections every hour
    pool_size=5,
    max_overflow=10,
    echo=True,  # Set to False in production
    connect_args={
        'connect_timeout': 60,
        'read_timeout': 60,
        'write_timeout': 60,
    }
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """Get database session with retry logic"""
    max_retries = 3
    retry_delay = 2
    
    for attempt in range(max_retries):
        try:
            db = SessionLocal()
            # Test connection
            db.execute("SELECT 1")
            return db
        except Exception as e:
            if attempt < max_retries - 1:
                time.sleep(retry_delay)
                continue
            raise e