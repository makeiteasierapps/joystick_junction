from flask import Blueprint, render_template, current_app, request

home = Blueprint('home', __name__)

def authenticate_request(id_token=None):
    firebase_service = current_app.firebase_service
    if id_token:
        decoded_token = firebase_service.verify_id_token(id_token)
        if not decoded_token:
            return None
        return decoded_token['uid']
    
    # Handle the case when idToken is not provided (e.g., for fetch requests)
    id_token = request.headers.get('Authorization')
    decoded_token = firebase_service.verify_id_token(id_token)
    if not decoded_token:
        return None
    return decoded_token['uid']

@home.route('/home')
def render_home():
    return render_template('home.html')
