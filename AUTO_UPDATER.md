# Pokemacro Auto-Updater

This document explains how the auto-updater system works in Pokemacro.

## Overview

The auto-updater automatically checks for new versions of Pokemacro from GitHub releases and provides a seamless update experience for your users.

## Features

- **Automatic Update Checking**: Checks for updates every hour
- **User-Friendly Interface**: Clean dialog showing release information
- **Progress Tracking**: Shows download progress during updates
- **Seamless Installation**: Automatically handles the update process
- **Version Management**: Centralized version configuration
- **GitHub Integration**: Uses GitHub releases for distribution

## How It Works

### 1. Version Management

Version information is stored in `version.json`:

```json
{
  "version": "3.0.0",
  "app_name": "Pokemacro",
  "github_repo": "HiVGamesInc/pokemacro",
  "auto_update_enabled": true,
  "update_check_interval": 3600
}
```

### 2. Update Checking

The system automatically:

- Checks GitHub releases API for the latest version
- Compares with current version using semantic versioning
- Shows notification when update is available

### 3. Update Process

1. **Detection**: Auto-updater detects new version
2. **Notification**: User sees update notification in header
3. **Dialog**: User can view release notes and download
4. **Download**: Update is downloaded with progress tracking
5. **Installation**: Batch script handles file replacement and restart

## API Endpoints

The Flask backend provides these endpoints:

- `GET /update/check` - Check for available updates
- `GET /update/info` - Get current update status
- `POST /update/download` - Download available update
- `POST /update/install` - Install downloaded update

## React Components

### UpdateContext

Manages update state and provides functions for checking, downloading, and installing updates.

### UpdateDialog

Modal dialog showing update information with options to download and install.

### UpdateNotification

Header component showing current version and update availability.

## Creating Releases

### Automatic Release (Recommended)

1. Update the version in `version.json` and `app/package.json`
2. Commit changes: `git commit -m "chore: bump version to X.X.X"`
3. Create tag: `git tag vX.X.X`
4. Push: `git push origin master && git push origin vX.X.X`
5. GitHub Actions automatically builds and creates release

### Using Release Scripts

**Windows:**

```bash
release.bat
```

**Linux/Mac:**

```bash
./release.sh
```

These scripts will:

- Ask for new version number
- Update version files
- Build frontend
- Commit changes
- Create and push tag
- Trigger automatic release build

## GitHub Actions Workflow

The `.github/workflows/release.yml` file automatically:

1. **Triggers** on version tags (e.g., `v3.0.1`)
2. **Builds** the React frontend
3. **Packages** with PyInstaller
4. **Creates** GitHub release with zip file
5. **Uploads** packaged executable

## Security Considerations

- Updates are only downloaded from official GitHub releases
- File integrity is maintained through proper packaging
- User has full control over when to install updates
- Backup of current executable is created before update

## User Experience

1. **Passive Checking**: Updates are checked automatically in background
2. **Non-Intrusive**: Only shows notification when update is available
3. **User Control**: User decides when to download and install
4. **Progress Feedback**: Clear progress indication during download
5. **Restart Handling**: Automatic restart after installation

## Troubleshooting

### Update Check Fails

- Check internet connection
- Verify GitHub repository exists and is accessible
- Check API rate limits

### Download Fails

- Ensure sufficient disk space
- Check firewall/antivirus settings
- Verify GitHub release assets exist

### Installation Fails

- Run as administrator if needed
- Close antivirus temporarily
- Check file permissions

## Configuration

You can modify update behavior by editing `version.json`:

- `auto_update_enabled`: Enable/disable auto-updating
- `update_check_interval`: How often to check (seconds)
- `github_repo`: Repository to check for updates

## Development

### Testing Updates

1. Create a test release on GitHub
2. Modify version number to be lower than test release
3. Use the UpdateTest page to test functionality
4. Monitor browser console for debugging information

### Adding New Features

The updater system is modular and can be extended:

- Add new update sources (not just GitHub)
- Implement delta updates for smaller downloads
- Add update scheduling
- Implement rollback functionality

## Files Overview

### Backend (Python)

- `modules/updater.py` - Core updater logic
- `modules/routes.py` - API endpoints for updates
- `version.json` - Version configuration

### Frontend (React)

- `app/src/contexts/UpdateContext.tsx` - Update state management
- `app/src/components/UpdateDialog.tsx` - Update modal dialog
- `app/src/components/UpdateNotification.tsx` - Header notification
- `app/src/pages/UpdateTest.tsx` - Testing interface

### Build & Release

- `.github/workflows/release.yml` - Automated build and release
- `release.bat` / `release.sh` - Release helper scripts
- `main.spec` - PyInstaller configuration

This auto-updater system ensures your friends always have the latest version of Pokemacro with minimal effort!
