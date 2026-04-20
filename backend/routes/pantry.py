from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models import PantryItem

pantry_bp = Blueprint('pantry', __name__)

@pantry_bp.route('/', methods=['GET'])
@jwt_required()
def get_pantry():
    user_id = get_jwt_identity()
    items = PantryItem.query.filter_by(user_id=user_id).all()
    return jsonify([{
        'id': item.id,
        'item_name': item.item_name,
        'quantity': item.quantity,
        'unit': item.unit,
        'expiry_date': str(item.expiry_date)
    } for item in items])

@pantry_bp.route('/', methods=['POST'])
@jwt_required()
def add_item():
    user_id = get_jwt_identity()
    data = request.get_json()
    item = PantryItem(
        user_id=user_id,
        item_name=data['item_name'],
        quantity=data.get('quantity'),
        unit=data.get('unit'),
        expiry_date=data.get('expiry_date')
    )
    db.session.add(item)
    db.session.commit()
    return jsonify({'message': 'Item added', 'id': item.id}), 201

@pantry_bp.route('/<int:item_id>', methods=['DELETE'])
@jwt_required()
def delete_item(item_id):
    user_id = get_jwt_identity()
    item = PantryItem.query.filter_by(id=item_id,
                                      user_id=user_id).first_or_404()
    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Item deleted'})
