from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
from .database import Base
import enum

class RepositoryStatus(enum.Enum):
    CONNECTING = 'connecting'
    READY = 'ready'
    ANALYZING = 'analyzing'
    ERROR = 'error'

class Repository(Base):
    __tablename__ = "repositories"

    id = Column(Integer, primary_key=True, index=True)
    github_url = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    owner = Column(String, nullable=False, index=True)
    default_branch = Column(String, nullable=False)
    status = Column(
        Enum(RepositoryStatus),
        nullable=False,
        default=RepositoryStatus.CONNECTING
    )
    last_analyzed = Column(DateTime, nullable=True)
    error_message = Column(String, nullable=True)
    created_at = Column(
        DateTime,
        nullable=False,
        server_default=func.now()
    )
    updated_at = Column(
        DateTime,
        nullable=False,
        server_default=func.now(),
        onupdate=func.now()
    )
    
    # Foreign key to user with cascade delete
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    user = relationship("User", back_populates="repositories")

    def to_dict(self):
        return {
            "id": self.id,
            "github_url": self.github_url,
            "name": self.name,
            "owner": self.owner,
            "default_branch": self.default_branch,
            "status": self.status.value,
            "last_analyzed": self.last_analyzed.isoformat() if self.last_analyzed else None,
            "error_message": self.error_message,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "user_id": self.user_id
        }
    
    @classmethod
    def get_by_url(cls, db, github_url):
        return db.query(cls).filter(cls.github_url == github_url).first()

    @classmethod
    def get_by_user(cls, db, user_id, status=None):
        query = db.query(cls).filter(cls.user_id == user_id)
        if status:
            query = query.filter(cls.status == status)
        return query.all()
