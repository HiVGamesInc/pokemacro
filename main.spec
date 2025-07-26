# -*- mode: python ; coding: utf-8 -*-

block_cipher = None

a = Analysis(
    ['main.py'],
    pathex=['.'],
    binaries=[],
    datas=[
        ('app/build', 'app/build'),
        ('modules', 'modules'),
        ('configs', 'configs'),
        ('tesseract-ocr', 'tesseract-ocr'),
    ],
    hiddenimports=[
        'keyboard', 
        'pkg_resources.extern', 
        'webview',
        'webview.platforms.winforms',
        'pythonnet',
        'clr',
        'flask',
        'modules.routes',
        'modules.events',
        'modules.utils',
        'modules.key_mapper',
        'modules.snipper'
    ],
    hookspath=[],
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='pokemacro',
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    debug=False,
    console=False,  # Set to True for debugging if needed
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='pokemacro'
)
