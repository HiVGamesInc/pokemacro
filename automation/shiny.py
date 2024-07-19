import pyautogui
import asyncio
import my_keyboard

async def catchShiny(pokemon, key, confidence):
    global found_shiny
    print(f"Images/shiny-{pokemon}.png")
    location = pyautogui.locateCenterOnScreen(f"Images/shiny-{pokemon}.png", confidence=confidence)
    if location:
        print("found")
        found_shiny = True
        update_status()
        pyautogui.moveTo(location)
        my_keyboard.press(key)

        pyautogui.click(location)
        await asyncio.sleep(0.6) 
    found_shiny = False
    update_status()

async def catch_selected_shinies():
    # Your existing code here

def on_shiny_select(e, value):
    # Your existing code here

def on_shiny_toggle(shiny, value):
    # Your existing code here