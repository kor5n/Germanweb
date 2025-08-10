from flask import request, jsonify, session, render_template,redirect
from config import app, db,mail
from models import Test, User
import bcrypt
from flask_mail import Message
from create_img import create_img
from random import randint
from mail_valid import is_valid

@app.route("/")
def profile_page():
    try:
        if not session["id"] or session["id"] == None:
            return redirect("/browse")
        else:
            return render_template("main.html")
    except:
        return redirect("/browse/1")
@app.route("/create")#Has to be logged in
def create_page():
    try:
        if not session["id"] or session["id"] == None:
            return redirect("/signup")
        else:
            return render_template("create.html")
    except:
        return redirect("/signup")    
@app.route("/edit/<int:test_id>")#Has to be logged in
def edit_page(test_id):
    try:
        if not session["id"] or session["id"] == None:
            return redirect("/signup")
        else:
            return render_template("create.html")
    except:
        return redirect("/signup") 
@app.route("/signup")
def signup_page():
    try:
        if session["id"] != None:
            return redirect("/")
        else:
            return render_template("signup.html")
    except:
        return render_template("signup.html")
@app.route("/login")
def login_page():
    try:
        if session["id"] != None:
            return redirect("/")
        else:
            return render_template("signup.html")
    except:
        return render_template("signup.html")
@app.route("/view/<int:test_id>")
def view_page(test_id):
    return render_template("view.html")
@app.route("/flash/<int:test_id>")
def flash_page(test_id):
    return render_template("flashcards.html")
@app.route("/multi/<int:test_id>")
def multi_page(test_id):
    return render_template("multipleAnswer.html")
@app.route("/write/<int:test_id>")
def write_page(test_id):
    return render_template("writeAns.html")
@app.route("/browse/<int:page>")
def browse_page(page):
    return render_template("browse.html")
@app.route("/about")
def about_page():
    return render_template("about.html")

@app.route("/b/tests", methods = ["GET"])
def get_terms():
    try:
        user = User.query.get(session["id"])
    except:
        return jsonify({"message": "You are not logged in or user does not exist"}), 401
    if user==None:
        return jsonify({"message": "You are not logged in or user does not exist"}), 401
    tests = Test.query.all()
    json_tests = list(map(lambda x: x.to_json(), tests))
    user_tests = []
    for test in json_tests:
        if test["user_id"] == user.id:
            user_tests.append(test)
    if len(user_tests)==0:
        return jsonify({"message": "You don't have any tests", "username": user.user_name, "favourites": user.favourites}), 200

    return jsonify({"message":  user_tests, "username": user.user_name, "favourites": user.favourites}), 200
@app.route("/b/view/<int:test_id>", methods = ["GET"])
def view_test(test_id):
    logged_in = True
    can_modify = False
    test = Test.query.get(test_id)
    if not test:
        return jsonify({"message": "Test not found"}), 404
    
    try :
        can_modify = test.user_id == session["id"]
        if session["id"] == None:
            logged_in = False
    except:
        logged_in = False
    owner_name = User.query.get(test.user_id).user_name
    test_list = [test.title, test.description, test.terms, test.defenition]
    return jsonify({"message": test_list, "canModify":can_modify, "loggedIn" : logged_in, "ownerName": owner_name}), 200
@app.route("/b/create", methods = ["POST"])
def create_test():
    if not session["id"]:
        return jsonify({"message": "You are not logged in"}), 401
    title = request.json.get("title")
    desc = request.json.get("description")
    terms = request.json.get("term")
    defs = request.json.get("defenition")

    if not title or not desc or not terms or not defs:
        return jsonify({"message": "You must include a username, title and description"}), 400
    
    new_test =Test(title=title, description=desc, terms=terms, defenition=defs, user_id=session["id"])
    try: 
        db.session.add(new_test)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400
    
    return jsonify({"message": "Test created"}), 201

@app.route("/b/edit-test/<int:test_id>", methods=["PATCH"])
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
@app.route("/b/delete/<int:test_id>", methods=["DELETE"])
def delete_test(test_id):
    test = Test.query.get(test_id)

    if not test:
        return jsonify({"message": "Test not found"}), 404

    db.session.delete(test)
    db.session.commit()
    return jsonify({"message": "Test deleted"}), 200
@app.route("/b/sign-up", methods=["GET", "POST"])
def create_user():
    username = request.json.get("username")
    email = request.json.get("email")
    password = request.json.get("password")
    if not username or not email or not password:
        return (jsonify({"message": "You must include a username, email and password"}), 400)

    #users = User.query.all()
    #json_users = list(map(lambda x: x.to_json(), users))    

    #for user in json_users:
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "This email is already in use"}), 418

    if is_valid(email) == False:
        return jsonify({"message": "Invalid email"}), 412    
    
    try:
        msg = Message(f"Welcome to GermanTest {username}!", sender="germantest813@gmail.com", recipients=[email])
        msg.body = f"Welcome again {username} to this wonderfull study community! We are very delighted to have you here. Hoping that you will find something for yourself.\nThis is an automatic message one you first sign up at germanweb.kotov.lv"
        mail.send(msg)
    except Exception as e:
        return jsonify({"message": "Invalid email"}),412

    #h = hashlib.new("SHA256")
    #h.update(password.encode())

    h = bcrypt.hashpw(password, bcrypt.gensalt())

    new_user = User(user_name=username, email=email, password=h, img=create_img(username), favourites="")
    
    try: 
        db.session.add(new_user)
        db.session.commit()
        session["id"] = new_user.id
    except Exception as e:
        return jsonify({"message": str(e)}), 400
    
    return jsonify({"message": "New user created"}), 201
