import os
import threading
import time
import cv2
import pyautogui
import keyboard
from modules.snipper import get_crop_area
from modules.utils import save_to_file, load_from_file, capture_screen, extract_text, play_alert_sound
import easyocr
import numpy as np


auto_combo_enabled = False
anti_logout_enabled = False
alert_enabled = False
healing_enabled = False
combo_event = threading.Event()
combo_running = False
cached_auto_catch_config = None
current_combo_hook = None
stop_hook = None
auto_catch_hook = None 
auto_catch_enabled = False
pokeball_trigger_key = None
auto_catch_enabled = False

def execute_move(move_list):
    for move in move_list:
        if move.get('delay'):
            delay_sec = float(move['delay']) / 1000.0
            print(f"Waiting for {delay_sec} seconds")
            time.sleep(delay_sec)
        if move.get('autoCatch'):
            locate_and_interact_with_images()
            continue
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

def execute_crop_area():
    try:
        # Get the crop area and full screenshot from the snipper
        x, y, w, h, full_screenshot = get_crop_area()
        cropped_img = full_screenshot.crop((x, y, x + w, y + h))
        
        # Ensure the 'images' folder exists
        images_folder = "images"
        if not os.path.exists(images_folder):
            os.makedirs(images_folder)
        
        # Generate a unique filename using a timestamp
        timestamp = int(time.time())
        output_filename = f"cropped_{timestamp}.png"
        output_path = os.path.join(images_folder, output_filename)
        
        cropped_img.save(output_path)
        
        return {"message": "Cropping completed", "image": output_path}
    except Exception as e:
        return {"message": f"Error during cropping: {str(e)}"}
    
def toggle_auto_catch():
    global auto_catch_enabled, auto_catch_hook, cached_auto_catch_config, pokeball_trigger_key

    # Load the current auto catch configuration from file and store it in our cache
    config = load_from_file("autocatch.json")
    if not config or not config.get("hotkey"):
        print("No hotkey set for Auto Catch.")
        return {
            "auto_catch_enabled": auto_catch_enabled,
            "message": "No hotkey set for Auto Catch."
        }
    cached_auto_catch_config = config  # Store config for future use

    # Load keybindings from keybindings.json and get the "Pokeball" hotkey
    keybindings = load_from_file("keybindings.json")
    if not keybindings or "Pokeball" not in keybindings or not keybindings["Pokeball"].get("keyName"):
        print("No Pokeball hotkey set in keybindings.json.")
        return {
            "auto_catch_enabled": auto_catch_enabled,
            "message": "No Pokeball hotkey set in keybindings.json."
        }
    pokeball_trigger_key = keybindings["Pokeball"]["keyName"]

    # Use the hotkey from autocatch config for toggling
    trigger_key = config.get("hotkey")

    auto_catch_enabled = not auto_catch_enabled

    if auto_catch_enabled:
        if auto_catch_hook is not None:
            keyboard.unhook(auto_catch_hook)
        auto_catch_hook = keyboard.on_press_key(trigger_key, lambda event: locate_and_interact_with_images())
        print(f"Auto Catch enabled. Press '{trigger_key.upper()}' to start searching for images.")
    else:
        if auto_catch_hook is not None:
            keyboard.unhook(auto_catch_hook)
            auto_catch_hook = None
        print("Auto Catch disabled.")

    return {
        "auto_catch_enabled": auto_catch_enabled,
        "message": f"Auto Catch {'enabled' if auto_catch_enabled else 'disabled'}"
    }

def locate_image_opencv(template_path, threshold=0.8):
    screenshot = pyautogui.screenshot()
    screenshot_cv = cv2.cvtColor(np.array(screenshot), cv2.COLOR_RGB2BGR)
    
    template = cv2.imread(template_path, cv2.IMREAD_COLOR)
    if template is None:
        raise ValueError(f"Não foi possível carregar o template: {template_path}")
    h, w, _ = template.shape

    # Executa o match template
    res = cv2.matchTemplate(screenshot_cv, template, cv2.TM_CCOEFF_NORMED)
    loc = np.where(res >= threshold)

    # Armazena todos os matches encontrados
    matches = []
    for pt in zip(*loc[::-1]):
        matches.append((pt[0], pt[1], w, h))
    return matches

def process_image(image_path, control_lock, stop_time, trigger_key):
    shiny_template = cv2.imread(image_path, cv2.IMREAD_COLOR)
    if shiny_template is None:
        return
    template_hsv = cv2.cvtColor(shiny_template, cv2.COLOR_BGR2HSV)
    template_hist = cv2.calcHist([template_hsv], [0], None, [180], [0, 180])
    cv2.normalize(template_hist, template_hist, 0, 1, cv2.NORM_MINMAX)

    start_time = time.time()
    delay = 0.05  

    while time.time() - start_time < stop_time:
        try:
            matches = locate_image_opencv(image_path, threshold=0.8)
        except Exception as e:
            time.sleep(delay)
            continue

        if matches:
            for (x, y, w, h) in matches:
                x, y, w, h = int(x), int(y), int(w), int(h)
                
                screenshot = pyautogui.screenshot(region=(x, y, w, h))
                region_cv = cv2.cvtColor(np.array(screenshot), cv2.COLOR_RGB2BGR)
                
                region_hsv = cv2.cvtColor(region_cv, cv2.COLOR_BGR2HSV)
                region_hist = cv2.calcHist([region_hsv], [0], None, [180], [0, 180])
                cv2.normalize(region_hist, region_hist, 0, 1, cv2.NORM_MINMAX)
                
                correlation = cv2.compareHist(template_hist, region_hist, cv2.HISTCMP_CORREL)
                if correlation >= 0.9:
                    with control_lock:
                        center_x = x + w // 2
                        center_y = y + h // 2
                        pyautogui.moveTo(center_x, center_y)
                        keyboard.press(trigger_key)
                        pyautogui.click(center_x, center_y)
                        keyboard.release(trigger_key)
                    break

        time.sleep(delay)

    print(f"Busca pela imagem {os.path.basename(image_path)} encerrada após {stop_time} segundos.")


def locate_and_interact_with_images():
    global cached_auto_catch_config, pokeball_trigger_key

    if not cached_auto_catch_config or "selectedImages" not in cached_auto_catch_config or not cached_auto_catch_config["selectedImages"]:
        print("No selected images configured in autocatch.json.")
        return

    selected_images = cached_auto_catch_config["selectedImages"] 
    images_path = os.path.join(os.getcwd(), "images")
    if not os.path.exists(images_path):
        print("Images folder does not exist.")
        return

    control_lock = threading.Lock()
    stop_time = 5 

    for img in selected_images:
        filename = img.get("filename")
        if not filename:
            continue
        long_image_path = os.path.join(images_path, filename)
        if not os.path.exists(long_image_path):
            print(f"File {filename} does not exist at the specified path.")
            continue

        t = threading.Thread(
            target=process_image, 
            args=(long_image_path, control_lock, stop_time, pokeball_trigger_key), 
            daemon=True
        )
        t.start()
        print(f"Started task for {filename} (will stop after {stop_time} seconds)")

    print("All image search tasks started in parallel.")