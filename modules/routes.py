import os
from flask import request, jsonify, send_from_directory
from modules import app
from modules.events import toggle_auto_combo, toggle_anti_logout, toggle_alert, toggle_healing, update_current_combo, save_config, load_config, execute_crop_area, toggle_auto_catch, toggle_mouse_tracking, get_mouse_coords, toggle_auto_revive, add_todo_item, toggle_todo_item, delete_todo_item, update_todo_item, reset_all_todos, get_todo_stats, add_weekly_todo_item, toggle_weekly_todo_item, delete_weekly_todo_item, update_weekly_todo_item, reset_all_weekly_todos, get_weekly_todo_stats
from modules.key_mapper import convert_key_name
from modules.updater import get_updater

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

    # Convert frontend key name to Python keyboard library format
    python_key_name = convert_key_name(key['keyName'])
    message = toggle_auto_combo(python_key_name, combo)

    return jsonify(message)


@app.route('/update-combo', methods=['POST'])
def update_combo():
    data = request.get_json()

    key = data.get('key')
    combo = data.get('combo')

    # Ensure moveList structure is correct
    combo['moveList'] = [
        {
            **move,
            'hotkey': move.get('hotkey', None)  # Preserve hotkey structure
        }
        for move in combo.get('moveList', [])
    ]

    # Convert frontend key name to Python keyboard library format
    python_key_name = convert_key_name(key['keyName'])
    message = update_current_combo(python_key_name, combo)

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

@app.route('/crop-image', methods=['POST'])
def crop_image():
    result = execute_crop_area()
    return jsonify(result)

@app.route('/auto-catch', methods=['POST'])
def auto_catch():
    result = toggle_auto_catch()
    return jsonify(result)

# Endpoint to serve a single image file
@app.route('/images/<filename>', methods=['GET'])
def serve_image(filename):
    images_folder = os.path.join(os.path.abspath("."), "images")
    return send_from_directory(images_folder, filename)

