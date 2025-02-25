import threading
import time
import pyautogui
import keyboard
from modules.utils import save_to_file, load_from_file

auto_combo_enabled = False
anti_logout_enabled = False
combo_event = threading.Event()
combo_running = False

current_combo_hook = None
stop_hook = None

def execute_move(move_list):
    for move in move_list:
        if move.get('delay'):
            delay_sec = float(move['delay']) / 1000.0
            print(f"Waiting for {delay_sec} seconds")
            time.sleep(delay_sec)
        if move.get('hotkey'):
            hotkey = move.get('hotkey')
            if execute_key_action(combo_event, hotkey['keyName']):
                print(f"Executing action {hotkey['keyName']}")

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

    threading.Thread(target=run, daemon=True).start()
    return f"Keyboard events {'enabled' if anti_logout_enabled else 'disabled'}"

def toggle_auto_combo(trigger_key, current_combo, stop_key='home'):
    global auto_combo_enabled, current_combo_hook, stop_hook
    auto_combo_enabled = not auto_combo_enabled

    if auto_combo_enabled:
        if current_combo_hook is not None:
            keyboard.unhook(current_combo_hook)
        current_combo_hook = keyboard.on_press_key(trigger_key, lambda event: run_combo(current_combo))
        
        if stop_hook is not None:
            keyboard.unhook(stop_hook)
        stop_hook = keyboard.on_press_key(stop_key, lambda event: stop_function(combo_event))
    else:
        if current_combo_hook is not None:
            keyboard.unhook(current_combo_hook)
            current_combo_hook = None
        if stop_hook is not None:
            keyboard.unhook(stop_hook)
            stop_hook = None

    return f"Keyboard events {'enabled' if auto_combo_enabled else 'disabled'}"

def update_current_combo(trigger_key, current_combo):
    global current_combo_hook
    if current_combo_hook is not None:
        keyboard.unhook(current_combo_hook)
        current_combo_hook = None

    current_combo_hook = keyboard.on_press_key(trigger_key, lambda event: run_combo(current_combo))
    return current_combo

def run_combo(current_combo):
    global combo_running
    if combo_running:
        print("Combo already in progress; ignoring trigger.")
        return
    combo_event.clear()
    combo_running = True
    threading.Thread(target=fire_combo, args=(current_combo,), daemon=True).start()

def fire_combo(current_combo):
    global combo_running
    if auto_combo_enabled:
        execute_move(current_combo.get('moveList', []))
    combo_running = False

def stop_function(event):
    global combo_running
    event.clear()
    event.set()
    combo_running = False

def execute_key_action(event, key):
    if event.is_set():
        return False
    keyboard.press_and_release(key)
    return True

def save_config(config, filename):
    return save_to_file(config, filename)

def load_config(filename):
    return load_from_file(filename)
