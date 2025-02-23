from cx_Freeze import setup, Executable

# Define build options
build_exe_options = {
    "packages": ["keyboard"],  # Include any additional packages required
    "include_files": [
        ("app/build", "app/build"),
        ("modules", "modules"),
    ]
}

# Define executable
executables = [Executable("main.py", base=None, target_name="pokemacro.exe")]

setup(
    name="Pokemacro",
    version="0.1",
    description="Your application description",
    options={"build_exe": build_exe_options},
    executables=executables
)
