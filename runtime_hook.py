import os
import sys

# Set up environment for bundled application
if hasattr(sys, '_MEIPASS'):
    # Add the bundled directory to PATH for DLLs
    tesseract_path = os.path.join(sys._MEIPASS, 'tesseract-ocr')
    if os.path.exists(tesseract_path):
        os.environ['PATH'] = tesseract_path + os.pathsep + os.environ.get('PATH', '')
        os.environ['TESSDATA_PREFIX'] = os.path.join(tesseract_path, 'tessdata')
    
    # Ensure proper encoding
    os.environ['PYTHONIOENCODING'] = 'utf-8'
