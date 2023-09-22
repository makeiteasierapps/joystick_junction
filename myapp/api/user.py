from flask import Blueprint, current_app, request
from myapp.services.user_service import UserService as us

user = Blueprint('user', __name__)


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


@user.route('/user')
def get_user_data():
    uid = authenticate_request()
    return us.get_user_data(uid)