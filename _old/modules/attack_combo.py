import pyautogui
import time
import flet as ft
import keyboard
from models.item import Item, ItemList
from utils.global_state import global_state
from utils.globals import globals

class AttackCombo:
    def __init__(self, page):
        self.item_list = ItemList(page)
        self.new_item_list = ItemList(page)
        self.add_button = ft.ElevatedButton("Add New Item", on_click=lambda _: self.item_list.add_item(name_field.value, hotkey_field.value))
        self.add_modal_button = ft.ElevatedButton("Add New Item", on_click=lambda _: self.new_item_list.add_item(name_field.value, hotkey_field.value))
        self.combo_name_field = ft.TextField(label="Combo Name", dense=True, width=200 )
        self.name_field = ft.TextField(label="Skill", dense=True, width=200 )
        self.hotkey_field =  ft.Dropdown(
                label="Hotkey",
                        width=200,
                        options=globals.flet_button_options,
                    )
        self.revive_slider_value = ft.Text(size=15,
            color=ft.colors.WHITE,
            weight=ft.FontWeight.NORMAL,)
        self.revive_slider = ft.Slider(
                min=0,
                max=6,
                divisions=1000,
                label="{value}",
                width=300,
                on_change=self.on_revive_slider_change,
            )
        self.attack_delay_slider_value = ft.Text(size=15,
                color=ft.colors.WHITE,
                weight=ft.FontWeight.NORMAL,)
        self.attack_delay_slider = ft.Slider(
                min=0,
                max=6,
                divisions=1000,
                label="{value}",
                width=300,
                on_change=self.on_attack_delay_slider_change,
            )
        self.medicine_hotkey_field =  ft.Dropdown(
         label="Medicine Hotkey",
                    width=200,
                    options=globals.flet_button_options,
                    on_change=lambda e: setattr(global_state, 'medicine_hotkey_field', e.control.value)
                )
        self.pokestop_hotkey_field =  ft.Dropdown(
            label="Pokestop Hotkey",
                        width=200,
                        options=globals.flet_button_options,
                        on_change=lambda e: setattr(global_state, 'pokestop_hotkey_field', e.control.value)
                    )
        self.should_use_revive = ft.Checkbox(label="Use revive",value=False,on_change=self.on_use_revive_toggle)
        self.revive_hotkey_field =  ft.Dropdown(
            label="Revive Hotkey",
                        width=200,
                        options=globals.flet_button_options,
                        on_change=lambda e: setattr(global_state, 'revive_hotkey_field', e.control.value)
                    )
        self.auto_revive_hotkey_field =  ft.Dropdown(
            label="Auto Revive Hotkey",
                        width=200,
                        options=globals.flet_button_options,
                        on_change=lambda e: self.set_auto_revive(e),
                    )
        self.revive_spot = ft.ElevatedButton("Revive position", on_click=self.on_revive_button_click)
        self.revive_position = ft.Text(size=15,
                color=ft.colors.WHITE,
                weight=ft.FontWeight.NORMAL,)
        self.combo_options = [ft.dropdown.Option(combo_name) for combo_name in global_state.combos.keys()]
        self.selected_combo = global_state.selected_combo
        self.combo_dropdown = ft.Dropdown(
            width=200,
            options=self.combo_options,
            value=self.selected_combo,
            on_change=lambda value: self.update_second_tab_content(value.control.value)
        )
        self.open_dlg_modal = ft.ElevatedButton("Create New Combo", on_click=self.open_dlg_modal)
        self.dlg_modal = ft.AlertDialog(
            modal=True,
            title=ft.Text("New Combo"),
            content=ft.Column([self.combo_name_field,
                self.name_field,
                self.hotkey_field,
                self.add_modal_button,
                ft.Row([ft.Text("Revive Delay"), self.revive_slider_value, self.revive_slider]),
                ft.Row([ft.Text("Attack Delay"), self.attack_delay_slider_value, self.attack_delay_slider]),
                ft.Column([self.new_item_list.list_view], width=200, height=100, alignment=ft.MainAxisAlignment.CENTER)], width=700, height=700),
                actions=[
                ft.ElevatedButton("Ok", on_click=lambda e: [self.create_new_combo(), self.close_dlg(e)]),
                ft.ElevatedButton("Cancel", on_click=self.close_dlg),
            ],
            
            actions_alignment=ft.MainAxisAlignment.END,
            on_dismiss=lambda e: print("Modal dialog dismissed!"),
        )
        
        self.page = page

        self.pageUI = ft.Column(
            [
                self.open_dlg_modal,
                self.combo_dropdown,
                self.name_field,
                self.hotkey_field,
                self.add_button,
                ft.Row([self.revive_spot, self.revive_position, self.should_use_revive, self.pokestop_hotkey_field]),
                ft.Row([ft.Text("Revive Delay"), self.revive_slider_value, self.revive_slider]),
                ft.Row([ft.Text("Attack Delay"), self.attack_delay_slider_value, self.attack_delay_slider]),
                self.revive_hotkey_field,
                self.auto_revive_hotkey_field,
                self.medicine_hotkey_field,
                ft.Column([self.item_list.list_view], width=200, alignment=ft.MainAxisAlignment.CENTER)
            ],
            alignment=ft.MainAxisAlignment.CENTER,
        )

        keyboard.hook(self.handle_key_press)
        keyboard.hook(self.handle_auto_revive_key_press)

    def create_new_combo(self):
        global combo_options
        # Get the values from the fields
        combo_name = combo_name_field.value
        revive_slider_value = globals.revive_slider_value["value"]
        attack_delay_slider_value = globals.attack_delay_slider_value["value"]
        
        # Create a dictionary for the new combo
        print(self.new_item_list.get_all_items_and_hotkeys())
        new_combo = {
            'revive_slider_value': revive_slider_value,
            'attack_delay_slider_value': attack_delay_slider_value,
            'item_list': self.new_item_list.get_all_items_and_hotkeys()  # Assuming this function returns the items
        }
        
        # Add the new combo to the global_state's combos dictionary
        global_state.combos[combo_name] = new_combo
        combo_options = [ft.dropdown.Option(combo_name) for combo_name in global_state.combos.keys()]
        page.update()
        print(f"New combo {combo_name} added to global_state.")
        print(global_state)

    def open_dlg_modal(self):
        page.dialog = dlg_modal
        dlg_modal.open = True
        page.update()

    def close_dlg(self):
        dlg_modal.open = False
        page.update()

    def set_auto_revive(self, value):
        global auto_revive_hotkey_field
        auto_revive_hotkey_field = value.control
        # if global_state.auto_revive_hotkey_field:
        #     keyboard.release(global_state.auto_revive_hotkey_field)
        # global_state.auto_revive_hotkey_field = value
        # keyboard.add_hotkey(value, lambda: use_auto_revive())
        setattr(global_state, 'auto_revive_hotkey_field', value.control.value),

    def on_revive_slider_change(self):
        global selected_combo_name, revive_slider, revive_slider_value
        selected_combo = global_state.combos.get(globals.selected_combo_name, {})
        globals.revive_slider_value["value"] = round(e.control.value, 2)  
        globals.revive_slider_value.update()
        global_state.revive_slider_value = globals.revive_slider_value["value"]  
        selected_combo['revive_slider_value']  = globals.revive_slider_value["value"]  
        print(selected_combo)

    def on_attack_delay_slider_change(self):
        global selected_combo_name, attack_delay_slider, attack_delay_slider_value
        selected_combo = global_state.combos.get(globals.selected_combo_name, {})
        globals.attack_delay_slider_value["value"] = round(e.control.value, 2)  
        globals.attack_delay_slider_value.update()
        global_state.attack_delay_slider_value = globals.attack_delay_slider_value["value"]  
        selected_combo['attack_delay_slider_value']  = globals.attack_delay_slider_value["value"] 
        print(selected_combo)

    def on_use_revive_toggle(self, value):
        global_state.use_revive = value.control.value

    def on_click(self, x, y, button, pressed):
        print('click attack')
        global is_tracking, is_tracking_revive
        globals.revive_position["value"] = f"{x},{y}"
        globals.revive_position.update()
        global_state.revive_position = globals.revive_position["value"]
        is_tracking_revive = False  

    def on_revive_button_click(self):
        global is_tracking_revive
        is_tracking_revive = True

    def use_auto_revive(self, useDelay, delayValue):
        global revive_hotkey_field

        if globals.revive_position["value"] is not None:
            currentPosition = pyautogui.position()
            if useDelay:
                print(delayValue)
                time.sleep(delayValue)
            x, y = map(int, globals.revive_position["value"].split(","))
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

    def iterate_and_process_items(self, item_list):
        print("combo")
        global revive_hotkey_field
        selected_combo = global_state.combos.get(globals.selected_combo_name, {})
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
        if globals.revive_position["value"] is not None and global_state.use_revive:
            use_auto_revive(True, selected_combo['revive_slider_value'])
        #     currentPosition = pyautogui.position()
        #     x, y = map(int, globals.revive_position["value"].split(","))
        #     print(x, y)
        #     pyautogui.moveTo(x, y)
        #     pyautogui.rightClick()
        #         pyautogui.press(global_state.revive_hotkey_field)
        #         time.sleep(selected_combo['revive_slider_value'])
        #         pyautogui.leftClick()

        #     # my_keyboard.press(revive_hotkey_field.value,0.1)
        #     # pyautogui.moveTo(x, y)
        #     pyautogui.rightClick()
        #     time.sleep(0.1)
        #     pyautogui.moveTo(currentPosition)
    
    def handle_key_press(self, event):
        if event.event_type == 'down' and event.name == "'":
                self.iterate_and_process_items(item_list)

    def handle_auto_revive_key_press(self, event):
        if event.event_type == 'down' and event.name == self.auto_revive_hotkey_field.value.lower():
            self.use_auto_revive(False, 0)

    def update_second_tab_content(self, name):
        self.item_list.items.clear()
        self.item_list.item_objects.clear()
        self.selected_combo = global_state.combos.get(name, {})
        self.selected_combo_name = name
        
        # Update the fields based on the selected combo
        self.name_field.value = self.selected_combo.get('name', '')
        # hotkey_field.value = global_state.hotkey
        self.revive_position.value = global_state.revive_position
        self.should_use_revive.value = global_state.use_revive
        self.pokestop_hotkey_field.value = global_state.pokestop_hotkey_field
        self.revive_hotkey_field.value = global_state.revive_hotkey_field
        self.medicine_hotkey_field.value = global_state.medicine_hotkey_field
        self.global_item_list = self.selected_combo.get('item_list', [])
        self.revive_slider_value.value  = self.selected_combo.get('revive_slider_value', 0)
        self.revive_slider.value  = self.selected_combo.get('revive_slider_value', 0)
        # self.fishingModule.fishing_hotkey_field.value = global_state.fishing_hotkey_field
        self.auto_revive_hotkey_field.value = global_state.auto_revive_hotkey_field

        for item in self.selected_combo['item_list']:
            self.item_list.add_item(item[0], item[1])
        self.page.update()