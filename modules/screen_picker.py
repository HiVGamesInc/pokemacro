import tkinter as tk
import requests

FLASK_SERVER_URL = "http://127.0.0.1:5000/selection"

class ScreenBoxPicker:
    def __init__(self, root):
        self.root = root
        self.root.attributes("-fullscreen", True)
        self.root.attributes("-alpha", 0.3)  # Semi-transparent window
        self.canvas = tk.Canvas(root, cursor="cross")
        self.canvas.pack(fill=tk.BOTH, expand=True)

        self.start_x = self.start_y = self.end_x = self.end_y = 0
        self.rect = None
        self.selecting = False

        self.canvas.bind("<ButtonPress-1>", self.on_button_press)
        self.canvas.bind("<B1-Motion>", self.on_mouse_drag)
        self.canvas.bind("<ButtonRelease-1>", self.on_button_release)

    def on_button_press(self, event):
        self.start_x = event.x
        self.start_y = event.y
        self.selecting = True

    def on_mouse_drag(self, event):
        if self.selecting:
            self.end_x = event.x
            self.end_y = event.y
            if self.rect:
                self.canvas.delete(self.rect)
            self.rect = self.canvas.create_rectangle(
                self.start_x, self.start_y, self.end_x, self.end_y, outline="red", dash=(4, 4)
            )

    def on_button_release(self, event):
        self.selecting = False
        self.root.destroy()

        # Send coordinates to Flask
        selection_data = {
            "x_start": self.start_x,
            "x_end": self.end_x,
            "y_start": self.start_y,
            "y_end": self.end_y,
        }
        try:
            response = requests.post(FLASK_SERVER_URL, json=selection_data)
            print("Response from server:", response.status_code, response.text)
        except requests.exceptions.RequestException as e:
            print("Failed to send data to server:", e)

if __name__ == "__main__":
    root = tk.Tk()
    picker = ScreenBoxPicker(root)
    root.mainloop()