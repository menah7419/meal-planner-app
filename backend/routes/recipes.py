from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
import requests
import os

recipes_bp = Blueprint('recipes', __name__)

@recipes_bp.route('/search', methods=['GET'])
@jwt_required()
def search_recipes():
    query = request.args.get('q', '')
    api_key = os.getenv('SPOONACULAR_API_KEY')
    
    url = 'https://api.spoonacular.com/recipes/complexSearch'
    params = {
        'apiKey': api_key,
        'query': query,
        'number': 10,
        'addRecipeInformation': True,
        'addRecipeNutrition': True
    }
    
    response = requests.get(url, params=params)
    data = response.json()
    
    results = []
    for recipe in data.get('results', []):
        nutrition = recipe.get('nutrition', {})
        
        nutrients = {}
        for n in nutrition.get('nutrients', []):
            nutrients[n['name']] = round(n['amount'], 1)
        
        results.append({
            'id': recipe['id'],
            'title': recipe['title'],
            'image': recipe.get('image', ''),
            'readyInMinutes': recipe.get('readyInMinutes', 0),
            'servings': recipe.get('servings', 1),
            'calories': nutrients.get('Calories', 0),
            'protein': nutrients.get('Protein', 0),
            'carbs': nutrients.get('Carbohydrates', 0),
            'fat': nutrients.get('Fat', 0),
        })
    
    return jsonify(results)

@recipes_bp.route('/detail/<int:recipe_id>', methods=['GET'])
@jwt_required()
def get_recipe_detail(recipe_id):
    api_key = os.getenv('SPOONACULAR_API_KEY')
    
    url = f'https://api.spoonacular.com/recipes/{recipe_id}/information'
    params = {
        'apiKey': api_key,
        'includeNutrition': False
    }
    
    response = requests.get(url, params=params)
    data = response.json()
    
    ingredients = []
    for ing in data.get('extendedIngredients', []):
        ingredients.append(ing.get('original', ''))
    
    instructions = []
    analyzed = data.get('analyzedInstructions', [])
    if analyzed:
        for step in analyzed[0].get('steps', []):
            instructions.append(step.get('step', ''))
    
    return jsonify({
        'ingredients': ingredients,
        'instructions': instructions
    })
