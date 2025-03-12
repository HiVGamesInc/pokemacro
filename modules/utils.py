import json
import os
import sys
import pytesseract
from PIL import ImageGrab
import winsound


def resource_path(relative_path):
    """
    Returns the absolute path to a resource.
    
    - In a bundled (PyInstaller one‑file) application, if the relative_path starts with "configs/",
      the file is expected to be bundled and extracted to sys._MEIPASS.
    - Otherwise, it is assumed to be external and located in the same directory as the executable.
    - In development, files are loaded from the project root.
    """
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
        print(f"File {filename} not found. Returning an empty object.")
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
    debug_image_path = os.path.join(DEBUG_IMAGE_DIR, f"debug_{iteration}.png")
    image.save(debug_image_path)
    print(f"Debug image saved: {debug_image_path}")

def play_alert_sound():
    """Play a sound alert."""
    frequency = 500  # Hz
    duration = 500  # milliseconds
    winsound.Beep(frequency, duration)