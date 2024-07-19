import flet as ft
from ui.fishing_ui import fishing_ui_elements
from ui.shiny_ui import shiny_ui_elements
from ui.auto_combo_ui import auto_combo_ui_elements

def main(page: ft.Page):
    page.title = "Botiada"
    page.vertical_alignment = ft.MainAxisAlignment.CENTER

    tabs = ft.Tabs(
        selected_index=0,
        animation_duration=300,
        tabs=[
            ft.Tab(text="Fishing", content=fishing_ui_elements()),
            ft.Tab(text="Shiny", content=shiny_ui_elements()),
            ft.Tab(text="Auto Combo", content=auto_combo_ui_elements()),
        ],
        expand=1,
    )

    page.add(tabs)
    page.add(tabs)
    page.window_title_bar_hidden = True
    page.window_width = 600
    page.window_movable = True
    page.window_center()
    page.vertical_alignment = ft.alignment.center
    page.window_minimizable = True

    keyboard.add_hotkey('ctrl+alt+s', lambda e=None: start_automation())
    keyboard.add_hotkey('ctrl+alt+x', lambda e=None: stop_automation())


def create_status_row(text: str, is_active: bool, contentValue: str, container: ft.Container = None):
    # Your existing code here

def: update_status():
    # Your existing code here
