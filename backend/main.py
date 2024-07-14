from flask import request, jsonify, session, render_template
from config import app, db
from models import Test, User
import hashlib

@app.route("/tests", methods = ["GET", "POST"])
def get_terms():
    user = User.query.get(request.json.get("session_id"))
    if user==None:
        return jsonify({"message": "You are not logged in"}), 401
    tests = Test.query.all()
    json_tests = list(map(lambda x: x.to_json(), tests))
    user_tests = []
    for test in json_tests:
        if test["user_id"] == user.id:
            user_tests.append(test)
    if len(user_tests)==0:
        return jsonify({"message": "You don't have any tests"}), 200
    return jsonify({"message":  user_tests, "username": user.user_name}), 200
@app.route("/view/<int:test_id>", methods = ["GET"])
def view_test(test_id):
    test = Test.query.get(test_id)
    if not test:
        return jsonify({"message": "Test not found"}), 404
    
    test_list = [test.title, test.description, test.terms, test.defenition]
    return jsonify({"message": test_list}), 200
@app.route("/create", methods = ["POST", "PATCH"])
def create_test():
    user_id = request.json.get("session_id")
    if not user_id:
        return jsonify({"message": "You are not logged in"}, 401)
    title = request.json.get("title")
    desc = request.json.get("description")
    terms = request.json.get("term")
    defs = request.json.get("defenition")

    if not title or not desc or not terms or not defs:
        return (jsonify({"message": "You must include a username, title and description"}), 400)
    
    new_test =Test(title=title, description=desc, terms=terms, defenition=defs, user_id=user_id)
    try: 
        db.session.add(new_test)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400
    
    user = User.query.get(user_id)
    return jsonify({"message": "Test created"}), 201

@app.route("/edit-test/<int:test_id>", methods=["PATCH"])
def update_test(test_id):
    test = Test.query.get(test_id)

    if not test:
        return jsonify({"message": "Test not found"}), 404
    
    data = request.json
    test.title = data.get("title", test.title)
    test.description = data.get("description", test.description)
    test.terms = data.get("terms", test.terms)
    test.defenition = data.get("defenition", test.defenition)

    db.session.commit()

    return jsonify({"message": "Test updated"}), 200
@app.route("/delete/<int:test_id>", methods=["DELETE"])
def delete_test(test_id):
    test = Test.query.get(test_id)
    print(type(test))

    if not test:
        return jsonify({"message": "Test not found"}), 404

    db.session.delete(test)
    db.session.commit()
    return jsonify({"message": "Test deleted"}), 200
@app.route("/sign-up", methods=["GET", "POST"])
def create_user():
    username = request.json.get("username")
    email = request.json.get("email")
    password = request.json.get("password")

    if not username or not email or not password:
        return (jsonify({"message": "You must include a username, email and password"}), 400)
    
    users = User.query.all()
    json_users = list(map(lambda x: x.to_json(), users))    

    for user in json_users:
        if email in user["email"]:
            return jsonify({"message": "This email is already in use"})

    h = hashlib.new("SHA256")
    h.update(password.encode())

    new_user = User(user_name=username, email=email, password=h.hexdigest())

    
    try: 
        db.session.add(new_user)
        db.session.commit()
        session["id"] = new_user.id
        print(session["id"])
    except Exception as e:
        return jsonify({"message": str(e)}), 400
        
    return jsonify({"message": "New user created", "cookie":session["id"]}), 201
@app.route("/sign-in", methods=["GET", "POST"])
def log_in():
    email = request.json.get("email")
    password = request.json.get("password")
    print(email)

    h = hashlib.new("SHA256")
    h.update(password.encode())

    if not email or not password:
        return jsonify({"message": "You must include email and password"}), 400
    
    users = User.query.all()
    json_users = list(map(lambda x: x.to_json(), users))
    
    try:
        for user in json_users:
            if user["email"]==email and user["password"]==h.hexdigest():
                session["id"] = user["id"]
                break
    except Exception as e:
        print(e)
        return jsonify({"message": "Email or password is incorrect"}), 400

    try:
        usr = User.query.get(session["id"])
    except:
        return jsonify({"message": "Email or password is incorrect"}), 400
    return jsonify({"message": "You are logged in as " + usr.user_name, "cookie":session["id"]}), 200 

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)


