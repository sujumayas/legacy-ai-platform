from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

def create_app(test_config=None):
    load_dotenv()

    app = Flask(__name__, instance_relative_config=True)
    CORS(app)

    if test_config is None:
        app.config.from_mapping(
            SECRET_KEY=os.environ.get('SECRET_KEY', 'dev'),
            ANTHROPIC_API_KEY=os.environ.get('ANTHROPIC_API_KEY'),
        )
    else:
        app.config.update(test_config)

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    @app.route('/health')
    def health_check():
        return {'status': 'healthy'}

    # Register blueprints here
    from .routes import auth, repos, workflows
    app.register_blueprint(auth.bp)
    app.register_blueprint(repos.bp)
    app.register_blueprint(workflows.bp)

    return app