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
    hiddenimports=['keyboard', 'pkg_resources.extern', 'webview'],  # Adicione imports ocultos se necessário
    hookspath=[],                # Adicione caminhos para hooks customizados se necessário
    runtime_hooks=[],            # Adicione runtime hooks se necessário
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='pokemacro',
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    debug=False,
    console=False,  # Altere para True se precisar de um console
)
