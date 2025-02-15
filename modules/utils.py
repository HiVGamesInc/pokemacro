import json

def save_to_file(combo, filename='config.json'):
    try:
        with open(filename, 'w') as file:
            json.dump(combo, file, indent=2)
        print(f"File saved successfully to {filename}")
    except Exception as e:
        print(f"Failed to save file: {str(e)}")

def load_from_file(filename='config.json'):
    try:
        with open(filename, 'r') as file:
            data = json.load(file)
        print(f"File loaded successfully from {filename}")
        return data
    except FileNotFoundError:
        print(f"File {filename} not found. Returning an empty object.")
        return {}
    except Exception as e:
        print(f"Failed to load file: {str(e)}")
        return {}
