import pyautogui
import my_keyboard
import asyncio
import cv2
import numpy as np
import random
import threading
import keyboard
from pynput import mouse
import pyperclip
import time
import flet as ft
import threading
from utils.global_state import GlobalState

is_running = False  # Global flag to control the automation loop
shiny_types = ["karp", "buzz"]
button_options = ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "U", "T", "R", "Y", "Q", "1", "2", "3", "4"]
selected_shinies = {shiny: False for shiny in shiny_types}
dropdown_values = {shiny: None for shiny in shiny_types}
slider_value = 7.5  # Default value
revive_slider_value = 3
is_fishing = False
should_fish = False
found_shiny = False
coordinates = []
is_tracking = False
is_tracking_revive = False
x, y, width, height = 880, 598, 155, 38
is_resolving = False
global_state = GlobalState()

# async def clickOnImage(fileName):
#     image_to_find = f"Images/{fileName}.png"
#     print(f"Looking for {image_to_find}")

#     location = pyautogui.locateOnScreen(image_to_find)  # Adjust confidence as needed


#     if location is not None:
#         center = pyautogui.center(location)
#         print(f"Clicking at {center}")  # Debugging line
#         pyautogui.click(center)
#         await asyncio.sleep(0.3)  # Optional: sleep for 0.3 seconds after clicking
#     else:
#         print(f"Image {image_to_find} not found on screen.")


# async def catchShiny(pokemon, key, confidence):
#     global found_shiny
#     print(f"Images/shiny-{pokemon}.png")
#     location = pyautogui.locateCenterOnScreen(f"Images/shiny-{pokemon}.png", confidence=confidence)
#     if location:
#         print("found")
#         found_shiny = True
#         update_status()
#         pyautogui.moveTo(location)
#         my_keyboard.press(key)

#         pyautogui.click(location)
#         await asyncio.sleep(0.6) 
#     found_shiny = False
#     update_status()

# def catchAll(pokemon, confidence):
#     print(f"Images/{pokemon}.png")
#     clicked_locations = set()

    
#     locations = pyautogui.locateAllOnScreen(f"Images/{pokemon}.png", confidence=confidence)
    
#     for location in locations:
#         print(location)
#         center = pyautogui.center(location)
        
#         # Convert the center to a tuple so it's hashable and can be added to a set
#         center_tuple = (center.x, center.y)
        
#         # Check if this location has already been clicked
#         if center_tuple not in clicked_locations:
#             print("found")
            
#             # Move to the location and click
#             pyautogui.moveTo(center)
#             pyautogui.press('1')
#             pyautogui.click(center)
            
#             # Add this location to the set of clicked locations
#             clicked_locations.add(center_tuple)


# def catchAll(pokemon, confidence):
#     end_time = time.time() + 4  # Set the end time to 4 seconds from now
    
#     while time.time() < end_time:  # Keep running until 4 seconds have passed
#         print(f"Looking for Images/{pokemon}.png")
        
#         location = pyautogui.locateOnScreen(f"Images/{pokemon}.png", confidence=confidence)
        
#         if location:
#             print("found")
            
#             center = pyautogui.center(location)
#             pyautogui.moveTo(center)
#             pyautogui.press('1')
#             pyautogui.click(center)

# should_catch = True


# def catchAll(pokemon, confidence):
#     end_time = time.time() + 6  # Set the end time to 4 seconds from now
    
#     while time.time() < end_time:  # Keep running until 4 seconds have passed
#         print(f"Looking for Images/{pokemon}.png")
        
#         location = pyautogui.locateOnScreen(
#             f"Images/{pokemon}.png", 
#             confidence=confidence, 
#             grayscale=True  # Use grayscale for faster matching
#         )
        
#         if location:
#             print("found")
            
#             center = pyautogui.center(location)
#             pyautogui.moveTo(center)
#             pyautogui.press('1')
#             pyautogui.click(center)

# def catchAll(pokemon, confidence):
#     global should_catch  # Use the global flag
#     while should_catch:  # Keep running while the flag is True
        
