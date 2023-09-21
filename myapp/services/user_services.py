from flask import jsonify, current_app

class UserService:
    @staticmethod
    def get_user_data(uid):
        db = current_app.config['db']
        doc_ref = db.collection('users').document(uid)
        doc = doc_ref.get()
        if doc.exists:
            return jsonify(doc.to_dict()), 200
        
        return jsonify({"error": "No such document!"}), 4