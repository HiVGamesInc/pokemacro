from flask import Flask, send_from_directory
import os
import sys

def resource_path(relative_path):
    """ Get the absolute path to a resource, works for dev and for PyInstaller """
    if hasattr(sys, '_MEIPASS'):
        # PyInstaller places temporary files in a folder specified by _MEIPASS
        return os.path.join(sys._MEIPASS, relative_path)
    return os.path.join(os.path.abspath("."), relative_path)

def initialize_config_system():
    """
    Initialize the configuration system by ensuring AppData directory exists.
    """
    from modules.utils import get_appdata_path
    
    # Ensure AppData directory exists
    appdata_path = get_appdata_path()
    print(f"Pokemacro configuration directory: {appdata_path}")

# Initialize the config system when the module is imported
initialize_config_system()

app = Flask(__name__, static_folder=resource_path('app/build'))

from modules import routes

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_file_in_dir(path):
    if not os.path.isfile(os.path.join(app.static_folder, path)):
        path = os.path.join(path, 'index.html')
    return send_from_directory(app.static_folder, path)
