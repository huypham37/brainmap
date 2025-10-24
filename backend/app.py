from flask import Flask
from flask_cors import CORS
from routes.projects import projects_bp
from routes.mindmaps import mindmaps_bp
from models.database import init_db, get_session, Project
import os

app = Flask(__name__)

# CORS configuration
# Allow requests from GitHub Pages in production, or all origins in development
CORS_ORIGIN = os.getenv('CORS_ORIGIN', '*')
CORS(app, origins=CORS_ORIGIN)

# Initialize database
init_db()

# Create default project if none exists
session = get_session()
try:
    if session.query(Project).count() == 0:
        default_project = Project(name='Default Project')
        session.add(default_project)
        session.commit()
        print('Created default project')
except Exception as e:
    print(f'Error creating default project: {e}')
    session.rollback()
finally:
    session.close()

# Register blueprints
app.register_blueprint(projects_bp, url_prefix='/api/projects')
app.register_blueprint(mindmaps_bp, url_prefix='/api/mindmaps')

@app.route('/api/health', methods=['GET'])
def health_check():
    return {'status': 'ok', 'message': 'Brainmap API is running'}, 200

@app.route('/', methods=['GET'])
def root():
    return {'message': 'Brainmap API', 'health_check': '/api/health'}, 200

if __name__ == '__main__':
    # Use PORT from environment variable (Railway sets this automatically)
    port = int(os.getenv('PORT', 5001))
    debug = os.getenv('FLASK_ENV') != 'production'
    app.run(debug=debug, host='0.0.0.0', port=port)
