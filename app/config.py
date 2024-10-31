from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_session import Session
from flask_mail import Mail
from dotenv import load_dotenv
import os

load_dotenv()
mail_password = os.getenv("MAIL_PASSWORD")
secret_key = os.getenv("SECRET_KEY")

app = Flask(__name__, template_folder="frontend", static_folder="frontend/static")

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///mydatabase.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.secret_key = secret_key
app.config['SESSION_TYPE'] = 'filesystem'
app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 465
app.config["MAIL_USERNAME"] = "germantest813@gmail.com"
app.config["MAIL_PASSWORD"] = mail_password
app.config["MAIL_USE_SSL"] = True

Session(app)
CORS(app, resources={r'*':{"origins":"*"}})

mail = Mail(app)
db = SQLAlchemy(app)

