from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_session import Session

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///mydatabase.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.secret_key = "My very beatiful secret key"
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)
CORS(app)

db = SQLAlchemy(app)

