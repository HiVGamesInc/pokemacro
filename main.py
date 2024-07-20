import webview
import threading
from modules import app

port = 5000

def start_flask():
    app.run(port=port)

if __name__ == '__main__':
    window = webview.create_window('Botiada', f'http://localhost:{port}')

    flask_thread = threading.Thread(target=start_flask)
    flask_thread.daemon = True
    flask_thread.start()

    webview.start()
