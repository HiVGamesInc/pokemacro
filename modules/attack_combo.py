import pyautogui
import time
from utils.global_state import global_state
from utils.globals import globals

def on_revive_slider_change(e):
    global selected_combo_name, revive_slider, revive_slider_value
    selected_combo = global_state.combos.get(globals.selected_combo_name, {})
    globals.revive_slider_value["value"] = round(e.control.value, 2)  
    globals.revive_slider_value.update()
    global_state.revive_slider_value = globals.revive_slider_value["value"]  
    selected_combo['revive_slider_value']  = globals.revive_slider_value["value"]  
    print(selected_combo)

def on_attack_delay_slider_change(e):
    global selected_combo_name, attack_delay_slider, attack_delay_slider_value
    selected_combo = global_state.combos.get(globals.selected_combo_name, {})
    globals.attack_delay_slider_value["value"] = round(e.control.value, 2)  
    globals.attack_delay_slider_value.update()
    global_state.attack_delay_slider_value = globals.attack_delay_slider_value["value"]  
    selected_combo['attack_delay_slider_value']  = globals.attack_delay_slider_value["value"] 
    print(selected_combo)

def on_use_revive_toggle(value):
    global_state.use_revive = value.control.value

def on_click(x, y, button, pressed):
    print('click attack')
    global is_tracking, is_tracking_revive
    globals.revive_position["value"] = f"{x},{y}"
    globals.revive_position.update()
    global_state.revive_position = globals.revive_position["value"]
    is_tracking_revive = False  

def on_revive_button_click(e):
    global is_tracking_revive
    is_tracking_revive = True

def use_auto_revive(useDelay, delayValue):
    global revive_hotkey_field

    if globals.revive_position["value"] is not None:
        currentPosition = pyautogui.position()
        if useDelay:
            print(delayValue)
            time.sleep(delayValue)
        x, y = map(int, globals.revive_position["value"].split(","))
        print(x, y)
        pyautogui.moveTo(x, y)
        pyautogui.rightClick()
        if global_state.revive_hotkey_field:
            time.sleep(0.1)
            pyautogui.keyDown(global_state.revive_hotkey_field)
            pyautogui.keyUp(global_state.revive_hotkey_field)

        time.sleep(0.1)
        pyautogui.rightClick()
        time.sleep(0.1)
        pyautogui.moveTo(currentPosition)

def iterate_and_process_items(item_list):
    print("combo")
    global revive_hotkey_field
    selected_combo = global_state.combos.get(globals.selected_combo_name, {})
    print(selected_combo)
    if global_state.pokestop_hotkey_field:
        pyautogui.press(global_state.pokestop_hotkey_field)
    print(selected_combo['item_list'])
    pyautogui.press('num1')
    pyautogui.press(global_state.medicine_hotkey_field)
    for name, hotkey in selected_combo['item_list']:
        process_item(name, hotkey)
        time.sleep(selected_combo['attack_delay_slider_value'])

    # catchAll("current", 0.8)
    pyautogui.press('num2')
    if globals.revive_position["value"] is not None and global_state.use_revive:
        use_auto_revive(True, selected_combo['revive_slider_value'])
    #     currentPosition = pyautogui.position()
    #     x, y = map(int, globals.revive_position["value"].split(","))
    #     print(x, y)
    #     pyautogui.moveTo(x, y)
    #     pyautogui.rightClick()
    #     if global_state.revive_hotkey_field:
    #         pyautogui.press(global_state.revive_hotkey_field)
    #         time.sleep(selected_combo['revive_slider_value'])
    #         pyautogui.leftClick()

    #     # my_keyboard.press(revive_hotkey_field.value,0.1)
    #     # pyautogui.moveTo(x, y)
    #     pyautogui.rightClick()
    #     time.sleep(0.1)
    #     pyautogui.moveTo(currentPosition)