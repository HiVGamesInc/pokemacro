import flet as ft
from utils.global_state import global_state

buttons = ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "U", "T", "R", "Y", "Q", "1", "2", "3", "4"]

class Globals:
    def __init__(self):
        self.button_options = buttons
        self.revive_position = { 'value': '1,2' }
        self.coordinate_list = { 'value': '' }
        self.selected_combo_name = ''
        self.attack_delay_slider_value = { 'value': '' }
        self.revive_slider_value = { 'value': '' }
        self.flet_button_options = [ft.dropdown.Option(option) for option in buttons]

globals = Globals()