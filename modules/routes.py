from flask import jsonify
from modules import app
from modules.events import toggle_keyboard_events, toggle_mouse_events

@app.route('/toggle_keyboard', methods=['POST'])
def toggle_keyboard():
    message = toggle_keyboard_events()
    return jsonify({"message": message})

@app.route('/toggle_mouse', methods=['POST'])
def toggle_mouse():
    message = toggle_mouse_events()
    return jsonify({"message": message})
