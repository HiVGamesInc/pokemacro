from flask import Flask, request, jsonify
from modules import app
from modules.events import toggle_auto_combo, toggle_anti_logout, update_current_combo

@app.route('/anti-logout', methods=['POST'])
def anti_logout():
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


@app.route('/update-combo', methods=['PUT'])
def update_combo():
    data = request.get_json()

    key = data.get('key')
    combo = data.get('combo')

    print(f"Received key: {key}")
    print(f"Received combo: {combo}")

    message = update_current_combo(key['keyName'], combo)

    return jsonify({"message": message})