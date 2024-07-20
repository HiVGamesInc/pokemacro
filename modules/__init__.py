from flask import Flask, send_from_directory
import os

app = Flask(__name__, static_folder='../app/build')

from modules import routes

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_file_in_dir(path):
    if not os.path.isfile(os.path.join(app.static_folder, path)):
        path = os.path.join(path, 'index.html')
    return send_from_directory(app.static_folder, path)