#         location = pyautogui.locateOnScreen(f"Images/{pokemon}.png", confidence=confidence)
        
#         if location:
#             print("found")
            
#             center = pyautogui.center(location)
#             pyautogui.moveTo(center)
#             pyautogui.press('1')
#             pyautogui.click(center)
            

# Function to start the thread
# def start_catch_thread(pokemon, confidence):
#     global should_catch  # Use the global flag
#     should_catch = True  # Set the flag to True
    
#     # Create and start the thread
#     catch_thread = threading.Thread(target=catchAll, args=(pokemon, confidence))
#     catch_thread.start()

# # Function to stop the thread
# def stop_catch_thread():
#     global should_catch  # Use the global flag
#     should_catch = False  # Set the flag to False

            
    

# async def catchShiny(pokemon, key, confidence):
#     global found_shiny
#     print(f"Images/shiny-{pokemon}.png")
    
#     locations = pyautogui.locateAllOnScreen(f"Images/shiny-{pokemon}.png", confidence=confidence)
    
#     found_shiny = False  # Reset the flag
    
#     for location in locations:
#         center_x, center_y = pyautogui.center(location)
#         print(f"Found at {center_x}, {center_y}")
        
#         found_shiny = True  # Set the flag to True as we found at least one
#         update_status()
        
#         pyautogui.moveTo(center_x, center_y)
#         my_keyboard.press(key)
#         pyautogui.click(center_x, center_y)
        
#         await asyncio.sleep(0.6)  # Sleep between each found image
    
#     if not found_shiny:
#         print("No shiny found.")
    
#     update_status()

# Dummy update_status function for testing
def update_status():
    print("Status updated.")

fishing_lock = asyncio.Lock()  

async def startFishing():
    global raw_coordinates, slider_value
    async with fishing_lock: 
        print("Started fishing")
        if not raw_coordinates:
            print("No coordinates available for fishing.")
            return
        area = random.choice(raw_coordinates)
        # centerArea = pyautogui.center(area)   #(area + (99, 102)) 
        pyautogui.moveTo(area)
        await asyncio.sleep(0.3)
        # Press and hold Control + Z
        pyautogui.keyDown('ctrl')
        pyautogui.press('z')
        pyautogui.keyUp('ctrl')
        # pyautogui.press(global_state.fishing_hotkey_field) CHANGED FOR PKL HARDCODED NOW
        await asyncio.sleep(0.3)
        pyautogui.click(area)
        pyautogui.press('space')
        pyautogui.press('tab')
        pyautogui.press('tab')
        pyautogui.press('tab')
        pyautogui.press('tab')
        await asyncio.sleep(slider_value)


async def catch_selected_shinies():
    for shiny, is_selected in selected_shinies.items():
        if is_selected:
            dropdown_value = dropdown_values.get(shiny)
            if dropdown_value is not None:
                await catchShiny(shiny, dropdown_value, 0.8)

def extract_coordinates():
    extracted_coordinates = []
    for coordinate_row in coordinates:
        coordinate_text_control = coordinate_row.children[0]
        coordinate_text = coordinate_text_control.text
        x_val, y_val = map(int, coordinate_text.replace("X: ", "").replace("Y: ", "").split(", "))
        extracted_coordinates.append((x_val, y_val))
    return extracted_coordinates

async def loop():
    global is_fishing, is_resolving
    if not is_resolving:
        # location = pyautogui.locateOnScreen(image_to_watch, confidence=0.8)
        # if location:
        #     print(f"Image found at {location}")
        #     screenshot = pyautogui.screenshot(region=(location))
        #     await resolveCaptcha()

        if fishing_lock.locked() == False and should_fish:
            is_fishing = True
            update_status()
            fishing_task = asyncio.create_task(startFishing())


        await catch_selected_shinies()
        await asyncio.sleep(0.2)




def run_automation_loop():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(main_automation())

async def main_automation():
    global is_running
    while is_running:
        await loop()

