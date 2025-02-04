from flask import Blueprint, request, jsonify, current_app
from ..services.auth import get_github_user, require_auth
from ..models.user import User
import jwt
from datetime import datetime, timedelta

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@bp.route('/verify', methods=['POST'])
def verify_token():
    data = request.get_json()
    github_token = data.get('github_token')

    if not github_token:
        return jsonify({'message': 'Missing GitHub token'}), 400

    # Get user info from GitHub
    github_user = get_github_user(github_token)
    if not github_user:
        return jsonify({'message': 'Invalid GitHub token'}), 401

    # Create or update user
    # In a real app, you'd store this in a database
    user = User(
        id=str(github_user['id']),
        github_id=github_user['id'],
        email=github_user.get('email', ''),
        username=github_user['login'],
        access_token=github_token
    )

    # Create JWT token
    token = jwt.encode(
        {
            'user_id': user.id,
            'username': user.username,
            'role': user.role,
            'exp': datetime.utcnow() + timedelta(days=1)
        },
        current_app.config['SECRET_KEY'],
        algorithm='HS256'
    )

    return jsonify({
        'token': token,
        'user': user.to_dict()
    })

@bp.route('/me', methods=['GET'])
@require_auth
def me():
    # In a real app, you'd fetch the user from the database
    return jsonify({'user': g.user})