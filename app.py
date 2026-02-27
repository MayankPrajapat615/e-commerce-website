from flask import Flask
from routes.public_routes import public_bp
from routes.admin_routes import admin_bp
from routes.auth_routes import auth_bp
import os

def create_app():
    app = Flask(__name__)

    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev_fallback_key")

    # Register Blueprints
    app.register_blueprint(public_bp)
    app.register_blueprint(admin_bp, url_prefix="/admin")
    app.register_blueprint(auth_bp)

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)