# Endpoint to list all images in the images folder
@app.route('/list-images', methods=['GET'])
def list_images():
    images_folder = os.path.join(os.path.abspath("."), "images")
    if not os.path.exists(images_folder):
        os.makedirs(images_folder)
    files = os.listdir(images_folder)
    # Filter by image extensions
    image_files = [f for f in files if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif'))]
    return jsonify({"images": image_files})

@app.route('/delete-image/<filename>', methods=['DELETE'])
def delete_image(filename):
    images_folder = os.path.join(os.path.abspath("."), "images")
    file_path = os.path.join(images_folder, filename)
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            return jsonify({"message": "Image deleted successfully"})
        else:
            return jsonify({"message": "Image not found"}), 404
    except Exception as e:
        return jsonify({"message": f"Error deleting image: {str(e)}"}), 500
    
    
@app.route('/rename-image', methods=['POST'])
def rename_image():
    data = request.get_json()
    old_filename = data.get('oldFilename')
    new_filename = data.get('newFilename')

    images_folder = os.path.join(os.path.abspath("."), "images")
    old_path = os.path.join(images_folder, old_filename)
    new_path = os.path.join(images_folder, new_filename)

    try:
        if not os.path.exists(old_path):
            return jsonify({"message": "File not found"}), 404
        os.rename(old_path, new_path)
        return jsonify({"message": "File renamed successfully", "newFilename": new_filename})
    except Exception as e:
        return jsonify({"message": f"Error renaming file: {str(e)}"}), 500

@app.route('/toggle-mouse-tracking', methods=['POST'])
def mouse_tracking():
    result = toggle_mouse_tracking()
    return jsonify(result)

@app.route('/get-mouse-coords', methods=['GET'])
def mouse_coordinates():
    coords = get_mouse_coords()
    return jsonify(coords)

@app.route('/auto-revive', methods=['POST'])
def auto_revive():
    data = toggle_auto_revive()
    return jsonify({"data": data})

# Todo routes
@app.route('/todo/add', methods=['POST'])
def add_todo():
    data = request.get_json()
    todo_text = data.get('text')
    parent_id = data.get('parentId')
    
    message = add_todo_item(todo_text, parent_id)
    return jsonify(message)

@app.route('/todo/toggle', methods=['POST'])
def toggle_todo():
    data = request.get_json()
    todo_id = data.get('id')
    
    message = toggle_todo_item(todo_id)
    return jsonify(message)

@app.route('/todo/delete', methods=['POST'])
def delete_todo():
    data = request.get_json()
    todo_id = data.get('id')
    
    message = delete_todo_item(todo_id)
    return jsonify(message)

@app.route('/todo/update', methods=['POST'])
def update_todo():
    data = request.get_json()
    todo_id = data.get('id')
    new_text = data.get('text')
    
    message = update_todo_item(todo_id, new_text)
    return jsonify(message)

@app.route('/todo/reset', methods=['POST'])
def reset_todos():
    message = reset_all_todos()
    return jsonify(message)

@app.route('/todo/stats', methods=['GET'])
def todo_stats():
    message = get_todo_stats()
    return jsonify(message)

# Weekly Todo routes
@app.route('/weekly-todo/add', methods=['POST'])
def add_weekly_todo():
    data = request.get_json()
    todo_text = data.get('text')
    parent_id = data.get('parentId')
    
    message = add_weekly_todo_item(todo_text, parent_id)
    return jsonify(message)

@app.route('/weekly-todo/toggle', methods=['POST'])
def toggle_weekly_todo():
    data = request.get_json()
    todo_id = data.get('id')
    
    message = toggle_weekly_todo_item(todo_id)
    return jsonify(message)

@app.route('/weekly-todo/delete', methods=['POST'])
def delete_weekly_todo():
    data = request.get_json()
    todo_id = data.get('id')
    
    message = delete_weekly_todo_item(todo_id)
    return jsonify(message)

@app.route('/weekly-todo/update', methods=['POST'])
def update_weekly_todo():
    data = request.get_json()
    todo_id = data.get('id')
    new_text = data.get('text')
    
    message = update_weekly_todo_item(todo_id, new_text)
    return jsonify(message)

@app.route('/weekly-todo/reset', methods=['POST'])
def reset_weekly_todos():
    message = reset_all_weekly_todos()
    return jsonify(message)

@app.route('/weekly-todo/stats', methods=['GET'])
def weekly_todo_stats():
    message = get_weekly_todo_stats()
    return jsonify(message)

# Auto-updater routes
@app.route('/update/check', methods=['GET'])
def check_for_updates():
    """Check if there are any updates available"""
    updater = get_updater()
    result = updater.check_for_updates()
    return jsonify(result)

@app.route('/update/info', methods=['GET'])
def get_update_info():
    """Get current update status and information"""
    updater = get_updater()
    return jsonify({
        "current_version": updater.current_version,
        "update_available": updater.update_available,
        "is_checking": updater.is_checking,
        "latest_release_info": updater.latest_release_info
    })

@app.route('/update/download', methods=['POST'])
def download_update():
    """Download the available update"""
    updater = get_updater()
    
    if not updater.update_available:
        return jsonify({"error": True, "message": "No update available"}), 400
    
    # Start download in background
    def download_with_progress():
        def progress_callback(progress):
            # In a real implementation, you might want to store this progress
            # in a shared state or send it via WebSocket
            pass
        
        return updater.download_update(progress_callback)
    
    result = download_with_progress()
    
    if result.get('error'):
        return jsonify(result), 500
    
    # Store download info for installation
    app.config['UPDATE_DOWNLOAD_INFO'] = result
    
    return jsonify({
        "success": True,
        "message": "Update downloaded successfully",
        "ready_to_install": True
    })

@app.route('/update/install', methods=['POST'])
def install_update():
    """Install the downloaded update"""
    if 'UPDATE_DOWNLOAD_INFO' not in app.config:
        return jsonify({"error": True, "message": "No update downloaded"}), 400
    
    download_info = app.config['UPDATE_DOWNLOAD_INFO']
    updater = get_updater()
    
    result = updater.install_update(
        download_info['temp_file_path'],
        download_info['temp_dir']
    )
    
    if result.get('error'):
        return jsonify(result), 500
    
    # Clean up download info
    app.config.pop('UPDATE_DOWNLOAD_INFO', None)
    
    return jsonify(result)