from flask import Flask

from .schema import db


def create_app():
    app = Flask(__name__)
    app.config.from_pyfile("config.py", silent=True)
    db.init_app(app)
    return app
