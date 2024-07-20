import webview
import threading
from modules import app

def start_flask():
    app.run()

if __name__ == '__main__':
    window = webview.create_window('Botiada', 'http://localhost:5000')

    flask_thread = threading.Thread(target=start_flask)
    flask_thread.daemon = True
    flask_thread.start()

    webview.start()