def start_automation(e=None):
    print("Starting automation.")
    audio2.play()
    global is_running
    if not is_running:
        is_running = True
        update_status()
        threading.Thread(target=run_automation_loop).start()

def stop_automation(e=None):
    print("Stoping automation.")
    audio3.play()
    global is_running, is_fishing, found_shiny
    if is_running:
        is_running = False
        is_fishing = False
        found_shiny = False
        if fishing_lock.locked():
            fishing_lock.release()

        update_status()

def on_shiny_select(e, value):
    global selected_shinies
    selected_shinies = value

def on_slider_change(e):
    global slider_value, is_running, main_loop_status, is_fishing, found_shiny
    slider_value = e.control.value

def on_revive_slider_change(e):
    global selected_combo_name, revive_slider, revive_slider_value
    selected_combo = global_state.combos.get(selected_combo_name, {})
    print(selected_combo)
    selected_combo['revive_slider_value']  = round(e.control.value, 2)  
    global_state.revive_slider_value = round(e.control.value, 2)  
    revive_slider_value.value = round(e.control.value, 2)  
    revive_slider_value.update()

def on_attack_delay_slider_change(e):
    global selected_combo_name, attack_delay_slider, attack_delay_slider_value
    selected_combo = global_state.combos.get(selected_combo_name, {})
    print(selected_combo)
    selected_combo['attack_delay_slider_value']  = round(e.control.value, 2)  
    global_state.attack_delay_slider_value = round(e.control.value, 2)  
    attack_delay_slider_value.value = round(e.control.value, 2)  
    attack_delay_slider_value.update()

def update_status():
    global main_loop_status, fishing_status, shiny_status, main_loop_container, fishing_container, shiny_container

    main_loop_container.bgcolor = ft.colors.GREEN if is_running else ft.colors.RED
    main_loop_container.content = ft.Text("Running") if is_running else ft.Text("Not Running")
    fishing_container.bgcolor = ft.colors.GREEN if is_fishing else ft.colors.RED
    fishing_container.content = ft.Text("Yes") if is_fishing else ft.Text("No")
    shiny_container.bgcolor = ft.colors.GREEN if found_shiny else ft.colors.RED
    shiny_container.content = ft.Text("Yes") if found_shiny else ft.Text("No")

    main_loop_status.update()
    fishing_status.update()
    shiny_status.update()

def create_status_row(text: str, is_active: bool, contentValue: str, container: ft.Container = None) -> ft.Row:
    status_text = ft.Text(text)
    if container is None:
        container = ft.Container(
            content=ft.Text(contentValue)
        )
    return ft.Row([status_text, container], alignment=ft.MainAxisAlignment.CENTER)

def on_shiny_toggle(shiny, value):
    global selected_shinies
    selected_shinies[shiny] = value

def on_dropdown_change(event, shiny):
    global dropdown_values
    dropdown_values[shiny] = event.control.value

def on_fishing_toggle(value):
        global should_fish
        should_fish = value.control.value


def on_use_revive_toggle(value):
    global_state.use_revive = value.control.value
    

def remove_item(index):
    global coordinates, coordinate_list, raw_coordinates
    del coordinates[index]
    del raw_coordinates[index]  # Remove raw coordinate
    coordinate_list.controls = coordinates
    coordinate_list.update()

raw_coordinates = []


def on_click(x, y, button, pressed):
    global is_tracking, coordinates, coordinate_list, raw_coordinates, revive_position, is_tracking_revive
    if is_tracking and pressed:
        index = len(coordinates)
        coordinate_text = ft.Text(f"X: {x}, Y: {y}")
        remove_button = ft.TextButton("Remove", on_click=lambda event, index=index: remove_item(index))
        coordinate_row = ft.Row([coordinate_text, remove_button])
        coordinates.append(coordinate_row)
        raw_coordinates.append((x, y))  # Store raw coordinates
        coordinate_list.controls = coordinates
        coordinate_list.update()
        is_tracking = False  
    if is_tracking_revive and pressed:
        revive_position.value = f"{x},{y}"
        global_state.revive_position = f"{x},{y}"
        revive_position.update()
        is_tracking_revive = False  


