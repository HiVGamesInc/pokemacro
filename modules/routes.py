from flask import request, jsonify
from modules import app
from modules.events import toggle_auto_combo, toggle_anti_logout, update_current_combo, save_config, load_config

@app.route('/anti-logout', methods=['POST'])
def anti_logout():
    print("opaaaaa")
    message = toggle_anti_logout()
    return jsonify({"message": message})

@app.route('/auto-combo', methods=['POST'])
def auto_combo():
    data = request.get_json()

    key = data.get('key')
    combo = data.get('combo')

    print(f"Received key: {key}")
    print(f"Received combo: {combo}")

    message = toggle_auto_combo(key['keyName'], combo)

    return jsonify({"message": message})


@app.route('/update-combo', methods=['POST'])
def update_combo():
    data = request.get_json()

    key = data.get('key')
    combo = data.get('combo')

    print(f"Received key: {key}")
    print(f"Received combo: {combo}")

    message = update_current_combo(key['keyName'], combo)

    return jsonify({"message": message})

@app.route('/save-config', methods=['POST'])
def save_config_file():
    data = request.get_json()
    
    combo = data.get('combo')
    message = save_config(combo)

    return jsonify({"message": message})

@app.route('/load-config', methods=['POST'])
def load_config_file():
    message = load_config()

    return jsonify({"message": message})
