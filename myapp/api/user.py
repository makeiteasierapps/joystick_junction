from flask import Blueprint, current_app, request
<<<<<<< HEAD
from myapp.services.user_service import UserService as us
=======
from myapp.services.user_services import UserService as us
>>>>>>> c53216991efa5abb277d4a46b434acdff0761004

user = Blueprint('user', __name__)


def authenticate_request(id_token=None):
<<<<<<< HEAD
    """
    Authenticates the user sending the request by verifying the idToken
    If the idToken is valid, the user's uid is returned
    """
=======
>>>>>>> c53216991efa5abb277d4a46b434acdff0761004
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
<<<<<<< HEAD
    """
    Route handler that calls the get_user_data method from the UserService class
    """
    uid = authenticate_request()
    return us.get_user_data(uid)

@user.route('/user/online', methods=['GET'])
def get_online_users():
    """
    Route handler that calls the get_online_users method from the UserService class
    """
    return us.get_online_users()
=======
    uid = authenticate_request()
    return us.get_user_data(uid)
>>>>>>> c53216991efa5abb277d4a46b434acdff0761004
