from flask import jsonify, current_app

class UserService:
    
    @staticmethod
    def get_user_data(uid):
        """
        Gets the user for a given user id(uid)
        """
        db = current_app.config['db']
        doc = db.collection('users').document(uid).get()
        if doc.exists:
            return jsonify(doc.to_dict()), 200
        
        return jsonify({"error": "No such document!"}), 4
    
    @staticmethod
    def get_online_users():
        """
        Goes through all users in the user collection and returns 
        the ones whos 'online' field is set to True.
        """
        db = current_app.config['db']
        docs = db.collection('users').where('online', '==', True).stream()
        if docs:
            return jsonify([doc.to_dict() for doc in docs]), 200
        
        return jsonify({"error": "No such document!"}), 4