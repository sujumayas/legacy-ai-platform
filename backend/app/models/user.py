from datetime import datetime
from typing import Optional, List

class User:
    def __init__(
        self,
        id: str,
        github_id: int,
        email: str,
        username: str,
        role: str = 'developer',
        access_token: Optional[str] = None,
        created_at: Optional[datetime] = None,
    ):
        self.id = id
        self.github_id = github_id
        self.email = email
        self.username = username
        self.role = role
        self.access_token = access_token
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'username': self.username,
            'role': self.role,
            'created_at': self.created_at.isoformat(),
        }