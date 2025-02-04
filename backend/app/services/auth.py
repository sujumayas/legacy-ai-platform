from typing import Optional
from functools import wraps
from flask import request, jsonify, current_app, g
import jwt
import requests

def get_github_user(access_token: str) -> Optional[dict]:
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Accept': 'application/json',
    }
    response = requests.get('https://api.github.com/user', headers=headers)
    if response.status_code == 200:
        return response.json()
    return None

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'message': 'Missing authorization header'}), 401

        try:
            # Extract token from 'Bearer <token>'
            token = auth_header.split(' ')[1]
            # Verify token
            payload = jwt.decode(
                token,
                current_app.config['SECRET_KEY'],
                algorithms=['HS256']
            )
            g.user = payload
        except (jwt.InvalidTokenError, IndexError):
            return jsonify({'message': 'Invalid token'}), 401

        return f(*args, **kwargs)
    return decorated

def require_role(role):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if not g.user or g.user.get('role') != role:
                return jsonify({'message': 'Insufficient permissions'}), 403
            return f(*args, **kwargs)
        return decorated
    return decorator