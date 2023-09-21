from myapp.api.auth import login
from myapp.api.home import home
from myapp.api.user import user

def register_blueprints(app):
    app.register_blueprint(login)
    app.register_blueprint(home)
    app.register_blueprint(user)
