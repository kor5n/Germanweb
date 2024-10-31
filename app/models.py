from config import db

class Test(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(20), unique=False, nullable=False)
    description = db.Column(db.String(80), unique=False, nullable=False)
    terms = db.Column(db.String(4000), unique=False, nullable=False)
    defenition = db.Column(db.String(4000), unique=False, nullable=False)
    user_id = db.Column(db.Integer, unique=False, nullable=False)
    #defenition = db.Column(db.String(80), unique=False, nullable=False)

    def to_json(self):
        return{
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "terms": self.terms,
            "defenition": self.defenition,
            "user_id": self.user_id
        }
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(20), unique=False, nullable=False)
    email = db.Column(db.String(50), unique=False, nullable=False)
    password = db.Column(db.String, unique=False, nullable=False)
    img = db.Column(db.String(100))
    favourites = db.Column(db.String(1000), unique=False, nullable=False)
    #tests = db.Column(db.ARRAY(db.Class), unique=False, nullable=False)
    def to_json(self):
        return{
            "id": self.id,
            "user_name": self.user_name,
            "email": self.email,
            "password": self.password,
            "img": self.img
        }



