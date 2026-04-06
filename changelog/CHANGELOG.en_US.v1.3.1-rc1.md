# OpenLucky v1.3.1-rc1

## Features

### Auto-Update Check Functionality
- Added automatic update checking on application startup
- Implemented version checker module (`versionChecker.js`) that queries GitHub API for latest releases
- Added update notification dialog when new version is available
- Integrated shell module to open release page in default browser for downloading
- Implemented hourly interval checking to avoid excessive API calls
- Added error handling for network connectivity issues
- Added user-friendly dialog for update notifications and network errors
- Stores last check timestamp in user data directory for persistence

### Code Quality & Maintenance
- Updated version to v1.3.1-rc1 across all configuration files
- Added comprehensive logging for update checking process
- Improved error messages and user feedback
