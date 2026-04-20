from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models import MealPlan, MealPlanEntry
from datetime import date

meals_bp = Blueprint('meals', __name__)

@meals_bp.route('/', methods=['GET'])
@jwt_required()
def get_meal_plans():
    user_id = get_jwt_identity()
    plans = MealPlan.query.filter_by(user_id=user_id).all()
    return jsonify([{
        'id': plan.id,
        'title': plan.title,
        'start_date': str(plan.start_date),
        'end_date': str(plan.end_date)
    } for plan in plans])

@meals_bp.route('/', methods=['POST'])
@jwt_required()
def create_meal_plan():
    user_id = get_jwt_identity()
    data = request.get_json()
    plan = MealPlan(
        user_id=user_id,
        title=data['title'],
        start_date=data.get('start_date'),
        end_date=data.get('end_date')
    )
    db.session.add(plan)
    db.session.commit()
    return jsonify({'message': 'Meal plan created', 'id': plan.id}), 201

@meals_bp.route('/today', methods=['GET'])
@jwt_required()
def get_today_meals():
    user_id = get_jwt_identity()
    today = date.today()
    entries = MealPlanEntry.query.join(MealPlan).filter(
        MealPlan.user_id == user_id,
        MealPlanEntry.entry_date == today
    ).all()
    return jsonify([{
        'id': entry.id,
        'meal_type': entry.meal_type,
        'entry_date': str(entry.entry_date)
    } for entry in entries])
