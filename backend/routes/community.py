from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db

community_bp = Blueprint('community', __name__)

@community_bp.route('/', methods=['GET'])
@jwt_required()
def get_posts():
    from models import CommunityPost
    posts = CommunityPost.query.order_by(CommunityPost.created_at.desc()).all()
    return jsonify([{
        'id': post.id,
        'title': post.title,
        'description': post.description,
        'image_url': post.image_url,
        'created_at': str(post.created_at)
    } for post in posts])

@community_bp.route('/', methods=['POST'])
@jwt_required()
def create_post():
    from models import CommunityPost
    user_id = get_jwt_identity()
    data = request.get_json()
    post = CommunityPost(
        user_id=user_id,
        title=data['title'],
        description=data.get('description', ''),
        image_url=data.get('image_url', '')
    )
    db.session.add(post)
    db.session.commit()
    return jsonify({'message': 'Post created', 'id': post.id}), 201
