import threading
import time
import pyautogui
import keyboard

auto_combo_enabled = False
anti_logout_enabled = False

def press_keys(itemList):
    for item in itemList:
        for hotkey in item['hotkey']:
            keyboard.press_and_release(hotkey['keyName'])
        time.sleep(item['afterAttackDelay'] / 1000)

# example: toggle_anti_logout()
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

# example: toggle_auto_combo('ctrl+b', [{'key': 'p', 'delay': 1}, {'key': 'ctrl+v', 'delay': 1}])
def toggle_auto_combo(trigger_key, currentCombo):
    global auto_combo_enabled
    auto_combo_enabled = not auto_combo_enabled

    if auto_combo_enabled:
        keyboard.add_hotkey(trigger_key, fire_combo, args=(currentCombo,))
    else:
        keyboard.remove_hotkey(trigger_key)

    return "Keyboard events " + ("enabled" if auto_combo_enabled else "disabled")

def update_current_combo(trigger_key, currentCombo):
    keyboard.remove_hotkey(trigger_key)
    keyboard.add_hotkey(trigger_key, fire_combo, args=(currentCombo,))

    return "Combo updated"

def fire_combo(currentCombo):
    mousePosition = pyautogui.position()
    offensiveHotkey = '1'
    deffensiveHotkey = '2'
    pokestopHotkey = '3'
    medicineHotkey = 'f'
    reviveHotkey = 'r'
    pokemonPosition = [1746, 265]

    keyboard.press_and_release(pokestopHotkey)
    time.sleep(0.1)
    keyboard.press_and_release(offensiveHotkey)
    time.sleep(0.1)
    keyboard.press_and_release(medicineHotkey)
    time.sleep(0.1)

    press_keys(currentCombo['itemList'])
    time.sleep(0.3)
    pyautogui.moveTo(*pokemonPosition)
    time.sleep(0.1)
    pyautogui.rightClick()
    time.sleep(0.1)
    keyboard.press_and_release(reviveHotkey)
    time.sleep(0.3)
    pyautogui.rightClick()
    time.sleep(0.1)
    pyautogui.moveTo(mousePosition)
    time.sleep(0.1)
    keyboard.press_and_release(deffensiveHotkey)

def toggle_mouse_events():
    global mouse_events_enabled
    mouse_events_enabled = not mouse_events_enabled
    if mouse_events_enabled:
        start_mouse_events()
    return "Mouse events " + ("enabled" if mouse_events_enabled else "disabled")

def start_mouse_events():
    def run():
        while mouse_events_enabled:
            pyautogui.moveRel(100, 0, duration=0.5)
            pyautogui.moveRel(0, 100, duration=0.5)
            pyautogui.moveRel(-100, 0, duration=0.5)
            pyautogui.moveRel(0, -100, duration=0.5)
            time.sleep(5)

    threading.Thread(target=run).start()
