"""
Key mapping utility for converting frontend key names to Python keyboard l    # Punctuation keys - THESE NEED TRANSLATION  
    "LeftBracket": "[",
    "RightBracket": "]",
    "[": "[",
    "]": "]",
    "Backslash": "\\",
    "Semicolon": ";",
    "Quote": "'",
    "Comma": ",",
    "Period": ".",
    "Slash": "/",
    "Minus": "-",
    "Equal": "=",
    "Grave": "`",
    
    # Additional frontend key mappings
    "Print": "print screen",
    "ScrollLock": "scroll lock",
    "Pause": "pause",
    "Menu": "menu",
    "Fn": "fn",t.

This module provides a mapping between the custom key names used in the frontend
and the key names expected by the Python keyboard library.
"""

# Mapping from frontend key names to Python keyboard library names
FRONTEND_TO_PYTHON_KEY_MAP = {
    # Function keys - these work as-is
    "Escape": "escape",
    "F1": "f1", "F2": "f2", "F3": "f3", "F4": "f4", 
    "F5": "f5", "F6": "f6", "F7": "f7", "F8": "f8",
    "F9": "f9", "F10": "f10", "F11": "f11", "F12": "f12",
    
    # Number keys - work as-is
    "1": "1", "2": "2", "3": "3", "4": "4", "5": "5",
    "6": "6", "7": "7", "8": "8", "9": "9", "0": "0",
    
    # Letter keys - work as-is (case insensitive)
    "A": "a", "B": "b", "C": "c", "D": "d", "E": "e", "F": "f",
    "G": "g", "H": "h", "I": "i", "J": "j", "K": "k", "L": "l",
    "M": "m", "N": "n", "O": "o", "P": "p", "Q": "q", "R": "r",
    "S": "s", "T": "t", "U": "u", "V": "v", "W": "w", "X": "x",
    "Y": "y", "Z": "z",
    
    # Modifier keys - THESE NEED TRANSLATION
    "LeftShift": "left shift",
    "RightShift": "right shift", 
    "LeftControl": "left ctrl",
    "RightControl": "right ctrl",
    "LeftAlt": "left alt",
    "RightAlt": "right alt",
    "LeftWin": "left win",
    "RightWin": "right win",
    "LeftCmd": "left win",  # Mac command key
    "RightCmd": "right win",
    "LeftSuper": "left win",
    "RightSuper": "right win",
    
    # Special keys
    "Space": "space",
    "Tab": "tab",
    "Return": "enter",
    "Enter": "enter", 
    "Backspace": "backspace",
    "Delete": "delete",
    "Insert": "insert",
    "Home": "home",
    "End": "end",
    "PageUp": "page up",
    "PageDown": "page down",
    "CapsLock": "caps lock",
    "NumLock": "num lock",
    
    # Arrow keys
    "Up": "up",
    "Down": "down", 
    "Left": "left",
    "Right": "right",
    
    # Numpad keys - THESE NEED TRANSLATION
    "NumPad0": "num 0",
    "NumPad1": "num 1",
    "NumPad2": "num 2", 
    "NumPad3": "num 3",
    "NumPad4": "num 4",
    "NumPad5": "num 5",
    "NumPad6": "num 6",
    "NumPad7": "num 7",
    "NumPad8": "num 8",
    "NumPad9": "num 9",
    "Add": "num plus",
    "Subtract": "num minus", 
    "Multiply": "num *",
    "Divide": "num /",
    "Decimal": "num decimal",
    "Clear": "num clear",
    
    # Punctuation keys - THESE NEED TRANSLATION  
    "LeftBracket": "[",
    "RightBracket": "]",
    "[": "[",
    "]": "]",
    "Backslash": "\\",
    "Semicolon": ";",
    "Quote": "'",
    "Comma": ",",
    "Period": ".",
    "Slash": "/",
    "Minus": "-",
    "Equal": "=",
    "Grave": "`",
    
    # Audio/Media keys
    "AudioMute": "volume mute",
    "AudioVolDown": "volume down", 
    "AudioVolUp": "volume up",
    "AudioPlay": "play/pause media",
    "AudioStop": "stop media",
    "AudioPause": "play/pause media",
    "AudioPrev": "previous track",
    "AudioNext": "next track",
    "AudioRewind": "previous track",
    "AudioForward": "next track", 
    "AudioRepeat": "play/pause media",
    "AudioRandom": "play/pause media",
    
    # Additional keys from frontend
    "Print": "print screen",
    "ScrollLock": "scroll lock", 
    "Pause": "pause",
    "Menu": "menu",
    "Fn": "fn",
}


