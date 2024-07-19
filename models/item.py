import flet as ft
from utils.global_state import global_state
from utils.globals import globals

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
        selected_combo = global_state.combos.get(globals.selected_combo_name, {})
        selected_combo['item_list'] = self.get_all_items_and_hotkeys()
        self.page.update()

    def remove_item(self, item):
        self.item_objects.remove(item)
        self.items.remove(item.view)
        self.list_view.controls = self.items  # Update the ListView controls
        global_state.item_objects = self.item_objects
        selected_combo = global_state.combos.get(globals.selected_combo_name, {})
        print(self.get_all_items_and_hotkeys())
        selected_combo['item_list'] = self.get_all_items_and_hotkeys()
        self.page.update()

    def remove_all(self):
        self.items.clear()
        self.update_list_view()


    def get_all_items_and_hotkeys(self):
        return [(item.name, item.hotkey) for item in self.item_objects]