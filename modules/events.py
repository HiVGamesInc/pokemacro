import threading
import time
import pyautogui

keyboard_events_enabled = False
mouse_events_enabled = False

def toggle_keyboard_events():
    global keyboard_events_enabled
    keyboard_events_enabled = not keyboard_events_enabled
    if keyboard_events_enabled:
        start_keyboard_events()
    return "Keyboard events " + ("enabled" if keyboard_events_enabled else "disabled")

def toggle_mouse_events():
    global mouse_events_enabled
    mouse_events_enabled = not mouse_events_enabled
    if mouse_events_enabled:
        start_mouse_events()
    return "Mouse events " + ("enabled" if mouse_events_enabled else "disabled")

def start_keyboard_events():
    def run():
        while keyboard_events_enabled:
            pyautogui.typewrite("Hello from PyWebView!\n")
            time.sleep(5)
    
    threading.Thread(target=run).start()

def start_mouse_events():
    def run():
        while mouse_events_enabled:
            pyautogui.moveRel(100, 0, duration=0.5)
            pyautogui.moveRel(0, 100, duration=0.5)
            pyautogui.moveRel(-100, 0, duration=0.5)
            pyautogui.moveRel(0, -100, duration=0.5)
            time.sleep(5)

    threading.Thread(target=run).start()
