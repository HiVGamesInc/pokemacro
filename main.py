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
from modules.fishing import Fishing
from modules.attack_combo import AttackCombo
from models.item import Item, ItemList

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
    # Modules initialization
    fishingModule = Fishing(page)
    attackComboModule = AttackCombo(page)

    # Page defaults
    page.title = "Botiada"
    page.vertical_alignment = ft.MainAxisAlignment.CENTER

    tabs = ft.Tabs(
        selected_index=0,
        animation_duration=300,
        tabs=[
            ft.Tab(text="Fishing",content=fishingModule.pageUI),
            ft.Tab(text="Auto combo", content=attackComboModule.pageUI),   
        ],
        expand=1,
    )

    page.add(tabs)
    page.window_title_bar_hidden = True
    page.window_width = 600
    page.window_height = 800
    page.window_movable = True
    page.window_center()
    page.vertical_alignment = ft.alignment.center
    page.window_minimizable = True
    
    if attackComboModule.selected_combo:
        attackComboModule.update_second_tab_content(attackComboModule.selected_combo)
    
    page.update()

    keyboard.add_hotkey('ctrl+alt+s', lambda e=None: fishing.start_automation())

    keyboard.add_hotkey('ctrl+alt+x', lambda e=None: fishing.stop_automation())

    keyboard.add_hotkey('ctrl+shift+s', lambda e=None: global_state.save_to_file(os.path.join(bundle_dir, 'config.json')))

    

global_state.load_from_file(os.path.join(bundle_dir, 'config.json'))
ft.app(target=main)

keyboard.wait()


