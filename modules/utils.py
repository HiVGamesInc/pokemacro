import json
import os
import sys

def resource_path(relative_path):
    """
    Get the absolute path to a resource, works for both development and
    when running from a PyInstaller bundle.
    """
    if hasattr(sys, '_MEIPASS'):
        return os.path.join(sys._MEIPASS, relative_path)
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
