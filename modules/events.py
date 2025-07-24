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
from datetime import datetime, time as dt_time


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

# Global variables to control the coordinate tracking
mouse_tracking_enabled = False
mouse_coords = {'x': 0, 'y': 0}
mouse_tracking_thread = None

# Add these globals at the top of the file
auto_revive_enabled = False
auto_revive_hook = None

def execute_move(move_list):
    print(move_list)
    for move in move_list:
        if move.get('delay'):
            # Handle delay
            delay = float(move.get('delay')) / 1000.0
            time.sleep(delay)
            
        elif move.get('autoCatch'):
            # Handle autoCatch
            pass
            
        elif move.get('mouseClick'):
            # Handle mouse click
            mouse_click = move.get('mouseClick')
            button = mouse_click.get('button', 'left')
            x = mouse_click.get('x', 0)
            y = mouse_click.get('y', 0)
            
            pyautogui.moveTo(x, y)
            if button == 'left':
                pyautogui.click()
            else:
                pyautogui.rightClick()
            
        elif move.get('hotkey'):
            # Handle hotkey press
            hotkey = move.get('hotkey')
            key_name = hotkey.get('keyName')
            if key_name:
                print(f"Pressing hotkey: {key_name}")
                keyboard.press_and_release(key_name)
                time.sleep(0.1)  # Small delay after key press
            
        elif move.get('skillName') and not move.get('hotkey'):
            # Handle skillName without hotkey
            skill_name = move.get('skillName')
            print(f"Processing skill without hotkey: {skill_name}")
            
            try:
                keybindings = load_from_file('keybindings.json')
                if keybindings and skill_name in keybindings:
                    key_data = keybindings[skill_name]
                    key_name = key_data.get('keyName')
                    key_number = key_data.get('keyNumber')
                    if key_name and key_number is not None:
                        print(f"Found keybinding for {skill_name}: {key_name} ({key_number})")
                        keyboard.press_and_release(key_name)
                        time.sleep(0.1)
                    else:
                        print(f"Invalid keybinding format for skill: {skill_name}")
                else:
                    print(f"No keybinding found for skill: {skill_name}")
            except Exception as e:
                print(f"Error loading keybindings for skill {skill_name}: {str(e)}")
        
        # Skip malformed entries
        elif move.get('id') and not any([move.get('hotkey'), move.get('skillName'), move.get('delay'), move.get('mouseClick'), move.get('autoCatch')]):
            print(f"Skipping malformed entry with id: {move.get('id')}")
            continue

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

    # Ensure the moveList structure is preserved
    current_combo['moveList'] = [
        {
            **move,
            'hotkey': move.get('hotkey', None)  # Preserve hotkey structure
        }
        for move in current_combo.get('moveList', [])
    ]

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

def locate_image_opencv(template_path, threshold=0.9):
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
            matches = locate_image_opencv(image_path, threshold=0.9)
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
                if correlation >= 0.95:
                    with control_lock:
                        center_x = x + w // 2
                        center_y = y + h // 2
                        pyautogui.moveTo(center_x, center_y)
                        keyboard.press(trigger_key)
                        keyboard.release(trigger_key)
                        pyautogui.click(center_x, center_y)
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

def toggle_mouse_tracking():
    """Toggle the mouse coordinate tracking on/off"""
    global mouse_tracking_enabled, mouse_tracking_thread
    
    mouse_tracking_enabled = not mouse_tracking_enabled
    
    if mouse_tracking_enabled:
        # Start a new thread to monitor mouse clicks
        if mouse_tracking_thread is None or not mouse_tracking_thread.is_alive():
            mouse_tracking_thread = threading.Thread(target=monitor_mouse, daemon=True)
            mouse_tracking_thread.start()
            
    return {
        "tracking_enabled": mouse_tracking_enabled,
        "message": f"Mouse tracking {'enabled' if mouse_tracking_enabled else 'disabled'}"
    }

