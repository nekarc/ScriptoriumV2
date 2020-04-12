from flask import Flask, request, jsonify
import json
from flask_mysqldb import MySQL
from flask_cors import CORS
import os
import uuid
from werkzeug.utils import secure_filename
import pyrebase
import requests
from datetime import timedelta, date



UPLOAD_FOLDER = "./uploads"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}

def allowed_files(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS



app = Flask(__name__)



# mysql-config
app.config["MYSQL_HOST"] = "localhost"
app.config["MYSQL_USER"] = "root"
app.config["MYSQL_PASSWORD"] = ""
app.config["MYSQL_DB"] = "scriptorium"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

mysql = MySQL(app)
CORS(app)



# firebase-config
config = {
    "apiKey": "AIzaSyB9Y5UniIuOWHBj2TEM_o86oWcWoEIfNxE",
    "authDomain": "scriptorium-v3.firebaseapp.com",
    "databaseURL": "https://scriptorium-v3.firebaseio.com",
    "projectId": "scriptorium-v3",
    "storageBucket": "scriptorium-v3.appspot.com",
    "messagingSenderId": "780846580846",
    "appId": "1:780846580846:web:448cdaffadc201990d527f",
    "serviceAccount": "./keyfile.json"
}

firebase = pyrebase.initialize_app(config)
storage = firebase.storage()



# Add a book to the DB
@app.route("/api/addbook", methods=["POST"])
def addbook():
    if request.method == "POST":

        title = request.form.get("title")
        author = request.form.get("author")
        genre = request.form.get("genre")
        description = request.form.get("desc")

        cover = request.files["cover"]

        if cover and allowed_files(cover.filename):
            filename = str(uuid.uuid4())
            filename += "."
            filename += cover.filename.split(".")[1]
            filename_secure = secure_filename(filename)

            cover.save(os.path.join(app.config["UPLOAD_FOLDER"], filename_secure))

            local_filename = "./uploads/"
            local_filename += filename_secure
            firebase_filename = "uploads/"
            firebase_filename += filename_secure

            storage.child(firebase_filename).put(local_filename)

            cover_image = storage.child(firebase_filename).get_url(None)

            cur = mysql.connection.cursor()

            query = "INSERT INTO books (title, author, genre, cover, description) VALUES ('"+ str(title)+"','"+str(author)+"','"+str(genre)+"','"+str(cover_image)+"','"+str(description)+"');"
            cur.execute(query)
            mysql.connection.commit()

            os.remove(os.path.join(app.config["UPLOAD_FOLDER"], filename_secure))

            return jsonify(data="the post was created successfully")



# Register a new user
@app.route("/api/adduser", methods=["POST"])
def adduser():
    if request.method == "POST":

        name = request.form.get("name")
        email = request.form.get("email")
        pwd = request.form.get("pwd")
        
        cur = mysql.connection.cursor()

        query = "INSERT INTO users (name, email, pwd) VALUES ('"+ str(name)+"','"+str(email)+"','"+str(pwd)+"');"
        cur.execute(query)
        mysql.connection.commit()

        query = "SELECT * FROM users ;"
        cur.execute(query)
        user = cur.fetchall()
        full_id = "LISUSER" + str(user[-1][0])

        return jsonify(data=full_id)



# Default recommendation: the latest books added to the DB
@app.route("/api/reccs", methods=["GET"])
def default_reccs():
    if request.method == 'GET':

        cur = mysql.connection.cursor()

        query = "SELECT * FROM books;"
        cur.execute(query)
        posts = (cur.fetchall())[-3:]

        return jsonify(data=posts)
        


# Retrieve book details
@app.route("/api/book/<bid>", methods=["GET"])
def book_info(bid):
    if request.method == 'GET':

        cur = mysql.connection.cursor()

        query = "SELECT * FROM books WHERE id="+bid+";"
        cur.execute(query)
        posts = cur.fetchone()

        return jsonify(data=posts)



# Validate a user
@app.route("/api/validateuser", methods=["POST"])
def validateuser():
    if request.method == "POST":

        uid = request.form.get("uid")
        full_id = uid
        if (uid[:7]!="LISUSER"):
            return jsonify(data="Invalid")
        uid = uid[7:]

        pwd = request.form.get("pwd")
        
        cur = mysql.connection.cursor()

        query = "SELECT * FROM users WHERE id="+uid+";"
        cur.execute(query)
        user = cur.fetchone()
        if user and user[3]==pwd:
            return jsonify(data=full_id)
        
        return jsonify(data="Invalid")



# Retrieve user details for the profile
@app.route("/api/user/<uid>", methods=["GET"])
def user_info(uid):
    if request.method == 'GET':

        uid = uid[7:]

        cur = mysql.connection.cursor()

        query = "SELECT * FROM borrow WHERE id="+uid+";"
        cur.execute(query)
        posts = cur.fetchone()

        if not posts:
            return jsonify(data=posts)

        details = list(posts)
        books_borr = (details[1], details[3], details[5])
        book_names = []

        for i in books_borr:
            if i:
                query = "SELECT title from books where id="+str(i)+";"
                cur.execute(query)
                posts = cur.fetchone()
                booktitle = posts[0][:17]+"..." if len(posts[0])>17 else posts[0]
                book_names.append(booktitle)
            else:
                book_names.append(None)

        (details[1], details[3], details[5]) = book_names

        for i in books_borr:
            if i:
                query = "SELECT cover from books where id="+str(i)+";"
                cur.execute(query)
                posts = cur.fetchone()
                details.append(posts[0])
            else:
                details.append(None)
        
        for i in books_borr:
            details.append(i)

        return jsonify(data=details)



# Borrow transaction, updates borrow table and history table
@app.route("/api/borrow/<bid>/<uid>", methods=["GET"])
def borrow(bid, uid):
    if request.method == 'GET':

        uid = uid[7:]

        cur = mysql.connection.cursor()

        query = "SELECT * FROM borrow WHERE id="+uid+";"
        cur.execute(query)
        posts = cur.fetchone()

        if not posts:
            query = "INSERT INTO borrow (id) VALUES ('"+ uid+"');"
            cur.execute(query)
            mysql.connection.commit()
            
            query = "SELECT * FROM borrow WHERE id="+uid+";"
            cur.execute(query)
            posts = cur.fetchone()
        
        update_column_book = 0
        update_column_ret = 0
        
        today = date.today()
        date_return = today + timedelta(days=21)
        ret_data = date_return.strftime("%d %B %Y")

        if not posts[1]:
            update_column_book = 'book1'
            update_column_ret = 'ret1'
        elif not posts[3]:
            update_column_book = 'book2'
            update_column_ret = 'ret2'
        elif not posts[5]:
            update_column_book = 'book3'
            update_column_ret = 'ret3'
        else:
            return jsonify(data="full")

        query = "UPDATE borrow SET "+update_column_book+" = "+bid+", "+update_column_ret+" = '"+ ret_data +"' WHERE id="+uid+";"
        cur.execute(query)
        mysql.connection.commit()

        query = "INSERT INTO history (userid, bookid) VALUES ("+uid+","+bid+");"
        cur.execute(query)
        mysql.connection.commit()

        return jsonify(data=posts)



# The logic behind the recomandation system
@app.route("/recomendation", methods=["POST"])
def recomendation():

    data = request.get_json()
    all_books = eval(data["all_books"])
    borr_books = eval(data["borr_books"])

    borr_gen = dict()
    all_gen = dict()

    fav_genre = dict()
    book_scores = dict()

    for i in borr_books:
        q = i[1]
        borr_gen[i[0]] = q.split(", ")
        for j in borr_gen[i[0]]:
            if j not in fav_genre:
                fav_genre[j] = 0
            fav_genre[j] += 1
            
    for i in all_books:
        if i not in borr_books:
            q = i[1]
            all_gen[i[0]] = q.split(", ")
            book_scores[i[0]] = 0
            for j in all_gen[i[0]]:
                if j in fav_genre:
                    book_scores[i[0]] += fav_genre[j]

    reccs = sorted(book_scores, key=lambda x:book_scores[x], reverse=True)[:3]
    result = {"data":reccs}

    return jsonify(result)



# Generate custom recommendation
@app.route("/api/customreccs/<uid>", methods=["GET"])
def custom_reccs(uid):
    if request.method == 'GET':

        uid = uid[7:]

        cur = mysql.connection.cursor()

        query = "SELECT id, genre FROM books;"
        cur.execute(query)
        all_books = cur.fetchall()

        read_books = []

        query = "SELECT bookid FROM history WHERE userid="+uid+";"
        cur.execute(query)
        read_books_id = cur.fetchall()
        if not read_books_id:
            return default_reccs()

        for i in read_books_id:
            query = "SELECT id, genre FROM books WHERE id = "+str(i[0])+";"
            cur.execute(query)
            book_det = cur.fetchone()
            read_books.append(book_det)
        
        reccs_url = "http://127.0.0.1:5000/recomendation"
        params = {"all_books":str(all_books), "borr_books":str(read_books)}
        reccs = ((requests.post(reccs_url, json=params)).json())["data"]

        result = []
        for i in reccs:
            query = "SELECT * FROM books WHERE id = "+str(i)+";"
            cur.execute(query)
            book_det = cur.fetchone()
            result.append(book_det)

        return jsonify(data=result)



# Return a book
@app.route("/api/return/<bid>/<uid>", methods=["GET"])
def returnBook(bid, uid):
    if request.method == 'GET':

        uid = uid[7:]

        cur = mysql.connection.cursor()

        query = "SELECT * FROM borrow WHERE id="+uid+";"
        cur.execute(query)
        posts = cur.fetchone()
        if not posts:
            return jsonify(data="not returned")
        
        update_column_book = 0
        update_column_ret = 0

        if str(posts[1])==bid:
            update_column_book = 'book1'
            update_column_ret = 'ret1'
        elif str(posts[3])==bid:
            update_column_book = 'book2'
            update_column_ret = 'ret2'
        elif str(posts[5])==bid:
            update_column_book = 'book3'
            update_column_ret = 'ret3'
        else:
            return jsonify(data="not returned")

        query = "UPDATE borrow SET "+update_column_book+" = NULL, "+update_column_ret+" = NULL WHERE id="+uid+";"
        cur.execute(query)
        mysql.connection.commit()

        return jsonify(data=posts)



# Renew book
@app.route("/api/renew/<bid>/<uid>", methods=["GET"])
def renewBook(bid, uid):
    if request.method == 'GET':

        uid = uid[7:]

        cur = mysql.connection.cursor()

        query = "SELECT * FROM borrow WHERE id="+uid+";"
        cur.execute(query)
        posts = cur.fetchone()
        if not posts:
            return jsonify(data="not renewed")
        
        update_column_book = 0
        update_column_ret = 0
        
        today = date.today()
        date_return = today + timedelta(days=21)
        ret_data = date_return.strftime("%d %B %Y")
        
        if str(posts[1])==bid:
            update_column_book = 'book1'
            update_column_ret = 'ret1'
        elif str(posts[3])==bid:
            update_column_book = 'book2'
            update_column_ret = 'ret2'
        elif str(posts[5])==bid:
            update_column_book = 'book3'
            update_column_ret = 'ret3'
        else:
            return jsonify(data="not renewed")

        query = "UPDATE borrow SET "+update_column_ret+" = '"+ret_data+"' WHERE id="+uid+";"
        cur.execute(query)
        mysql.connection.commit()
        
        query = "INSERT INTO history (userid, bookid) VALUES ("+uid+","+bid+");"
        cur.execute(query)
        mysql.connection.commit()

        return jsonify(data=posts)



# Search for a book wrt the title
@app.route("/api/searchBooks/<starting>", methods=["GET"])
def searchBooks(starting):
    if request.method == 'GET':
        
        starting = starting.lower()

        cur = mysql.connection.cursor()

        query = "SELECT title FROM books;"
        cur.execute(query)
        titles = list(cur.fetchall())
        
        query = "SELECT id FROM books;"
        cur.execute(query)
        ids = list(cur.fetchall())

        suggestions = []
        for i in range(len(titles)):
            if starting in (titles[i][0].lower()):
                suggestions.append(ids[i][0])
        
        result = []
        for i in suggestions:
            query = "SELECT * FROM books WHERE id = "+str(i)+";"
            cur.execute(query)
            book_det = cur.fetchone()
            result.append(book_det)
        
        return jsonify(data=result)



# Search for a book wrt title: but the title is not entered
@app.route("/api/searchBooks", methods=["GET"])
def searchBooksEmpty():
    if request.method == 'GET':
        return jsonify(data="Type something!")

        

# Search for a book wrt the keyword
@app.route("/api/searchKey/<starting>", methods=["GET"])
def searchKey(starting):
    if request.method == 'GET':
        
        starting = starting.lower()

        cur = mysql.connection.cursor()

        query = "SELECT genre FROM books;"
        cur.execute(query)
        titles = list(cur.fetchall())
        
        query = "SELECT id FROM books;"
        cur.execute(query)
        ids = list(cur.fetchall())

        suggestions = []
        for i in range(len(titles)):
            if starting in (titles[i][0].lower()):
                suggestions.append(ids[i][0])
        
        result = []
        for i in suggestions:
            query = "SELECT * FROM books WHERE id = "+str(i)+";"
            cur.execute(query)
            book_det = cur.fetchone()
            result.append(book_det)
        
        return jsonify(data=result)



# Search for a book wrt keyword: but the keyword is not entered
@app.route("/api/searchKey", methods=["GET"])
def searchKeyEmpty():
    if request.method == 'GET':
        return jsonify(data="Type something!")