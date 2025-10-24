from flask import Blueprint, request, jsonify
from models.database import get_session, Project

projects_bp = Blueprint('projects', __name__)

@projects_bp.route('', methods=['GET'])
def get_projects():
    """Get all projects"""
    session = get_session()
    try:
        projects = session.query(Project).all()
        return jsonify([{
            'id': p.id,
            'name': p.name,
            'created_at': p.created_at.isoformat(),
            'updated_at': p.updated_at.isoformat()
        } for p in projects]), 200
    finally:
        session.close()

@projects_bp.route('', methods=['POST'])
def create_project():
    """Create a new project"""
    data = request.json
    session = get_session()
    try:
        project = Project(name=data['name'])
        session.add(project)
        session.commit()
        return jsonify({
            'id': project.id,
            'name': project.name,
            'created_at': project.created_at.isoformat(),
            'updated_at': project.updated_at.isoformat()
        }), 201
    finally:
        session.close()

@projects_bp.route('/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    """Delete a project"""
    session = get_session()
    try:
        project = session.query(Project).get(project_id)
        if not project:
            return jsonify({'error': 'Project not found'}), 404
        session.delete(project)
        session.commit()
        return jsonify({'message': 'Project deleted'}), 200
    finally:
        session.close()