def convert_key_name(frontend_key_name):
    """
    Convert a frontend key name to the format expected by Python keyboard library.
    
    Args:
        frontend_key_name (str): Key name from the frontend (e.g., "LeftShift", "NumPad1")
    
    Returns:
        str: Key name in Python keyboard library format (e.g., "left shift", "num 1")
    
    Examples:
        >>> convert_key_name("LeftShift")
        "left shift"
        >>> convert_key_name("NumPad1")  
        "num 1"
        >>> convert_key_name("F1")
        "f1"
    """
    if not frontend_key_name:
        return frontend_key_name
        
    # Try direct mapping first
    if frontend_key_name in FRONTEND_TO_PYTHON_KEY_MAP:
        return FRONTEND_TO_PYTHON_KEY_MAP[frontend_key_name]
    
    # If no direct mapping, return lowercase version (many keys work this way)
    return frontend_key_name.lower()


def validate_key_name(key_name):
    """
    Validate that a key name will work with the Python keyboard library.
    
    Args:
        key_name (str): Key name to validate
    
    Returns:
        tuple: (is_valid: bool, error_message: str or None)
    """
    try:
        import keyboard
        keyboard.parse_hotkey(key_name)
        return True, None
    except Exception as e:
        return False, str(e)


def get_working_key_alternatives(frontend_key_name):
    """
    Get alternative key names that might work if the primary mapping fails.
    
    Args:
        frontend_key_name (str): Original frontend key name
    
    Returns:
        list: List of alternative key name strings to try
    """
    alternatives = []
    
    # Primary conversion
    primary = convert_key_name(frontend_key_name)
    alternatives.append(primary)
    
    # Add common alternatives
    if "left" in primary.lower():
        # Try without "left" prefix
        alternatives.append(primary.replace("left ", ""))
    
    if "right" in primary.lower():
        # Try without "right" prefix  
        alternatives.append(primary.replace("right ", ""))
        
    if "num " in primary.lower():
        # Try without "num" prefix for numpad keys
        alternatives.append(primary.replace("num ", ""))
        
    # Try just the original name in lowercase
    if frontend_key_name.lower() not in alternatives:
        alternatives.append(frontend_key_name.lower())
    
    return alternatives


if __name__ == "__main__":
    # Test the conversion for problematic keys
    test_keys = [
        "LeftShift", "NumPad1", "LeftControl", "LeftAlt", 
        "RightBracket", "LeftBracket", "Minus", "Space", "F1"
    ]
    
    print("Key Conversion Test:")
    print("=" * 50)
    
    for key in test_keys:
        converted = convert_key_name(key)
        print(f"{key:15} -> {converted}")
        
        # Test if it works
        try:
            import keyboard
            keyboard.parse_hotkey(converted)
            print(f"{'':15}    ✓ WORKS")
        except:
            print(f"{'':15}    ✗ FAILED")
            # Try alternatives
            alternatives = get_working_key_alternatives(key)
            for alt in alternatives[1:]:  # Skip the first one we already tried
                try:
                    keyboard.parse_hotkey(alt)
                    print(f"{'':15}    ✓ ALTERNATIVE: {alt}")
                    break
                except:
                    continue
        print()
