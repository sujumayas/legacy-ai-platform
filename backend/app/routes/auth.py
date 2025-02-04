from flask import Blueprint

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@bp.route('/login', methods=['POST'])
def login():
    # TODO: Implement GitHub OAuth login
    pass

@bp.route('/me', methods=['GET'])
def me():
    # TODO: Implement user profile endpoint
    pass