import json
import os
import sys
import pytesseract
from PIL import ImageGrab
import winsound


def get_appdata_path():
    """
    Returns the path to the Pokemacro folder in AppData.
    Creates the directory if it doesn't exist.
    """
    if os.name == 'nt':  # Windows
        appdata_dir = os.environ.get('APPDATA')
        if appdata_dir:
            pokemacro_dir = os.path.join(appdata_dir, 'Pokemacro')
        else:
            # Fallback for Windows if APPDATA is not available
            pokemacro_dir = os.path.join(os.path.expanduser('~'), 'AppData', 'Roaming', 'Pokemacro')
    else:
        # For other systems (Linux/Mac), use home directory
        pokemacro_dir = os.path.join(os.path.expanduser('~'), '.pokemacro')
    
    # Create directory if it doesn't exist
    os.makedirs(pokemacro_dir, exist_ok=True)
    return pokemacro_dir


def is_user_config_file(filename):
    """
    Determines if a file is a user configuration file that should be stored in AppData.
    """
    user_config_files = {
        'alertConfig.json',
        'healConfig.json', 
        'keybindings.json',
        'todoConfig.json',
        'weeklyTodoConfig.json',
        'autocatch.json',
        'autorevive.json',
        'autocombo.json'
    }
    return filename in user_config_files


def resource_path(relative_path):
    """
    Returns the absolute path to a resource.
    
    - User config files are stored in AppData/Pokemacro/
    - Default config files (configs/) are bundled with the application
    - Other files follow the original logic
    """
    # Extract just the filename for user config check
    filename = os.path.basename(relative_path)
    
    # If this is a user config file, store it in AppData
    if is_user_config_file(filename):
        return os.path.join(get_appdata_path(), filename)
    
    # Original logic for bundled configs and other files
    if hasattr(sys, "_MEIPASS"):
        # Running from a bundled executable.
        if relative_path.startswith("configs/"):
            # Files in the configs folder are bundled into the temp folder.
            return os.path.join(sys._MEIPASS, relative_path)
        else:
            # Other files are expected to be external (next to the .exe).
            return os.path.join(os.path.dirname(sys.executable), relative_path)
    else:
        # In development, assume files are in the project root.
        return os.path.join(os.path.abspath("."), relative_path)


def save_to_file(combo, filename='config.json'):
    path = resource_path(filename)
    try:
        # Ensure directory exists
        os.makedirs(os.path.dirname(path), exist_ok=True)
        
        with open(path, 'w', encoding='utf-8') as file:
            json.dump(combo, file, indent=2)
        print(f"File saved successfully to {path}")
    except Exception as e:
        print(f"Failed to save file: {str(e)}")

def load_from_file(filename='config.json'):
    path = resource_path(filename)
    try:
        with open(path, 'r', encoding='utf-8') as file:
            data = json.load(file)
        print(f"File loaded successfully from {path}")
        return data
    except FileNotFoundError:
        print(f"File {filename} not found at {path}. Returning an empty object.")
        return {}
    except Exception as e:
        print(f"Failed to load file: {str(e)}")
        return {}

def capture_screen(bbox=None):
    """Capture a specific region of the screen and return it as an image."""
    return ImageGrab.grab(bbox=bbox)

def extract_text(image):
    pytesseract.pytesseract.tesseract_cmd = 'tesseract-ocr\\tesseract.exe'
    return pytesseract.image_to_string(image)

def save_debug_image(image, iteration):
    """Save the captured image for debugging purposes."""
    debug_dir = os.path.join(get_appdata_path(), 'debug_images')
    os.makedirs(debug_dir, exist_ok=True)
    debug_image_path = os.path.join(debug_dir, f"debug_{iteration}.png")
    image.save(debug_image_path)
    print(f"Debug image saved: {debug_image_path}")

def play_alert_sound():
    """Play a sound alert."""
    frequency = 500  # Hz
    duration = 500  # milliseconds
    winsound.Beep(frequency, duration)