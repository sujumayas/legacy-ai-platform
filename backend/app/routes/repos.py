from flask import Blueprint, request, jsonify, g
from ..services.github_service import GitHubService
from ..models.database import get_db
from ..models.repository import Repository
from ..services.auth import require_auth
from sqlalchemy.orm import Session
from datetime import datetime

bp = Blueprint('repos', __name__, url_prefix='/api/repos')

@bp.route('/connect', methods=['POST'])
@require_auth
def connect_repo():
    data = request.get_json()
    if not data or 'github_url' not in data:
        return jsonify({'error': 'GitHub URL is required'}), 400

    github_url = data['github_url']
    db = next(get_db())

    try:
        # Check if repository already exists
        existing_repo = db.query(Repository).filter_by(github_url=github_url).first()
        if existing_repo:
            return jsonify({'error': 'Repository already connected'}), 400

        # Get repository info from GitHub
        github_service = GitHubService(g.user['access_token'])
        repo_info = github_service.get_repository_info(github_url)

        if not repo_info:
            return jsonify({'error': 'Unable to access repository'}), 400

        # Create new repository
        new_repo = Repository(
            github_url=repo_info['github_url'],
            name=repo_info['name'],
            owner=repo_info['owner'],
            default_branch=repo_info['default_branch'],
            status='ready',
            user_id=g.user['id']
        )

        db.add(new_repo)
        db.commit()
        db.refresh(new_repo)

        return jsonify(new_repo.to_dict()), 201

    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 500

@bp.route('/list', methods=['GET'])
@require_auth
def list_repos():
    db = next(get_db())
    repos = db.query(Repository).filter_by(user_id=g.user['id']).all()
    return jsonify([repo.to_dict() for repo in repos])

@bp.route('/<int:repo_id>', methods=['GET'])
@require_auth
def get_repo(repo_id):
    db = next(get_db())
    repo = db.query(Repository).filter_by(id=repo_id, user_id=g.user['id']).first()
    
    if not repo:
        return jsonify({'error': 'Repository not found'}), 404

    return jsonify(repo.to_dict())

@bp.route('/<int:repo_id>', methods=['DELETE'])
@require_auth
def delete_repo(repo_id):
    db = next(get_db())
    repo = db.query(Repository).filter_by(id=repo_id, user_id=g.user['id']).first()
    
    if not repo:
        return jsonify({'error': 'Repository not found'}), 404

    db.delete(repo)
    db.commit()

    return '', 204