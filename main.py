import os
import webview
import threading
from modules import app

port = 5000

def start_flask():
    app.run(port=port)

if __name__ == '__main__':
    window = webview.create_window(
        'Pokemacro', 
        f'http://127.0.0.1:{port}',
        width=1200,
        height=800
    )

    flask_thread = threading.Thread(target=start_flask)
    flask_thread.daemon = True
    flask_thread.start()

    debug_mode = os.environ.get('DEBUG_MODE', 'False').lower().strip() in ['true', '1', 'yes']
    webview.start(debug=debug_mode)
