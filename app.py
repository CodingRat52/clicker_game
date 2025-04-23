
from flask import Flask, render_template, request, jsonify
import sqlite3
import os

app = Flask(__name__)

DB_FILE = 'database.db'

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    if not os.path.exists(DB_FILE):
        conn = get_db_connection()
        conn.execute('CREATE TABLE IF NOT EXISTS scores (id INTEGER PRIMARY KEY, name TEXT, score INTEGER)')
        conn.commit()
        conn.close()

@app.route('/')
def index():
    init_db()
    conn = get_db_connection()
    scores = conn.execute('SELECT * FROM scores ORDER BY score DESC LIMIT 10').fetchall()
    conn.close()
    return render_template('index.html', scores=scores)

@app.route('/save', methods=['POST'])
def save():
    data = request.get_json()
    name = data['name']
    score = data['score']
    conn = get_db_connection()
    conn.execute('INSERT INTO scores (name, score) VALUES (?, ?)', (name, score))
    conn.commit()
    conn.close()
    return jsonify({'status': 'success'})

if __name__ == '__main__':
    app.run(debug=True)
