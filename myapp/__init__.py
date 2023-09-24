import firebase_admin
from firebase_admin import credentials, firestore

from flask import Flask
from myapp.views import register_blueprints
from myapp.services.firebase_service import FirebaseService

def create_app():
    app = Flask(__name__, template_folder='templates', static_folder='../static')
    register_blueprints(app)

    cred = credentials.Certificate("myapp/joystick-junction-firebase-adminsdk-qly1n-8280e655cb.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    app.config['db'] = db
    app.firebase_service = FirebaseService()
    return app
