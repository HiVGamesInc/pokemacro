from pynput import mouse
from utils.global_state import GlobalState
global_state = GlobalState()

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