def on_button_click(e):
    global is_tracking
    is_tracking = True

def on_revive_button_click(e):
    global is_tracking_revive
    is_tracking_revive = True

    # Start listening for mouse events
def mouse_listener():
    with mouse.Listener(on_click=on_click) as listener:
        listener.join()


# Start the mouse listener in a new thread
mouse_thread = threading.Thread(target=mouse_listener)
mouse_thread.start()

class Item():
    def __init__(self, item_list, name, hotkey):
        self.list = item_list
        self.name = name
        self.hotkey = hotkey

        self.view = ft.Container(
            content=ft.TextButton(
                f"{name}\n{hotkey}",
                on_click=lambda _: self.list.remove_item(self),
                width=50,
                height=50,
            ),
            bgcolor= ft.colors.BLACK
        )

    
class ItemList():
    def __init__(self, page):
        self.page = page
        self.item_objects = []  # Store Item objects
        self.items = []  # Store Item views
        self.list_view = ft.ListView(controls=self.items, spacing=5, height=300)
        
    def add_item(self, name, hotkey):
        new_item = Item(self, name, hotkey)
        self.item_objects.append(new_item)
        self.items.append(new_item.view)
        self.list_view.controls = self.items  # Update the ListView controls
        global_state.item_objects = self.item_objects
        selected_combo = global_state.combos.get(selected_combo_name, {})
        selected_combo['item_list'] = self.get_all_items_and_hotkeys()
        self.page.update()

    def remove_item(self, item):
        self.item_objects.remove(item)
        self.items.remove(item.view)
        self.list_view.controls = self.items  # Update the ListView controls
        global_state.item_objects = self.item_objects
        selected_combo = global_state.combos.get(selected_combo_name, {})
        print(self.get_all_items_and_hotkeys())
        selected_combo['item_list'] = self.get_all_items_and_hotkeys()
        self.page.update()

    def remove_all(self):
        self.items.clear()
        self.update_list_view()


    def get_all_items_and_hotkeys(self):
        return [(item.name, item.hotkey) for item in self.item_objects]
        


def iterate_and_process_items(item_list):
    print("combo")
    global revive_position, revive_hotkey_field
    selected_combo = global_state.combos.get(selected_combo_name, {})
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
    if revive_position.value is not None and global_state.use_revive:
        use_auto_revive(True, selected_combo['revive_slider_value'])
    #     currentPosition = pyautogui.position()
    #     x, y = map(int, revive_position.value.split(","))
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

def use_auto_revive(useDelay, delayValue):
    global revive_position, revive_hotkey_field
    if revive_position.value is not None:
        currentPosition = pyautogui.position()
        if useDelay:
            print(delayValue)
            time.sleep(delayValue)
        x, y = map(int, revive_position.value.split(","))
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


        
def process_item(name, hotkey):
    print(f"Processing item with name: {name} and hotkey: {hotkey}")
    my_keyboard.press(hotkey, 0.1)

selected_combo_name = ''
       
