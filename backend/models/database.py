from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os

Base = declarative_base()

# Database path
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'database', 'brainmap.db')
engine = create_engine(f'sqlite:///{DB_PATH}')
Session = sessionmaker(bind=engine)

class Project(Base):
    __tablename__ = 'projects'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    mindmaps = relationship('MindMap', back_populates='project', cascade='all, delete-orphan')

class MindMap(Base):
    __tablename__ = 'mindmaps'

    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey('projects.id'), nullable=False)
    name = Column(String(100), nullable=False)
    data = Column(Text, nullable=False)  # JSON string of nodes and edges
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    project = relationship('Project', back_populates='mindmaps')

def init_db():
    """Initialize the database and create tables"""
    Base.metadata.create_all(engine)

def get_session():
    """Get a new database session"""
    return Session()
