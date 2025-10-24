from flask import Flask
from flask_cors import CORS
from routes.projects import projects_bp
from routes.mindmaps import mindmaps_bp
from models.database import init_db, get_session, Project

app = Flask(__name__)
CORS(app)

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
    return {'status': 'ok'}, 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
