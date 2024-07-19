from PIL import Image, ImageEnhance, ImageOps, ImageGrab, ImageChops, ImageStat
import pytesseract
import pyautogui
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
import imagehash
import json

class GlobalState:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(GlobalState, cls).__new__(cls)
            
            # Initialize your global variables here
            cls._instance.is_running = False
            cls._instance.shiny_types = ["karp", "buzz"]
            cls._instance.button_options = ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"]
            cls._instance.selected_shinies = {shiny: False for shiny in cls._instance.shiny_types}
            cls._instance.dropdown_values = {shiny: None for shiny in cls._instance.shiny_types}
            cls._instance.slider_value = 7.5
            cls._instance.is_fishing = False
            cls._instance.should_fish = False
            cls._instance.found_shiny = False
            cls._instance.coordinates = []
            cls._instance.is_tracking = False
            cls._instance.is_tracking_revive = False
            cls._instance.is_resolving = False
            cls._instance.combos = {}
            # ... add all other global variables
            
        return cls._instance
    
    def to_dict(self):
        print("Debug selected_combo:", self.combos) 
        return {
            'is_running': self.is_running,
            'shiny_types': self.shiny_types,
            'button_options': self.button_options,
            'selected_shinies': self.selected_shinies,
            'dropdown_values': self.dropdown_values,
            'slider_value': self.slider_value,
            'is_fishing': self.is_fishing,
            'should_fish': self.should_fish,
            'found_shiny': self.found_shiny,
            'coordinates': self.coordinates,
            'is_tracking': self.is_tracking,
            'is_tracking_revive': self.is_tracking_revive,
            'is_resolving': self.is_resolving,
            'revive_position': self.revive_position,
            'revive_hotkey_field': self.revive_hotkey_field,
            'pokestop_hotkey_field': self.pokestop_hotkey_field,
            'fishing_hotkey_field': self.fishing_hotkey_field,
            'use_revive': self.use_revive,
            'item_objects': [{'name': item.name, 'hotkey': item.hotkey} for item in self.item_objects],
            'combos': self.combos,
            'selected_combo': self.selected_combo,
            'revive_slider_value': self.revive_slider_value,
            'medicine_hotkey_field': self.medicine_hotkey_field,
            'auto_revive_hotkey_field': self.auto_revive_hotkey_field
            # ... add all other global variables
        }

    def from_dict(self, config_dict):
        from main import Item
        self.is_running = config_dict.get('is_running', False)
        self.shiny_types = config_dict.get('shiny_types', ["karp", "buzz"])
        self.button_options = config_dict.get('button_options', ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"])
        self.selected_shinies = config_dict.get('selected_shinies', {shiny: False for shiny in self.shiny_types})
        self.dropdown_values = config_dict.get('dropdown_values', {shiny: None for shiny in self.shiny_types})
        self.slider_value = config_dict.get('slider_value', 7.5)
        self.is_fishing = config_dict.get('is_fishing', False)
        self.should_fish = config_dict.get('should_fish', False)
        self.found_shiny = config_dict.get('found_shiny', False)
        self.coordinates = config_dict.get('coordinates', [])
        self.is_tracking = config_dict.get('is_tracking', False)
        self.is_tracking_revive = config_dict.get('is_tracking_revive', False)
        self.is_resolving = config_dict.get('is_resolving', False)
        self.revive_position = config_dict.get('revive_position', False)
        self.revive_hotkey_field = config_dict.get('revive_hotkey_field', False)
        self.pokestop_hotkey_field = config_dict.get('pokestop_hotkey_field', False)
        self.auto_revive_hotkey_field = config_dict.get('auto_revive_hotkey_field', False)
        self.use_revive = config_dict.get('use_revive', False)
        self.item_objects = config_dict.get('item_objects', [])
        self.combos = config_dict.get('combos', {})
        self.selected_combo = config_dict.get('selected_combo', {})
        self.revive_slider_value = config_dict.get('revive_slider_value', 0)
        self.fishing_hotkey_field = config_dict.get('fishing_hotkey_field', False)
        self.medicine_hotkey_field = config_dict.get('medicine_hotkey_field', False)

        # ... add all other global variables

    def save_to_file(self, file_path):
        with open(file_path, 'w') as f:
            json.dump(self.to_dict(), f, indent=4)

    def load_from_file(self, file_path):
            with open(file_path, 'r') as f:
                config_dict = json.load(f)
            self.from_dict(config_dict)
