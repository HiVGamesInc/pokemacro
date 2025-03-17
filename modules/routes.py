from flask import request, jsonify
from modules import app
from modules.events import toggle_auto_combo, toggle_anti_logout, toggle_alert, toggle_healing, update_current_combo, save_config, load_config
import subprocess

@app.route('/anti-logout', methods=['POST'])
def anti_logout():
    message = toggle_anti_logout()
    return jsonify({"message": message})

@app.route('/alert', methods=['POST'])
def alert():
    data = toggle_alert()
    return jsonify({"data": data})

@app.route('/healing', methods=['POST'])
def healing():
    data = toggle_healing()
    return jsonify({"data": data})

@app.route('/auto-combo', methods=['POST'])
def auto_combo():
    data = request.get_json()

    key = data.get('key')
    combo = data.get('combo')

    message = toggle_auto_combo(key['keyName'], combo)

    return jsonify(message)


@app.route('/update-combo', methods=['POST'])
def update_combo():
    data = request.get_json()

    key = data.get('key')
    combo = data.get('combo')

    message = update_current_combo(key['keyName'], combo)

    return jsonify(message)

@app.route('/save-config', methods=['POST'])
def save_config_file():
    data = request.get_json()
    
    config = data.get('config')
    filename = data.get('filename')

    message = save_config(config, filename)

    return jsonify(message)

@app.route('/load-config', methods=['POST'])
def load_config_file():
    data = request.get_json()

    filename = data.get('filename')
    
    message = load_config(filename)

    return jsonify(message)

selection_data = None  # Store selection data globally

@app.route("/start-selection", methods=["POST"])
def start_selection():
    global selection_data
    selection_data = None
    """Start the selection tool as a separate process"""
    subprocess.Popen(["python", "modules/screen_picker.py"], creationflags=subprocess.CREATE_NO_WINDOW)
    return jsonify({"message": "Selection started"})

@app.route("/selection", methods=["POST"])
def receive_selection():
    """Receive selection coordinates from PyQt"""
    global selection_data
    selection_data = request.json
    print("Received selection:", selection_data)
    return jsonify({"message": "Selection received"})

@app.route("/get-selection", methods=["GET"])
def get_selection():
    """Return the last selection coordinates"""
    if selection_data:
        return jsonify({ "selection": selection_data })
    return jsonify({"message": "No selection made yet"})