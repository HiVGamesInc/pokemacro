import webview
from flask import Flask, render_template, jsonify
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/trigger_os_event', methods=['POST'])
def trigger_os_event():
    # Example: Open a file explorer
    os.system('explorer' if os.name == 'nt' else 'open .')
    return jsonify({"message": "OS event triggered!"})

def start_flask():
    app.run()

if __name__ == '__main__':
    # Create a PyWebView window
    window = webview.create_window('PyWebView App', 'http://localhost:5000')
    
    # Start Flask in a separate thread
    import threading
    flask_thread = threading.Thread(target=start_flask)
    flask_thread.daemon = True
    flask_thread.start()

    # Start the PyWebView application
    webview.start()