def monitor_mouse():
    """Monitor mouse clicks and Enter key presses"""
    global mouse_tracking_enabled, mouse_coords
    
    # Variables to help detect actual clicks
    last_click_time = 0
    click_detected = False
    
    while mouse_tracking_enabled and not click_detected:
        try:
            # Get current mouse position
            current_pos = pyautogui.position()
            
            # Check for Enter key press
            if keyboard.is_pressed('enter'):
                mouse_coords['x'] = current_pos[0]
                mouse_coords['y'] = current_pos[1]
                print(f"Captured mouse position via Enter key: {mouse_coords}")
                mouse_tracking_enabled = False
                break
            
            # Use win32api to detect mouse clicks more reliably
            try:
                import win32api
                left_button_state = win32api.GetAsyncKeyState(0x01)  # Left mouse button
                
                # Button is pressed (state < 0) and not too soon after last detection
                current_time = time.time()
                if left_button_state < 0 and current_time - last_click_time > 0.5:
                    mouse_coords['x'] = current_pos[0]
                    mouse_coords['y'] = current_pos[1]
                    print(f"Captured mouse position via click: {mouse_coords}")
                    last_click_time = current_time
                    mouse_tracking_enabled = False
                    break
                    
            except ImportError:
                # Fallback if win32api is not available
                pass
            
            time.sleep(0.05)  # Small delay to reduce CPU usage
            
        except Exception as e:
            print(f"Error in mouse tracking: {str(e)}")
            time.sleep(0.1)

def get_mouse_coords():
    """Return the current tracked mouse coordinates"""
    return mouse_coords

def toggle_auto_revive():
    """Toggle the auto revive functionality on/off"""
    global auto_revive_enabled, auto_revive_hook
    
    # Always unhook the existing hook if one exists
    if auto_revive_hook is not None:
        keyboard.unhook(auto_revive_hook)
        auto_revive_hook = None
    
    # Toggle the enabled state
    auto_revive_enabled = not auto_revive_enabled
    
    # Load the latest config
    config = load_from_file("autorevive.json")
    if not config or not config.get("keybind"):
        print("No hotkey set for Auto Revive.")
        return {
            "auto_revive_enabled": auto_revive_enabled,
            "message": "No hotkey set for Auto Revive."
        }
    
    # Set up a new hook if enabled
    if auto_revive_enabled:
        trigger_key = config.get("keybind")
        auto_revive_hook = keyboard.on_press_key(trigger_key, lambda event: perform_auto_revive(config))
        print(f"Auto Revive enabled. Press '{trigger_key.upper()}' to revive.")
    
    return {
        "auto_revive_enabled": auto_revive_enabled,
        "message": f"Auto Revive {'enabled' if auto_revive_enabled else 'disabled'}"
    }

def perform_auto_revive(config):
    """Perform the auto revive action"""
    try:
        # Get the stored revive position
        revive_x = config["position"]["x"]
        revive_y = config["position"]["y"]
        
        # Get the hotkey from config
        revive_key = config["keybind"]
        
        # Get the current mouse position
        current_x, current_y = pyautogui.position()
        
        # Move to the revive position
        pyautogui.moveTo(revive_x, revive_y)
        time.sleep(0.3)  # Wait for the mouse movement to complete
        pyautogui.click()
        # Press the revive hotkey
                
        keybindings = load_from_file("keybindings.json")
        if not keybindings or "Revive" not in keybindings:
            print("Revive keybinding not found in keybindings.json")
            return

        # Get the keyName for Revive
        revive_key = keybindings["Revive"].get("keyName")
        if not revive_key:
            print("Revive keyName is missing in keybindings.json")
            return

        keyboard.press_and_release(revive_key)
        time.sleep(0.2)  # Wait for the key press to register
        
        # Perform click action
        pyautogui.click()
        time.sleep(0.2)  # Wait for the click to register
        pyautogui.click()
        
        # Move back to the original position
        pyautogui.moveTo(current_x, current_y)
        
        print(f"Auto revive performed at position ({revive_x}, {revive_y}) using key '{revive_key}'")
        return True
    except Exception as e:
        print(f"Error performing auto revive: {str(e)}")
        return False


