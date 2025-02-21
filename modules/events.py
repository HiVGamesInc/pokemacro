import threading
import time
import pyautogui
import keyboard
from modules.utils import save_to_file, load_from_file

auto_combo_enabled = False
anti_logout_enabled = False
combo_event = threading.Event()

def execute_move(moveList):
    for move in moveList:

        if move.get('delay'):
            delay_sec = float(move['delay']) / 1000.0
            print(f"waiting for {str(delay_sec)} seconds")
            time.sleep(delay_sec)

        for hotkey in move.get('hotkey', []):
            execute_key_action(combo_event, hotkey['keyName'])
            print(f"executing action {hotkey['keyName']}")

def toggle_anti_logout():
    global anti_logout_enabled
    anti_logout_enabled = not anti_logout_enabled

    def run():
        while anti_logout_enabled:
            with pyautogui.hold('ctrl'):
                pyautogui.press('a')
                time.sleep(1)
                pyautogui.press('d')
            time.sleep(5)

    threading.Thread(target=run).start()

    return "Keyboard events " + ("enabled" if anti_logout_enabled else "disabled")

def toggle_auto_combo(trigger_key, currentCombo, stop_key = 'home'):
    global auto_combo_enabled
    auto_combo_enabled = not auto_combo_enabled

    if auto_combo_enabled:
        keyboard.on_press_key(trigger_key, lambda event: run_combo(currentCombo))
        keyboard.on_press_key(stop_key, lambda event: stop_function(combo_event))
    else:
        keyboard.remove_all_hotkeys()

    return "Keyboard events " + ("enabled" if auto_combo_enabled else "disabled")

def update_current_combo(trigger_key, currentCombo):
    try:
        keyboard.remove_all_hotkeys()
    except KeyError:
        print(f"The key '{trigger_key}' does not exist.")

    keyboard.on_press_key(trigger_key, lambda event: run_combo(currentCombo))
    return currentCombo

def run_combo(currentCombo):
    combo_event.clear()
    threading.Thread(target=fire_combo, args=[currentCombo]).start()

def stop_function(event):
    event.clear()
    event.set()

def execute_key_action(event, key):
    if event.is_set():
        return False
    keyboard.press_and_release(key)
    return True

def fire_combo(currentCombo):
    global auto_combo_enabled

    if auto_combo_enabled:
        execute_move(currentCombo['moveList'])

def save_config(config, filename):
    return save_to_file(config, filename)

def load_config(filename):
    return load_from_file(filename)
