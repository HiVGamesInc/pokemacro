from flask import request, jsonify
from modules import app
from modules.events import toggle_auto_combo, toggle_anti_logout, toggle_alert, update_current_combo, save_config, load_config

@app.route('/anti-logout', methods=['POST'])
def anti_logout():
    message = toggle_anti_logout()
    return jsonify({"message": message})

@app.route('/alert', methods=['POST'])
def alert():
    data = toggle_alert()
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
