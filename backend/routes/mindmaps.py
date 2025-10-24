from flask import Blueprint, request, jsonify
from models.database import get_session, MindMap
import json

mindmaps_bp = Blueprint('mindmaps', __name__)

@mindmaps_bp.route('', methods=['GET'])
def get_mindmaps():
    """Get all mindmaps, optionally filtered by project_id"""
    project_id = request.args.get('project_id', type=int)
    session = get_session()
    try:
        query = session.query(MindMap)
        if project_id:
            query = query.filter_by(project_id=project_id)
        mindmaps = query.all()
        return jsonify([{
            'id': m.id,
            'project_id': m.project_id,
            'name': m.name,
            'data': json.loads(m.data),
            'created_at': m.created_at.isoformat(),
            'updated_at': m.updated_at.isoformat()
        } for m in mindmaps]), 200
    finally:
        session.close()

@mindmaps_bp.route('', methods=['POST'])
def create_mindmap():
    """Create a new mindmap"""
    data = request.json
    session = get_session()
    try:
        mindmap = MindMap(
            project_id=data['project_id'],
            name=data['name'],
            data=json.dumps(data.get('data', {'nodes': [], 'edges': []}))
        )
        session.add(mindmap)
        session.commit()
        return jsonify({
            'id': mindmap.id,
            'project_id': mindmap.project_id,
            'name': mindmap.name,
            'data': json.loads(mindmap.data),
            'created_at': mindmap.created_at.isoformat(),
            'updated_at': mindmap.updated_at.isoformat()
        }), 201
    finally:
        session.close()

@mindmaps_bp.route('/<int:mindmap_id>', methods=['PUT'])
def update_mindmap(mindmap_id):
    """Update a mindmap (auto-save)"""
    data = request.json
    session = get_session()
    try:
        mindmap = session.query(MindMap).get(mindmap_id)
        if not mindmap:
            return jsonify({'error': 'Mindmap not found'}), 404

        if 'name' in data:
            mindmap.name = data['name']
        if 'data' in data:
            mindmap.data = json.dumps(data['data'])

        session.commit()
        return jsonify({
            'id': mindmap.id,
            'project_id': mindmap.project_id,
            'name': mindmap.name,
            'data': json.loads(mindmap.data),
            'created_at': mindmap.created_at.isoformat(),
            'updated_at': mindmap.updated_at.isoformat()
        }), 200
    finally:
        session.close()

@mindmaps_bp.route('/<int:mindmap_id>', methods=['DELETE'])
def delete_mindmap(mindmap_id):
    """Delete a mindmap"""
    session = get_session()
    try:
        mindmap = session.query(MindMap).get(mindmap_id)
        if not mindmap:
            return jsonify({'error': 'Mindmap not found'}), 404
        session.delete(mindmap)
        session.commit()
        return jsonify({'message': 'Mindmap deleted'}), 200
    finally:
        session.close()
