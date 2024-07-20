from flask import jsonify
from modules import app
from modules.events import toggle_auto_combo, toggle_anti_logout

@app.route('/anti-logout', methods=['POST'])
def anti_logout():
    message = toggle_anti_logout()
    return jsonify({"message": message})

@app.route('/auto-combo', methods=['POST'])
def auto_combo():
    message = toggle_auto_combo('q', [{'key': 'F7', 'delay': 1}, {'key': 'F6', 'delay': 1}, {'key': 'F5', 'delay': 1}])
    return jsonify({"message": message})
