from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from database import db
from models import User
import bcrypt

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())

    new_user = User(username=username, email=email,
                    password_hash=hashed.decode())
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()

    if not user:
        return jsonify({'error': 'User not found'}), 404

    if bcrypt.checkpw(data['password'].encode(),
                      user.password_hash.encode()):
        token = create_access_token(identity=str(user.id))
        return jsonify({'token': token, 'username': user.username})

    return jsonify({'error': 'Wrong password'}), 401
