import pyautogui
import my_keyboard
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
import sys
import os
from utils.global_state import global_state
from utils.globals import globals
import modules.fishing as fishing
import modules.attack_combo as attack_combo
from models.item import Item, ItemList

revive_slider_value = 3
is_tracking_revive = False
# x, y, width, height = 880, 598, 155, 38

if getattr(sys, 'frozen', False):
    bundle_dir = sys._MEIPASS
else:
    bundle_dir = os.path.abspath(os.path.dirname(__file__))


def create_status_row(text: str, is_active: bool, contentValue: str, container: ft.Container = None) -> ft.Row:
    status_text = ft.Text(text)
    if container is None:
        container = ft.Container(
            content=ft.Text(contentValue)
        )
    return ft.Row([status_text, container], alignment=ft.MainAxisAlignment.CENTER)


# def mouse_listener():
#     with mouse.Listener(on_click=fishing.on_click) as listener:
#         listener.join()

# mouse_thread = threading.Thread(target=mouse_listener)
# mouse_thread.start()

        
def process_item(name, hotkey):
    print(f"Processing item with name: {name} and hotkey: {hotkey}")
    my_keyboard.press(hotkey, 0.1)
       
def main(page: ft.Page):
    # global main_loop_status, auto_revive_hotkey_field, fishing_status, main_loop_container, fishing_container, audio, audio2, audio3, coordinate_list, revive_position, revive_hotkey_field, medicine_hotkey_field, selected_combo_name, revive_slider_value, fishing_hotkey_field, attack_delay_slider_value, attack_delay_slider
    global auto_revive_hotkey_field, main_loop_container, fishing_container, audio, audio2, audio3, coordinate_list, revive_hotkey_field, medicine_hotkey_field, selected_combo_name, revive_slider_value, fishing_hotkey_field, attack_delay_slider_value, attack_delay_slider
    page.title = "Botiada"
    page.vertical_alignment = ft.MainAxisAlignment.CENTER

    main_loop_container = ft.Container(content=ft.Text(" "), width=65, height=25)
    fishing_container = ft.Container(content=ft.Text(" "), width=35, height=25)

    # main_loop_status = create_status_row(f"Main Loop:", is_running, "Not Running", main_loop_container)
    # fishing_status = create_status_row(f"Fishing:", is_fishing,  "No", fishing_container)


    flet_button_options = [ft.dropdown.Option(option) for option in globals.button_options]
    fishing_checkbox = ft.Checkbox(
        label="Fishing Enabled",
        value=False,
        on_change=fishing.on_fishing_toggle
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
        on_change=fishing.on_slider_change,
    )

    track_button = ft.ElevatedButton("Add Fishing Spot", on_click=fishing.on_button_click)

    coordinate_list = ft.ListView(controls=fishing.coordinates, spacing=10,height=150)

    btn_start = ft.ElevatedButton("Start", on_click=fishing.start_automation)
    btn_stop = ft.ElevatedButton("Stop", on_click=fishing.stop_automation)
    
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
            # ft.Row( [main_loop_status,
            # fishing_status,
            # shiny_status]),
           
            track_button,
            coordinate_list,
            # ft.Text("Select Pokemon:"),
            # ft.Column([ *shiny_checkboxes_with_dd], alignment=ft.alignment.top_left),
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
    revive_spot = ft.ElevatedButton("Revive position", on_click=attack_combo.on_revive_button_click)
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
    should_use_revive = ft.Checkbox(label="Use revive",value=False,on_change=attack_combo.on_use_revive_toggle)

    
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
            on_change=attack_combo.on_revive_slider_change,
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
            on_change=attack_combo.on_attack_delay_slider_change,
        )


    def create_new_combo():
        global combo_options
        # Get the values from the fields
        combo_name = combo_name_field.value
        revive_slider_value = globals.revive_slider_value["value"]
        attack_delay_slider_value = globals.attack_delay_slider_value["value"]
        
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
    keyboard.add_hotkey('ctrl+alt+s', lambda e=None: fishing.start_automation())

    keyboard.add_hotkey('ctrl+alt+x', lambda e=None: fishing.stop_automation())

    keyboard.add_hotkey('ctrl+shift+s', lambda e=None: global_state.save_to_file(os.path.join(bundle_dir, 'config.json')))

    def handle_key_press(event):
        if event.event_type == 'down' and event.name == "'":
                iterate_and_process_items(item_list)

    def handle_auto_revive_key_press(event):
        if event.event_type == 'down' and event.name == auto_revive_hotkey_field.value.lower():
            attack_combo.use_auto_revive(False, 0)

    keyboard.hook(handle_key_press)
    keyboard.hook(handle_auto_revive_key_press)


    # keyboard.add_hotkey('*\'', lambda e=None: iterate_and_process_items(item_list))
    # keyboard.add_hotkey("2", lambda e=None: catchAll("current", 0.8))

global_state.load_from_file(os.path.join(bundle_dir, 'config.json'))
ft.app(target=main)

keyboard.wait()


