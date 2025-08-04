# Hook for EasyOCR
from PyInstaller.utils.hooks import collect_data_files, collect_submodules

# Collect all easyocr data files
datas = collect_data_files('easyocr')

# Collect all submodules
hiddenimports = collect_submodules('easyocr')

# Add specific imports that might be missed
hiddenimports += [
    'easyocr.easyocr',
    'easyocr.detection',
    'easyocr.recognition',
    'easyocr.utils',
    'easyocr.craft_utils',
    'easyocr.imgproc',
    'torchvision',
    'torch',
]
