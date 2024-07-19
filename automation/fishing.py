import pyautogui
import asyncio
import my_keyboard
import random

async def startFishing(fishing_lock, raw_coordinates, slider_value):
    async with fishing_lock: 
        print("Started fishing")
        if not raw_coordinates:
            print("No coordinates available for fishing.")
            return
        area = random.choice(raw_coordinates)
        pyautogui.moveTo(area)
        await asyncio.sleep(0.3)
        my_keyboard.press("F8")
        pyautogui.click(area)
        await asyncio.sleep(slider_value)

def on_fishing_toggle(value):
        global should_fish
        print("before")
        print(should_fish)
        should_fish = value.control.value
        print(should_fish)
        print("after")
