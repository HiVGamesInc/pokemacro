import os
from flask import request, jsonify, send_from_directory
from modules import app
from modules.events import toggle_auto_combo, toggle_anti_logout, toggle_alert, toggle_healing, update_current_combo, save_config, load_config, execute_crop_area, toggle_auto_catch

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