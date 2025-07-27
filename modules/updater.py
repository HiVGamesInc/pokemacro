import os
import sys
import json
import requests
import zipfile
import tempfile
import shutil
import subprocess
import threading
from packaging import version
from typing import Optional, Dict, Any

def resource_path(relative_path):
    """ Get the absolute path to a resource, works for dev and for PyInstaller """
    if hasattr(sys, '_MEIPASS'):
        # PyInstaller places temporary files in a folder specified by _MEIPASS
        return os.path.join(sys._MEIPASS, relative_path)
    return os.path.join(os.path.abspath("."), relative_path)

def load_version_info():
    """Load version information from version.json"""
    try:
        version_file = resource_path('version.json')
        with open(version_file, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        # Fallback if version.json is not found
        return {
            "version": "3.0.0",
            "app_name": "Pokemacro",
            "github_repo": "HiVGamesInc/pokemacro",
            "auto_update_enabled": True,
            "update_check_interval": 3600
        }

class AutoUpdater:
    def __init__(self, 
                 current_version: str,
                 github_repo: str = "HiVGamesInc/pokemacro",
                 update_check_interval: int = 3600):  # Check every hour
        """
        Initialize the auto-updater
        
        Args:
            current_version: Current version of the app (e.g., "3.0.0")
            github_repo: GitHub repository in format "owner/repo"
            update_check_interval: How often to check for updates (seconds)
        """
        self.current_version = current_version
        self.github_repo = github_repo
        self.update_check_interval = update_check_interval
        self.github_api_url = f"https://api.github.com/repos/{github_repo}/releases/latest"
        self.update_available = False
        self.latest_release_info = None
        self.is_checking = False
        
    def get_current_executable_path(self) -> str:
        """Get the path of the current executable"""
        if hasattr(sys, '_MEIPASS'):
            # Running as compiled executable
            return sys.executable
        else:
            # Running as script (development)
            return os.path.abspath(__file__)
    
    def check_for_updates(self) -> Dict[str, Any]:
        """
        Check if there's a newer version available
        
        Returns:
            Dictionary with update information
        """
        try:
            self.is_checking = True
            response = requests.get(self.github_api_url, timeout=10)
            response.raise_for_status()
            
            release_info = response.json()
            latest_version = release_info['tag_name'].lstrip('v')  # Remove 'v' prefix if present
            
            self.latest_release_info = release_info
            
            if version.parse(latest_version) > version.parse(self.current_version):
                self.update_available = True
                return {
                    "update_available": True,
                    "current_version": self.current_version,
                    "latest_version": latest_version,
                    "release_notes": release_info.get('body', 'No release notes available'),
                    "download_url": self._get_download_url(release_info),
                    "release_date": release_info.get('published_at'),
                    "release_name": release_info.get('name', f'Version {latest_version}')
                }
            else:
                self.update_available = False
                return {
                    "update_available": False,
                    "current_version": self.current_version,
                    "latest_version": latest_version,
                    "message": "You are running the latest version"
                }
                
        except requests.RequestException as e:
            return {
                "error": True,
                "message": f"Failed to check for updates: {str(e)}"
            }
        except Exception as e:
            return {
                "error": True,
                "message": f"Unexpected error while checking for updates: {str(e)}"
            }
        finally:
            self.is_checking = False
    
    def _get_download_url(self, release_info: Dict) -> Optional[str]:
        """
        Extract the download URL for the Windows executable from release assets
        """
        assets = release_info.get('assets', [])
        
        # Look for Windows executable or zip file
        for asset in assets:
            name = asset['name'].lower()
            if (name.endswith('.exe') or 
                name.endswith('.zip') and 'windows' in name or
                name.endswith('.zip') and 'win' in name):
                return asset['browser_download_url']
        
        # If no specific Windows asset found, return the first zip file
        for asset in assets:
            if asset['name'].lower().endswith('.zip'):
                return asset['browser_download_url']
                
        return None
    
    def download_update(self, progress_callback=None) -> Dict[str, Any]:
        """
        Download the latest update
        
        Args:
            progress_callback: Function to call with download progress (0-100)
        
        Returns:
            Dictionary with download result
        """
        if not self.update_available or not self.latest_release_info:
            return {"error": True, "message": "No update available"}
        
        try:
            download_url = self._get_download_url(self.latest_release_info)
            if not download_url:
                return {"error": True, "message": "No download URL found for this release"}
            
            # Create temp directory for download
            temp_dir = tempfile.mkdtemp(prefix="pokemacro_update_")
            filename = os.path.basename(download_url)
            temp_file_path = os.path.join(temp_dir, filename)
            
            # Download with progress tracking
            response = requests.get(download_url, stream=True, timeout=30)
            response.raise_for_status()
            
            total_size = int(response.headers.get('content-length', 0))
            downloaded_size = 0
            
            with open(temp_file_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
                        downloaded_size += len(chunk)
                        
                        if progress_callback and total_size > 0:
                            progress = int((downloaded_size / total_size) * 100)
                            progress_callback(progress)
            
            return {
                "success": True,
                "temp_file_path": temp_file_path,
                "temp_dir": temp_dir,
                "filename": filename
            }
            
        except Exception as e:
            return {"error": True, "message": f"Failed to download update: {str(e)}"}
    
    def install_update(self, temp_file_path: str, temp_dir: str) -> Dict[str, Any]:
        """
        Install the downloaded update
        
        Args:
            temp_file_path: Path to the downloaded update file
            temp_dir: Temporary directory containing the update
        
        Returns:
            Dictionary with installation result
        """
        try:
            current_exe_path = self.get_current_executable_path()
            current_dir = os.path.dirname(current_exe_path)
            
            if temp_file_path.endswith('.zip'):
                # Extract zip file
                extract_dir = os.path.join(temp_dir, "extracted")
                with zipfile.ZipFile(temp_file_path, 'r') as zip_ref:
                    zip_ref.extractall(extract_dir)
                
                # Find the executable in the extracted files
                new_exe_path = None
                for root, dirs, files in os.walk(extract_dir):
                    for file in files:
                        if file.endswith('.exe') and 'pokemacro' in file.lower():
                            new_exe_path = os.path.join(root, file)
                            break
                    if new_exe_path:
                        break
                
                if not new_exe_path:
                    return {"error": True, "message": "Could not find executable in update package"}
                
            elif temp_file_path.endswith('.exe'):
                new_exe_path = temp_file_path
            else:
                return {"error": True, "message": "Unsupported update file format"}
            
            # Create update script
            update_script = self._create_update_script(current_exe_path, new_exe_path, current_dir)
            
            # Execute update script and exit current application
            subprocess.Popen([update_script], shell=True)
            
            return {
                "success": True,
                "message": "Update will be installed after the application restarts"
            }
            
        except Exception as e:
            return {"error": True, "message": f"Failed to install update: {str(e)}"}
    
    def _create_update_script(self, current_exe: str, new_exe: str, install_dir: str) -> str:
        """
        Create a batch script to handle the update process
        """
        current_exe_name = os.path.basename(current_exe)
        script_content = f'''@echo off
echo Updating Pokemacro...

REM Wait a bit for the application to close
timeout /t 2 /nobreak > nul

REM Kill any running instances of the application
taskkill /F /IM "{current_exe_name}" > nul 2>&1

REM Wait a bit more
timeout /t 1 /nobreak > nul

REM Backup current executable
if exist "{current_exe}" (
    move "{current_exe}" "{current_exe}.backup" > nul 2>&1
)

REM Copy new executable
copy "{new_exe}" "{current_exe}" > nul 2>&1

if exist "{current_exe}" (
    echo Update successful!
    REM Start the updated application
    start "" "{current_exe}"
) else (
    echo Update failed! Restoring backup...
    if exist "{current_exe}.backup" (
        move "{current_exe}.backup" "{current_exe}" > nul 2>&1
        start "" "{current_exe}"
    )
)

REM Clean up temp files
rmdir /S /Q "{os.path.dirname(new_exe)}" > nul 2>&1

REM Clean up this script
del "%~f0" > nul 2>&1
'''
        
        script_path = os.path.join(install_dir, "update_pokemacro.bat")
        with open(script_path, 'w') as f:
            f.write(script_content)
        
        return script_path
    
    def start_background_check(self, callback=None):
        """
        Start checking for updates in the background
        
        Args:
            callback: Function to call when an update is found
        """
        def check_loop():
            while True:
                try:
                    result = self.check_for_updates()
                    if result.get('update_available') and callback:
                        callback(result)
                    threading.Event().wait(self.update_check_interval)
                except Exception as e:
                    print(f"Error in background update check: {e}")
                    threading.Event().wait(self.update_check_interval)
        
        thread = threading.Thread(target=check_loop, daemon=True)
        thread.start()

# Singleton instance
_updater_instance = None

def get_updater(current_version: str = None) -> AutoUpdater:
    """Get or create the updater singleton instance"""
    global _updater_instance
    if _updater_instance is None:
        version_info = load_version_info()
        if current_version is None:
            current_version = version_info["version"]
        _updater_instance = AutoUpdater(
            current_version=current_version,
            github_repo=version_info["github_repo"],
            update_check_interval=version_info["update_check_interval"]
        )
    return _updater_instance