def reset_all_todos():
    """Reset all todos to uncompleted state"""
    try:
        todo_config = load_from_file('todoConfig.json')
        
        def reset_todos_recursive(todos):
            for todo in todos:
                todo["completed"] = False
                if todo.get("children"):
                    reset_todos_recursive(todo["children"])
        
        reset_todos_recursive(todo_config["todos"])
        
        # Update the last reset timestamp
        todo_config["lastReset"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        save_to_file(todo_config, 'todoConfig.json')
        print("All todos have been reset")
        return {"success": True, "message": "All todos reset successfully"}
        
    except Exception as e:
        print(f"Error resetting todos: {str(e)}")
        return {"success": False, "message": f"Error resetting todos: {str(e)}"}


def get_todo_stats():
    """Get statistics about todos including last reset time"""
    try:
        todo_config = load_from_file('todoConfig.json')
        
        def count_todos(todos):
            total = 0
            completed = 0
            for todo in todos:
                total += 1
                if todo["completed"]:
                    completed += 1
                if todo.get("children"):
                    child_total, child_completed = count_todos(todo["children"])
                    total += child_total
                    completed += child_completed
            return total, completed
        
        total_count, completed_count = count_todos(todo_config["todos"])
        last_reset = todo_config.get("lastReset", "Never")
        
        return {
            "success": True,
            "stats": {
                "total": total_count,
                "completed": completed_count,
                "lastReset": last_reset
            }
        }
        
    except Exception as e:
        print(f"Error getting todo stats: {str(e)}")
        return {"success": False, "message": f"Error getting todo stats: {str(e)}"}


def add_todo_item(text, parent_id=None):
    """Add a new todo item to the list"""
    import uuid
    try:
        todo_config = load_from_file('todoConfig.json')
        
        # Generate a unique ID
        new_id = str(uuid.uuid4())
        
        new_todo = {
            "id": new_id,
            "text": text,
            "completed": False,
            "children": []
        }
        
        if parent_id:
            # Add as a child to the specified parent
            def add_to_parent(todos):
                for todo in todos:
                    if todo["id"] == parent_id:
                        todo["children"].append(new_todo)
                        return True
                    elif todo.get("children"):
                        if add_to_parent(todo["children"]):
                            return True
                return False
            
            if add_to_parent(todo_config["todos"]):
                save_to_file(todo_config, 'todoConfig.json')
                return {"success": True, "message": "Child todo added successfully", "todo": new_todo}
            else:
                return {"success": False, "message": "Parent todo not found"}
        else:
            # Add as a root level todo
            todo_config["todos"].append(new_todo)
            save_to_file(todo_config, 'todoConfig.json')
            return {"success": True, "message": "Todo added successfully", "todo": new_todo}
            
    except Exception as e:
        print(f"Error adding todo: {str(e)}")
        return {"success": False, "message": f"Error adding todo: {str(e)}"}


def toggle_todo_item(todo_id):
    """Toggle the completed status of a todo item and handle parent/child logic"""
    try:
        todo_config = load_from_file('todoConfig.json')
        
        def find_and_toggle(todos, target_id):
            for todo in todos:
                if todo["id"] == target_id:
                    # Toggle the todo
                    todo["completed"] = not todo["completed"]
                    
                    # If completing this todo, check all children
                    if todo["completed"] and todo.get("children"):
                        for child in todo["children"]:
                            child["completed"] = True
                            # Recursively mark children's children as completed
                            if child.get("children"):
                                mark_children_completed(child["children"])
                    
                    # If uncompleting this todo, uncheck all children
                    elif not todo["completed"] and todo.get("children"):
                        for child in todo["children"]:
                            child["completed"] = False
                            # Recursively mark children's children as uncompleted
                            if child.get("children"):
                                mark_children_uncompleted(child["children"])
                    
                    return todo
                elif todo.get("children"):
                    result = find_and_toggle(todo["children"], target_id)
                    if result:
                        # Check if all children are completed to auto-complete parent
                        if all(child["completed"] for child in todo["children"]):
                            todo["completed"] = True
                        else:
                            todo["completed"] = False
                        return result
            return None
        
        def mark_children_completed(children):
            for child in children:
                child["completed"] = True
                if child.get("children"):
                    mark_children_completed(child["children"])
        
        def mark_children_uncompleted(children):
            for child in children:
                child["completed"] = False
                if child.get("children"):
                    mark_children_uncompleted(child["children"])
        
        toggled_todo = find_and_toggle(todo_config["todos"], todo_id)
        
        if toggled_todo:
            save_to_file(todo_config, 'todoConfig.json')
            return {"success": True, "message": "Todo toggled successfully", "todo": toggled_todo}
        else:
            return {"success": False, "message": "Todo not found"}
            
    except Exception as e:
        print(f"Error toggling todo: {str(e)}")
        return {"success": False, "message": f"Error toggling todo: {str(e)}"}


def delete_todo_item(todo_id):
    """Delete a todo item from the list"""
    try:
        todo_config = load_from_file('todoConfig.json')
        
        def delete_from_todos(todos, target_id):
            for i, todo in enumerate(todos):
                if todo["id"] == target_id:
                    deleted_todo = todos.pop(i)
                    return deleted_todo
                elif todo.get("children"):
                    result = delete_from_todos(todo["children"], target_id)
                    if result:
                        return result
            return None
        
        deleted_todo = delete_from_todos(todo_config["todos"], todo_id)
        
        if deleted_todo:
            save_to_file(todo_config, 'todoConfig.json')
            return {"success": True, "message": "Todo deleted successfully", "todo": deleted_todo}
        else:
            return {"success": False, "message": "Todo not found"}
            
    except Exception as e:
        print(f"Error deleting todo: {str(e)}")
        return {"success": False, "message": f"Error deleting todo: {str(e)}"}


def update_todo_item(todo_id, new_text):
    """Update the text of a todo item"""
    try:
        todo_config = load_from_file('todoConfig.json')
        
        def find_and_update(todos, target_id, text):
            for todo in todos:
                if todo["id"] == target_id:
                    todo["text"] = text
                    return todo
                elif todo.get("children"):
                    result = find_and_update(todo["children"], target_id, text)
                    if result:
                        return result
            return None
        
        updated_todo = find_and_update(todo_config["todos"], todo_id, new_text)
        
        if updated_todo:
            save_to_file(todo_config, 'todoConfig.json')
            return {"success": True, "message": "Todo updated successfully", "todo": updated_todo}
        else:
            return {"success": False, "message": "Todo not found"}
            
    except Exception as e:
        print(f"Error updating todo: {str(e)}")
        return {"success": False, "message": f"Error updating todo: {str(e)}"}


# Weekly Todo Functions
def add_weekly_todo_item(text, parent_id=None):
    """Add a new weekly todo item to the list"""
    import uuid
    try:
        todo_config = load_from_file('weeklyTodoConfig.json')
        
        # Generate a unique ID
        new_id = str(uuid.uuid4())
        
        new_todo = {
            "id": new_id,
            "text": text,
            "completed": False,
            "children": []
        }
        
        if parent_id:
            # Add as a child to the specified parent
            def add_to_parent(todos):
                for todo in todos:
                    if todo["id"] == parent_id:
                        todo["children"].append(new_todo)
                        return True
                    elif todo.get("children"):
                        if add_to_parent(todo["children"]):
                            return True
                return False
            
            if add_to_parent(todo_config["todos"]):
                save_to_file(todo_config, 'weeklyTodoConfig.json')
                return {"success": True, "message": "Child weekly todo added successfully", "todo": new_todo}
            else:
                return {"success": False, "message": "Parent weekly todo not found"}
        else:
            # Add as a root level todo
            todo_config["todos"].append(new_todo)
            save_to_file(todo_config, 'weeklyTodoConfig.json')
            return {"success": True, "message": "Weekly todo added successfully", "todo": new_todo}
            
    except Exception as e:
        print(f"Error adding weekly todo: {str(e)}")
        return {"success": False, "message": f"Error adding weekly todo: {str(e)}"}


def toggle_weekly_todo_item(todo_id):
    """Toggle the completed status of a weekly todo item and handle parent/child logic"""
    try:
        todo_config = load_from_file('weeklyTodoConfig.json')
        
        def find_and_toggle(todos, target_id):
            for todo in todos:
                if todo["id"] == target_id:
                    # Toggle the todo
                    todo["completed"] = not todo["completed"]
                    
                    # If completing this todo, check all children
                    if todo["completed"] and todo.get("children"):
                        for child in todo["children"]:
                            child["completed"] = True
                            # Recursively mark children's children as completed
                            if child.get("children"):
                                mark_children_completed(child["children"])
                    
                    # If uncompleting this todo, uncheck all children
                    elif not todo["completed"] and todo.get("children"):
                        for child in todo["children"]:
                            child["completed"] = False
                            # Recursively mark children's children as uncompleted
                            if child.get("children"):
                                mark_children_uncompleted(child["children"])
                    
                    return todo
                elif todo.get("children"):
                    result = find_and_toggle(todo["children"], target_id)
                    if result:
                        # Check if all children are completed to auto-complete parent
                        if all(child["completed"] for child in todo["children"]):
                            todo["completed"] = True
                        else:
                            todo["completed"] = False
                        return result
            return None
        
        def mark_children_completed(children):
            for child in children:
                child["completed"] = True
                if child.get("children"):
                    mark_children_completed(child["children"])
        
        def mark_children_uncompleted(children):
            for child in children:
                child["completed"] = False
                if child.get("children"):
                    mark_children_uncompleted(child["children"])
        
        toggled_todo = find_and_toggle(todo_config["todos"], todo_id)
        
        if toggled_todo:
            save_to_file(todo_config, 'weeklyTodoConfig.json')
            return {"success": True, "message": "Weekly todo toggled successfully", "todo": toggled_todo}
        else:
            return {"success": False, "message": "Weekly todo not found"}
            
    except Exception as e:
        print(f"Error toggling weekly todo: {str(e)}")
        return {"success": False, "message": f"Error toggling weekly todo: {str(e)}"}


def delete_weekly_todo_item(todo_id):
    """Delete a weekly todo item from the list"""
    try:
        todo_config = load_from_file('weeklyTodoConfig.json')
        
        def delete_from_todos(todos, target_id):
            for i, todo in enumerate(todos):
                if todo["id"] == target_id:
                    deleted_todo = todos.pop(i)
                    return deleted_todo
                elif todo.get("children"):
                    result = delete_from_todos(todo["children"], target_id)
                    if result:
                        return result
            return None
        
        deleted_todo = delete_from_todos(todo_config["todos"], todo_id)
        
        if deleted_todo:
            save_to_file(todo_config, 'weeklyTodoConfig.json')
            return {"success": True, "message": "Weekly todo deleted successfully", "todo": deleted_todo}
        else:
            return {"success": False, "message": "Weekly todo not found"}
            
    except Exception as e:
        print(f"Error deleting weekly todo: {str(e)}")
        return {"success": False, "message": f"Error deleting weekly todo: {str(e)}"}


def update_weekly_todo_item(todo_id, new_text):
    """Update the text of a weekly todo item"""
    try:
        todo_config = load_from_file('weeklyTodoConfig.json')
        
        def find_and_update(todos, target_id, text):
            for todo in todos:
                if todo["id"] == target_id:
                    todo["text"] = text
                    return todo
                elif todo.get("children"):
                    result = find_and_update(todo["children"], target_id, text)
                    if result:
                        return result
            return None
        
        updated_todo = find_and_update(todo_config["todos"], todo_id, new_text)
        
        if updated_todo:
            save_to_file(todo_config, 'weeklyTodoConfig.json')
            return {"success": True, "message": "Weekly todo updated successfully", "todo": updated_todo}
        else:
            return {"success": False, "message": "Weekly todo not found"}
            
    except Exception as e:
        print(f"Error updating weekly todo: {str(e)}")
        return {"success": False, "message": f"Error updating weekly todo: {str(e)}"}


def reset_all_weekly_todos():
    """Reset all weekly todos to uncompleted state"""
    try:
        todo_config = load_from_file('weeklyTodoConfig.json')
        
        def reset_todos_recursive(todos):
            for todo in todos:
                todo["completed"] = False
                if todo.get("children"):
                    reset_todos_recursive(todo["children"])
        
        reset_todos_recursive(todo_config["todos"])
        
        # Update the last reset timestamp
        todo_config["lastReset"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        save_to_file(todo_config, 'weeklyTodoConfig.json')
        print("All weekly todos have been reset")
        return {"success": True, "message": "All weekly todos reset successfully"}
        
    except Exception as e:
        print(f"Error resetting weekly todos: {str(e)}")
        return {"success": False, "message": f"Error resetting weekly todos: {str(e)}"}


def get_weekly_todo_stats():
    """Get statistics about weekly todos including last reset time"""
    try:
        todo_config = load_from_file('weeklyTodoConfig.json')
        
        def count_todos(todos):
            total = 0
            completed = 0
            for todo in todos:
                total += 1
                if todo["completed"]:
                    completed += 1
                if todo.get("children"):
                    child_total, child_completed = count_todos(todo["children"])
                    total += child_total
                    completed += child_completed
            return total, completed
        
        total_count, completed_count = count_todos(todo_config["todos"])
        last_reset = todo_config.get("lastReset", "Never")
        
        return {
            "success": True,
            "stats": {
                "total": total_count,
                "completed": completed_count,
                "lastReset": last_reset
            }
        }
        
    except Exception as e:
        print(f"Error getting weekly todo stats: {str(e)}")
        return {"success": False, "message": f"Error getting weekly todo stats: {str(e)}"}