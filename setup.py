import json
from cx_Freeze import setup, Executable

# Load version info
with open('version.json', 'r') as f:
    version_info = json.load(f)

# Define build options
build_exe_options = {
    "packages": ["keyboard"],  # Include any additional packages required
    "include_files": [
        ("app/build", "app/build"),
        ("modules", "modules"),
        ("version.json", "version.json"),
    ]
}

# Define executable
executables = [Executable("main.py", base=None, target_name="pokemacro.exe")]

setup(
    name=version_info["app_name"],
    version=version_info["version"],
    description=version_info["description"],
    options={"build_exe": build_exe_options},
    executables=executables
)
