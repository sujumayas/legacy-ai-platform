from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Repository(Base):
    __tablename__ = "repositories"

    id = Column(Integer, primary_key=True, index=True)
    github_url = Column(String, unique=True, index=True)
    name = Column(String)
    owner = Column(String)
    default_branch = Column(String)
    status = Column(String)  # 'connecting', 'ready', 'analyzing', 'error'
    last_analyzed = Column(DateTime, nullable=True)
    error_message = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Foreign key to user
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="repositories")

    def to_dict(self):
        return {
            "id": self.id,
            "github_url": self.github_url,
            "name": self.name,
            "owner": self.owner,
            "default_branch": self.default_branch,
            "status": self.status,
            "last_analyzed": self.last_analyzed.isoformat() if self.last_analyzed else None,
            "error_message": self.error_message,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }