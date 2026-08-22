from flask import Flask, request, jsonify, send_from_directory
import os
import random
import json

USERS_FILE = 'users.json'

def load_users():
    if not os.path.exists(USERS_FILE):
        default_users = {
            'admin_mds': {'password': 'admin@mds123', 'role': 'admin'}
        }
        with open(USERS_FILE, 'w') as f:
            json.dump(default_users, f)
        return default_users
    with open(USERS_FILE, 'r') as f:
        return json.load(f)

def save_users(users):
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f, indent=4)


# Import data from local python files
try:
    from data import DEFAULT_PRODUCTS, DEFAULT_CATEGORIES
    from grocery_intents_dataset import INTENTS
except ImportError:
    DEFAULT_PRODUCTS = []
    DEFAULT_CATEGORIES = []
    INTENTS = []

app = Flask(__name__, static_folder='.', static_url_path='')

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    users = load_users()
    if username in users and users[username]['password'] == password:
        return jsonify({'success': True, 'role': users[username]['role']})
    else:
        return jsonify({'success': False, 'message': 'Invalid credentials'})

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'success': False, 'message': 'Username and password required'})
        
    users = load_users()
    if username in users:
        return jsonify({'success': False, 'message': 'Username already exists'})
        
    # All new signups are customers by default
    users[username] = {'password': password, 'role': 'customer'}
    save_users(users)
    
    return jsonify({'success': True, 'role': 'customer'})

@app.route('/api/assist', methods=['POST'])
def assist():
    data = request.json
    query = data.get('query', '').lower()
    
    # 1. Check general intents
    for intent in INTENTS:
        for pattern in intent.get('patterns', []):
            if pattern.lower() in query:
                return jsonify({'response': random.choice(intent.get('responses', []))})
    
    # 2. Check KB (Products and Categories)
    found_products = []
    for product in DEFAULT_PRODUCTS:
        name = product.get('name', '').lower()
        category = product.get('category', '').lower()
        subcat = product.get('subCategory', '').lower()
        
        if query in name or query in category or query in subcat:
            found_products.append(product)
            
    if found_products:
        # Just return the top matches
        response_text = "I found the following items:\n"
        for p in found_products[:3]: # Limit to 3
            response_text += f"- {p.get('name')} (₹{p.get('price')} / {p.get('category')})\n"
        if len(found_products) > 3:
            response_text += f"...and {len(found_products)-3} more."
        return jsonify({'response': response_text})
        
    # 3. Fallback as requested by user
    return jsonify({'response': "I do not have that info."})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
