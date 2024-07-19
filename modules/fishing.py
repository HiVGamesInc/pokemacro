import asyncio
import flet as ft
from utils.global_state import global_state
from utils.globals import globals

is_running = False
is_tracking = False
slider_value = 7.5  # Default value
is_fishing = False
should_fish = False
coordinates = []

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

async def loop():
    global is_fishing
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
    global is_running, is_fishing
    if is_running:
        is_running = False
        is_fishing = False
        if fishing_lock.locked():
            fishing_lock.release()

        update_status()

def on_slider_change(e):
    # global slider_value, is_running, main_loop_status, is_fishing
    global slider_value, is_running, is_fishing
    slider_value = e.control.value

def update_status():
    # global main_loop_status, fishing_status, main_loop_container, fishing_container
    global main_loop_container, fishing_container

    main_loop_container.bgcolor = ft.colors.GREEN if is_running else ft.colors.RED
    main_loop_container.content = ft.Text("Running") if is_running else ft.Text("Not Running")
    fishing_container.bgcolor = ft.colors.GREEN if is_fishing else ft.colors.RED
    fishing_container.content = ft.Text("Yes") if is_fishing else ft.Text("No")

    # main_loop_status.update()
    # fishing_status.update()

def on_fishing_toggle(value):
    global should_fish
    should_fish = value.control.value

def remove_item(index):
    global coordinates, coordinate_list, raw_coordinates
    del coordinates[index]
    del raw_coordinates[index]  # Remove raw coordinate
    coordinate_list.controls = coordinates
    coordinate_list.update()

raw_coordinates = []

def on_click(x, y, button, pressed):
    print('click fishing')
    global is_tracking, coordinates, coordinate_list, raw_coordinates
    index = len(coordinates)
    coordinate_text = ft.Text(f"X: {x}, Y: {y}")
    remove_button = ft.TextButton("Remove", on_click=lambda event, index=index: remove_item(index))
    coordinate_row = ft.Row([coordinate_text, remove_button])
    coordinates.append(coordinate_row)
    raw_coordinates.append((x, y))  # Store raw coordinates
    coordinate_list.controls = coordinates
    coordinate_list.update()
    is_tracking = False

def on_button_click(e):
    global is_tracking
    is_tracking = True