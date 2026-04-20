from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv
from database import db
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
jwt = JWTManager(app)

from routes.auth import auth_bp
from routes.meals import meals_bp
from routes.pantry import pantry_bp
from routes.community import community_bp

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(meals_bp, url_prefix='/api/meals')
app.register_blueprint(pantry_bp, url_prefix='/api/pantry')
app.register_blueprint(community_bp, url_prefix='/api/community')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
