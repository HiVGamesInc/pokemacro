import threading
import time
import pyautogui
import keyboard
from modules.utils import save_to_file, load_from_file, capture_screen, extract_text, play_alert_sound
import easyocr
import numpy as np

auto_combo_enabled = False
anti_logout_enabled = False
alert_enabled = False
healing_enabled = False
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

def toggle_alert():
    global alert_enabled
    alert_enabled = not alert_enabled

    def run():
        # try:
        iteration = 0
        
        while alert_enabled:
            alert_config = load_from_file('alertConfig.json')
            offset_x = int(alert_config['fields']['offset_x']['value'])
            offset_y = int(alert_config['fields']['offset_y']['value'])
            x_length = int(alert_config['fields']['x_length']['value'])
            y_length = int(alert_config['fields']['y_length']['value'])

            battle_box = (offset_x, offset_y, x_length, y_length)
            # Capture the battle box region
            screenshot = capture_screen(bbox=battle_box)

            iteration += 1

            # Extract text from the screenshot
            text = extract_text(screenshot)

            # Split the text into lines and check for matches
            should_play_sound = False
            line_to_print = ''
            for line in text.splitlines():
                line_stripped = line.strip()
                if line_stripped:
                    line_has_any_target = False
                    for target in alert_config['hunt']['list']:
                        if target in line_stripped:
                            line_has_any_target = True
                    if line_has_any_target == False:
                        line_to_print = line_stripped
                        should_play_sound = True
                
            if should_play_sound:
                play_alert_sound()
            
            del screenshot
            del text

            time.sleep(0.5)
        # except Exception as e:
        #     print(f"Error running alert: {str(e)}")

    threading.Thread(target=run, daemon=True).start()
    return {
        "alert_enabled": alert_enabled,
        "message": f"Alert {'enabled' if alert_enabled else 'disabled'}"
    }

def toggle_healing():
    global healing_enabled
    healing_enabled = not healing_enabled

    def run():
        reader = easyocr.Reader(['en'])
        iteration = 0
        while healing_enabled:
            heal_config = load_from_file('healConfig.json')
            keybindings = load_from_file('keybindings.json')

            ph_x_start = int(heal_config['fields']['poke_heal_x_start']['value'])
            ph_x_end = int(heal_config['fields']['poke_heal_x_end']['value'])
            ph_y_start = int(heal_config['fields']['poke_heal_y_start']['value'])
            ph_y_end = int(heal_config['fields']['poke_heal_y_end']['value'])

            pokemon_life_box = (ph_x_start, ph_y_start, ph_x_end, ph_y_end)
            ph_hotkey = keybindings['Poke Heal']['keyName']
            ph_cooldown = int(heal_config['fields']['poke_heal_cooldown']['value'])
            ph_percent_limit = int(heal_config['fields']['poke_heal_percent_limit']['value']) / 100


            screenshot = capture_screen(bbox=pokemon_life_box)

            # save_debug_image(screenshot, iteration)
            iteration += 1

            text_array = reader.readtext(np.array(screenshot), detail=0)
        
            if len(text_array) == 2:
                health = int(text_array[0])
                total_health = int(text_array[1])
                if health / total_health <= ph_percent_limit:
                    keyboard.press_and_release(ph_hotkey)
                    time.sleep(ph_cooldown)
                
            del screenshot
            
            # Wait for a short time before capturing the screen again
            time.sleep(0.5)
        del reader

    threading.Thread(target=run, daemon=True).start()
    return {
        "healing_enabled": healing_enabled,
        "message": f"Healing {'enabled' if healing_enabled else 'disabled'}"
    }

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