@app.route("/b/sign-in", methods=["GET", "POST"])
def log_in():
    email = request.json.get("email")
    password = request.json.get("password")

    #h = hashlib.new("SHA256")
    #h.update(password.encode())

    h = bcrypt.hashpw(password, bcrypt.gensalt())

    if not email or not password:
        return jsonify({"message": "You must include email and password"}), 400
    
    users = User.query.all()
    json_users = list(map(lambda x: x.to_json(), users))
    
    try:
        for user in json_users:
            if user["email"]==email and bcrypt.checkpw(user["password"], h):
                session["id"] = user["id"]
                break
    except Exception as e:
        return jsonify({"message": "Email or password is incorrect"}), 400

    try:
        usr = User.query.get(session["id"])
        if not usr:
            return jsonify({"message": "Email or password is incorrect"}), 400
    except:
        return jsonify({"message": "Email or password is incorrect"}), 400
    return jsonify({"message": "You are logged in as " + usr.user_name}), 200 
@app.route("/b/logout", methods=["GET"])
def logout():
    if session["id"] != None:
        session["id"] = None
        return jsonify({"message": "Succesfully logged out"}), 200
    else:
        return jsonify({"message":"Couldn't log out(didn't find your info)"}),404
@app.route("/b/img", methods=["GET"])
def img():
    try: 
        user = User.query.get(session["id"])
    except:
        return jsonify({"message":"You are not logged in"}),401
    return jsonify({"img":user.img}), 200
@app.route("/b/browse/<string:prompt>", methods=["GET"])
def browse(prompt):
    authors= []
    logged_in = True
    tests = Test.query.all()
    users = User.query.all()
    test_list = []

    if not tests or not users:
        return jsonify({"message":"Couldn't find tests or user info"}), 404
    
    json_tests = list(map(lambda x: x.to_json(), tests))  
    json_users = list(map(lambda x: x.to_json(), users))
        
    iterations = 30
    test_list = json_tests
    collect_list = [[]]
    if prompt != "null":
        for test in test_list:
            if prompt not in test.title:
                test_list.remove(test)

    if iterations > len(test_list):
        collect_index = 0
        for i in range(start=len(test_list), step=iterations):
            if (i+1) % iterations == 0:
                collect_list.append([])
                collect_index +=1
            else:
                collect_list[collect_index].append(test_list[i])
    else:
        collect_list[0] = test_list
    
    for list in collect_list:
        for element in list:
            if element["user_id"] == json_users[element["user_id"]-1]["id"]:
                authors.append(json_users[element["user_id"]-1]["user_name"])
            else:
                return jsonify({"message":"Something went wrong"}),404

    try:
        if session["id"] == None:
            logged_in = False
    except:
        logged_in = False

    return jsonify({"message": "Successfully found tests", "tests":collect_list, "loggedIn":logged_in, "authors":authors}),200
@app.route("/b/add-favourite/<int:test_id>", methods=["POST"])
def add_favourite(test_id):
    print(test_id)
    try:
        if session["id"] == None:
            logged_in = False
        else:
            logged_in = True
    except:
        logged_in = False
    
    if logged_in == False:
        return jsonify({"message": "You are not logged in"}),401

    try:
        usr = User.query.get(session["id"])
        print(usr.favourites)
    except:
        return jsonify({"message":"This id does not exist"})

    if str(test_id) in usr.favourites.split(","):
        return jsonify({"mesage": "This test is already in favourites"}),400
    
    usr.favourites += str(test_id) + ','

    db.session.commit()

    return jsonify({"message" : "Succesfully added new favourite test"}),200
@app.route("/b/del-favourite/<int:test_id>", methods=["POST"])
def del_favourite(test_id):
    try:
        if session["id"] == None:
            logged_in = False
        else:
            logged_in = True
    except:
        logged_in = False
    
    if logged_in == False:
        return jsonify({"message": "You are not logged in"}),401

    try:
        usr = User.query.get(session["id"])
    except:
        return jsonify({"message":"This id does not exist"})
    
    if str(test_id) not in usr.favourites.split(","):
        return jsonify({"message":"You do not have this favourite"}),400

    fav_list = usr.favourites.split(",")
    fav_list.remove(str(test_id))
    usr.favourites = ",".join(fav_list)
    db.session.commit()

    return jsonify({"message":"Succesfully removed test from favourites"}),200         

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(host="127.0.0.1", port=5000, debug=True)


