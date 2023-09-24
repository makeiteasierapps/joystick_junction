from myapp.api.user import user

def register_blueprints(app):
    app.register_blueprint(user)
