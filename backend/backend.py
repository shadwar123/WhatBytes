from flask import Flask, request, jsonify, session
from ast import literal_eval
from pymongo import MongoClient
from flask_cors import CORS
from email.message import EmailMessage
import smtplib
import ssl
import jwt
import datetime
import json
from flask_session import Session
import os
from datetime import datetime, timedelta, timezone

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24)
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)
cors = CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

# MongoDB connection
client = MongoClient('mongodb+srv://shadwarnayyar872:EuKuqx7M0IvJDSSE@cluster0.sjxm0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
db = client.get_database('manit')

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == 'POST':
        user_input = request.data
        user_input = literal_eval(user_input.decode('utf-8'))
       
        existing_user = db.user.find_one({'email': user_input["user"]["email"]})
        
        if not existing_user:
            return jsonify({'message': 'No Email exists'}), 400
        
        user_db = db.user.find_one({"email": user_input["user"]["email"]})
        
        if user_db['password'] == user_input["user"]["password"]:
            session['user_email'] = user_db['email']
            return jsonify({'message': 'Login successful'}), 200
        else:
            return jsonify({'message': 'Invalid email or password'}), 401


# Function to send a password reset email
def send_reset_email(email, reset_token):
    email_sender = ''
    email_password = ''  # Replace with your actual app-specific password
    email_receiver = email

    subject = 'Password Reset Request'
    reset_link = f"http://127.0.0.1:3000/reset-password?token={reset_token}"
    body = f"Click the following link to reset your password: {reset_link}"

    em = EmailMessage()
    em['From'] = email_sender
    em['To'] = email_receiver
    em['Subject'] = subject
    em.set_content(body)

    # Create a secure SSL context
    context = ssl.create_default_context()

    # Sending the email
    with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
        smtp.login(email_sender, email_password)
        smtp.send_message(em)  # Use send_message instead of sendmail

# Route to handle password reset requests
@app.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    user = db.user.find_one({'email': email})

    if user:
        # Generate a password reset token
        reset_token = jwt.encode(
            {'email': email, 'exp': datetime.now(timezone.utc) + timedelta(hours=1)},
            app.config['SECRET_KEY'],
            algorithm="HS256"
        )
        send_reset_email(email, reset_token)  # Send the reset email
        return jsonify({"message": "Password reset email sent"}), 200
    else:
        return jsonify({"message": "Email not found"}), 404

@app.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('new_password')

    try:
        decoded_token = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        email = decoded_token['email']
        db.user.update_one({'email': email}, {'$set': {'password': new_password}})
        return jsonify({"message": "Password has been reset"}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token expired"}), 400
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 400

# Signup Route
@app.route("/signup", methods=["POST"])
def signup():
    if request.method == 'POST':
        user_input = request.data
        user_input = literal_eval(user_input.decode('utf-8'))
        user_input = json.loads(user_input["user"])
        
        existing_user = db.user.find_one({'email': user_input["email"]})
        
        if existing_user:
            return jsonify({'message': 'Email already exists'}), 400
        
        try:
            db.user.insert_one({
                "name": user_input["name"],
                "email": user_input["email"],
                "password": user_input["password"],
                "created_time": datetime.now(timezone.utc),
                "last_updated_time": datetime.now(timezone.utc)
            })
        except Exception as e:
            return jsonify({'message': 'Error in db'}), 500
        
        return jsonify({'message': 'Registration successful'}), 200

# Change Password
@app.route("/change_password", methods=["POST"])
def change_password():
    data = request.get_json()
    user_email = data.get('email')
    old_password = data.get('old_password')
    new_password = data.get('new_password')
    confirm_password = data.get('confirm_password')
    
    if not all([user_email, old_password, new_password, confirm_password]):
        return jsonify({'message': 'Please fill out all fields'}), 400

    if new_password != confirm_password:
        return jsonify({'message': 'New password and confirm password do not match'}), 400

    user = db.user.find_one({'email': user_email})
    
    if user is None or user['password'] != old_password:
        return jsonify({'message': 'Incorrect old password'}), 400

    db.user.update_one(
        {'email': user_email},
        {'$set': {'password': new_password, 'last_updated_time': datetime.now(timezone.utc)}}
    )

    return jsonify({'message': 'Password changed successfully'}), 200

# Profile Route
@app.route("/profile", methods=["GET"])
def get_profile():
    user_email = request.args.get('email')
    
    user = db.user.find_one({'email': user_email})
    
    if not user:
        return jsonify({'message': 'User not found'}), 404

    user['_id'] = str(user['_id'])
    user['created_time'] = user['created_time'].isoformat() if isinstance(user['created_time'], datetime) else user['created_time']
    user['last_updated_time'] = user['last_updated_time'].isoformat() if isinstance(user['last_updated_time'], datetime) else user['last_updated_time']
    
    return jsonify(user), 200

if __name__ == '__main__':
    app.run(debug=True)
