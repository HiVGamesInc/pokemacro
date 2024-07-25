import threading
import time
import pyautogui
import keyboard
from modules.utils import save_to_file, load_from_file

auto_combo_enabled = False
anti_logout_enabled = False
combo_event = threading.Event()
revive_event = threading.Event()

def press_keys(itemList):
    for item in itemList:
        for hotkey in item['hotkey']:
            execute_key_action(combo_event, hotkey['keyName'], item['afterAttackDelay'] / 1000)

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

def toggle_auto_combo(trigger_key, currentCombo, stop_key = 'home', revive_key = 'del'):
    global auto_combo_enabled
    auto_combo_enabled = not auto_combo_enabled

    if auto_combo_enabled:
        keyboard.add_hotkey(trigger_key, run_combo, args=[currentCombo])
        keyboard.add_hotkey(stop_key, stop_function, args=[combo_event])
        keyboard.add_hotkey(revive_key, use_revive)
    else:
        keyboard.remove_all_hotkeys()

    return "Keyboard events " + ("enabled" if auto_combo_enabled else "disabled")

def update_current_combo(trigger_key, currentCombo):
    try:
        keyboard.remove_all_hotkeys()
    except KeyError:
        print(f"The key '{trigger_key}' does not exist.")

    keyboard.add_hotkey(trigger_key, run_combo, args=[currentCombo])

def run_combo(currentCombo):
    combo_event.clear()
    threading.Thread(target=fire_combo, args=[currentCombo]).start()

def stop_function(event):
    event.set()

def execute_key_action(event, key, delay):
    if event.is_set():
        return False
    keyboard.press_and_release(key)
    time.sleep(delay)
    return True

def execute_mouse_action(event, action, position=None, delay=0.1):
    if event.is_set():
        return False
    if action == "move":
        pyautogui.moveTo(*position)
    elif action == "right_click":
        pyautogui.rightClick()
    time.sleep(delay)
    return True

def use_revive():
    def run():
        currentPos = pyautogui.position()
        
        if not execute_mouse_action(revive_event, "move", [1746, 265]):
            return
        if not execute_mouse_action(revive_event, "right_click"):
            return

        if not execute_key_action(revive_event, 'r', 0.3):  # reviveHotkey
            return

        if not execute_mouse_action(revive_event, "right_click"):
            return
        if not execute_mouse_action(revive_event, "move", currentPos):
            return
    
    revive_event.clear()
    threading.Thread(target=run).start()

def fire_combo(currentCombo):
    global auto_combo_enabled

    if auto_combo_enabled:
        actions = [
            ("press", '3', 0.1),  # pokestopHotkey
            ("press", '1', 0.1),  # offensiveHotkey
            ("press", 'f', 0.1),  # medicineHotkey
        ]

        for action, key, delay in actions:
            if not execute_key_action(combo_event, key, delay):
                return

        press_keys(currentCombo['itemList'])

        if currentCombo['useRevive']:
            use_revive()

        execute_key_action(combo_event, '2', 0.1)  # deffensiveHotkey

def save_config(config, filename):
    return save_to_file(config, filename)

def load_config(filename):
    return load_from_file(filename)