def main(page: ft.Page):
    global main_loop_status, auto_revive_hotkey_field, fishing_status, shiny_status, main_loop_container, fishing_container, shiny_container, audio, audio2, audio3, coordinate_list, revive_position, revive_hotkey_field, medicine_hotkey_field, selected_combo_name, revive_slider_value, fishing_hotkey_field, attack_delay_slider_value, attack_delay_slider
    page.title = "Botiada"
    page.vertical_alignment = ft.MainAxisAlignment.CENTER

    main_loop_container = ft.Container(content=ft.Text(" "), width=65, height=25)
    fishing_container = ft.Container(content=ft.Text(" "), width=35, height=25)
    shiny_container = ft.Container(content=ft.Text(" "), width=35, height=25)

    main_loop_status = create_status_row(f"Main Loop:", is_running, "Not Running", main_loop_container)
    fishing_status = create_status_row(f"Fishing:", is_fishing,  "No", fishing_container)
    shiny_status = create_status_row(f"Shiny Found:", found_shiny, "No", shiny_container)


    # Checkboxes for shiny types
    flet_button_options = [ft.dropdown.Option(option) for option in button_options]
    shiny_checkboxes_with_dd = [
        ft.Row(
            [
                ft.Checkbox(
                    label=shiny,
                    value=selected_shinies[shiny],
                    on_change=lambda value, shiny=shiny: on_shiny_toggle(shiny, value)
                ),
                ft.Text("Pokeball Hotkey:"),
                ft.Dropdown(
                    width=100,
                    options=flet_button_options,
                    on_change=lambda value, shiny=shiny: on_dropdown_change(value, shiny)
                )
            ],
            alignment=ft.MainAxisAlignment.CENTER,
        )
        for shiny in shiny_types
    ]
    fishing_checkbox = ft.Checkbox(
        label="Fishing Enabled",
        value=False,
        on_change=on_fishing_toggle
    )

    fishing_hotkey_field =  ft.Dropdown(
            label="Hotkey",
                    width=200,
                    options=flet_button_options,
                    on_change=lambda e: setattr(global_state, 'fishing_hotkey_field', e.control.value)
                )

    sleep_slider = ft.Slider(
        min=5.5,
        max=25,
        divisions=20,
        label="{value}",
        width=500,
        on_change=on_slider_change,
    )

    track_button = ft.ElevatedButton("Add Fishing Spot", on_click=on_button_click)

    coordinate_list = ft.ListView(controls=coordinates, spacing=10,height=150)

    btn_start = ft.ElevatedButton("Start", on_click=start_automation)
    btn_stop = ft.ElevatedButton("Stop", on_click=stop_automation)
    
    audio = ft.Audio(
        src="alarm.mp3",
        autoplay=False,
        volume=1,
        balance=0,
        on_loaded=lambda _: print("Loaded"),
    )
    audio2 = ft.Audio(
        src="comecou.mp3",
        autoplay=False,
        volume=0.4,
        balance=0,
    )
    audio3 = ft.Audio(
        src="aqui-acabou.mp3",
        autoplay=False,
        volume=1,
        balance=0,
    )
    page.overlay.append(audio)
    page.overlay.append(audio2)
    page.overlay.append(audio3)
    
    first_tab_content = ft.Column(
        [
            ft.Row( [main_loop_status,
            fishing_status,
            shiny_status]),
           
            track_button,
            coordinate_list,
            ft.Text("Select Pokemon:"),
            ft.Column([ *shiny_checkboxes_with_dd], alignment=ft.alignment.top_left),
            fishing_checkbox,
            ft.Text("Fishing Delay:"),
            sleep_slider,
            ft.Text("Fishing Hotkey:"),
            fishing_hotkey_field,
            ft.Row(
                [btn_start, btn_stop],
                alignment=ft.MainAxisAlignment.CENTER,
            ),
        ],
        alignment=ft.MainAxisAlignment.CENTER,
    )

    item_list = ItemList(page)
    new_item_list = ItemList(page)
    
    combo_name_field = ft.TextField(label="Combo Name", dense=True, width=200 )
    name_field = ft.TextField(label="Skill", dense=True, width=200 )
    hotkey_field =  ft.Dropdown(
            label="Hotkey",
                    width=200,
                    options=flet_button_options,
                )
    revive_spot = ft.ElevatedButton("Revive position", on_click=on_revive_button_click)
    revive_position = ft.Text(size=15,
            color=ft.colors.WHITE,
            weight=ft.FontWeight.NORMAL,)
   
    revive_hotkey_field =  ft.Dropdown(
         label="Revive Hotkey",
                    width=200,
                    options=flet_button_options,
                    on_change=lambda e: setattr(global_state, 'revive_hotkey_field', e.control.value)
                )
    


    auto_revive_hotkey_field =  ft.Dropdown(
         label="Auto Revive Hotkey",
                    width=200,
                    options=flet_button_options,
                    on_change=lambda e: set_auto_revive(e),
                )
    
    def set_auto_revive(value):
        global auto_revive_hotkey_field
        auto_revive_hotkey_field = value.control
        # if global_state.auto_revive_hotkey_field:
        #     keyboard.release(global_state.auto_revive_hotkey_field)
        # global_state.auto_revive_hotkey_field = value
        # keyboard.add_hotkey(value, lambda: use_auto_revive())
        setattr(global_state, 'auto_revive_hotkey_field', value.control.value), 

    medicine_hotkey_field =  ft.Dropdown(
         label="Medicine Hotkey",
                    width=200,
                    options=flet_button_options,
                    on_change=lambda e: setattr(global_state, 'medicine_hotkey_field', e.control.value)
                )


    pokestop_hotkey_field =  ft.Dropdown(
         label="Pokestop Hotkey",
                    width=200,
                    options=flet_button_options,
                    on_change=lambda e: setattr(global_state, 'pokestop_hotkey_field', e.control.value)
                )
    should_use_revive = ft.Checkbox(label="Use revive",value=False,on_change=on_use_revive_toggle)

    
    add_button = ft.ElevatedButton("Add New Item", on_click=lambda _: item_list.add_item(name_field.value, hotkey_field.value))
    add_modal_button = ft.ElevatedButton("Add New Item", on_click=lambda _: new_item_list.add_item(name_field.value, hotkey_field.value))
    def open_dlg_modal(e):
        page.dialog = dlg_modal
        dlg_modal.open = True
        page.update()

    revive_slider_value = ft.Text(size=15,
            color=ft.colors.WHITE,
            weight=ft.FontWeight.NORMAL,)

    revive_slider = ft.Slider(
            min=0,
            max=6,
            divisions=1000,
            label="{value}",
            width=300,
            on_change=on_revive_slider_change,
        )
    
    attack_delay_slider_value = ft.Text(size=15,
            color=ft.colors.WHITE,
            weight=ft.FontWeight.NORMAL,)

    attack_delay_slider = ft.Slider(
            min=0,
            max=6,
            divisions=1000,
            label="{value}",
            width=300,
            on_change=on_attack_delay_slider_change,
        )


    def create_new_combo():
        global combo_options
        # Get the values from the fields
        combo_name = combo_name_field.value
        revive_slider_value = revive_slider.value
        attack_delay_slider_value = attack_delay_slider.value
        
        # Create a dictionary for the new combo
        print(new_item_list.get_all_items_and_hotkeys())
        new_combo = {
            'revive_slider_value': revive_slider_value,
            'attack_delay_slider_value': attack_delay_slider_value,
            'item_list': new_item_list.get_all_items_and_hotkeys()  # Assuming this function returns the items
        }
        
        # Add the new combo to the global_state's combos dictionary
        global_state.combos[combo_name] = new_combo
        combo_options = [ft.dropdown.Option(combo_name) for combo_name in global_state.combos.keys()]
        page.update()
        print(f"New combo {combo_name} added to global_state.")
        print(global_state)

    def close_dlg(e=None):
        dlg_modal.open = False
        page.update()

    open_dlg_modal = ft.ElevatedButton("Create New Combo", on_click=open_dlg_modal)
    


    dlg_modal = ft.AlertDialog(
        modal=True,
        title=ft.Text("New Combo"),
        content=ft.Column([combo_name_field,
            name_field,
            hotkey_field,
            add_modal_button,
            ft.Row([ft.Text("Revive Delay"), revive_slider_value, revive_slider]),
            ft.Row([ft.Text("Attack Delay"), attack_delay_slider_value, attack_delay_slider]),
            ft.Column([new_item_list.list_view], width=200, height=100, alignment=ft.MainAxisAlignment.CENTER)], width=700, height=700),
            actions=[
            ft.ElevatedButton("Ok", on_click=lambda e: [create_new_combo(), close_dlg(e)]),
            ft.ElevatedButton("Cancel", on_click=close_dlg),
        ],
        
        actions_alignment=ft.MainAxisAlignment.END,
        on_dismiss=lambda e: print("Modal dialog dismissed!"),
    )

    def update_second_tab_content(name):
        global selected_combo_name, fishing_hotkey_field
        item_list.items.clear()
        item_list.item_objects.clear()
        selected_combo = global_state.combos.get(name, {})
        selected_combo_name = name
        
        # Update the fields based on the selected combo
        name_field.value = selected_combo.get('name', '')
        # hotkey_field.value = global_state.hotkey
        revive_position.value = global_state.revive_position
        should_use_revive.value = global_state.use_revive
        pokestop_hotkey_field.value = global_state.pokestop_hotkey_field
        revive_hotkey_field.value = global_state.revive_hotkey_field
        medicine_hotkey_field.value = global_state.medicine_hotkey_field
        global_item_list = selected_combo.get('item_list', [])
        revive_slider_value.value  = selected_combo.get('revive_slider_value', 0)
        revive_slider.value  = selected_combo.get('revive_slider_value', 0)
        fishing_hotkey_field.value = global_state.fishing_hotkey_field
        auto_revive_hotkey_field.value = global_state.auto_revive_hotkey_field

        for item in selected_combo['item_list']:
            item_list.add_item(item[0], item[1])
        page.update()

    combo_options = [ft.dropdown.Option(combo_name) for combo_name in global_state.combos.keys()]
    selected_combo = global_state.selected_combo

    combo_dropdown = ft.Dropdown(
        width=200,
        options=combo_options,
        value=selected_combo,
        on_change=lambda value: update_second_tab_content(value.control.value)
    )

    
    second_tab_content = ft.Column(
        [
            open_dlg_modal,
            combo_dropdown,
            name_field,
            hotkey_field,
            add_button,
            ft.Row([revive_spot, revive_position, should_use_revive, pokestop_hotkey_field]),
            ft.Row([ft.Text("Revive Delay"), revive_slider_value, revive_slider]),
            ft.Row([ft.Text("Attack Delay"), attack_delay_slider_value, attack_delay_slider]),
            revive_hotkey_field,
            auto_revive_hotkey_field,
            medicine_hotkey_field,
            ft.Column([item_list.list_view], width=200, alignment=ft.MainAxisAlignment.CENTER)
        ],
        alignment=ft.MainAxisAlignment.CENTER,
    )


    tabs = ft.Tabs(
        selected_index=0,
        animation_duration=300,
        tabs=[
            ft.Tab(text="Fishing",content=first_tab_content),
            ft.Tab(text="Auto combo", content=second_tab_content),   
        ],
        expand=1,
    )

    # Add the main container to the page
    page.add(tabs)
    page.window_title_bar_hidden = True
    page.window_width = 600
    page.window_height = 800
    page.window_movable = True
    page.window_center()
    page.vertical_alignment = ft.alignment.center
    page.window_minimizable = True
    if selected_combo:
        update_second_tab_content(selected_combo)
    
    page.update()
    keyboard.add_hotkey('ctrl+alt+s', lambda e=None: start_automation())

    keyboard.add_hotkey('ctrl+alt+x', lambda e=None: stop_automation())

    keyboard.add_hotkey('ctrl+shift+s', lambda e=None: global_state.save_to_file('config.json'))

    def handle_key_press(event):
        if event.event_type == 'down' and event.name == "'":
                iterate_and_process_items(item_list)

    def handle_auto_revive_key_press(event):
        if event.event_type == 'down' and event.name == auto_revive_hotkey_field.value.lower():
            use_auto_revive(False, 0)

    keyboard.hook(handle_key_press)
    keyboard.hook(handle_auto_revive_key_press)


    # keyboard.add_hotkey('*\'', lambda e=None: iterate_and_process_items(item_list))
    # keyboard.add_hotkey("2", lambda e=None: catchAll("current", 0.8))

global_state.load_from_file('config.json')
ft.app(target=main)

keyboard.wait()


