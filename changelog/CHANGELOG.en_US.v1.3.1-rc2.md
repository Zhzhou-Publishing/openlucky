# OpenLucky v1.3.1-rc2

## Bug Fixes

### Module Resolution Issues in Packaged Applications
- Fixed "Cannot find module" errors in packaged Electron applications
- Consolidated `imageFormats.js` constants directly into `main.js`
- Consolidated `versionChecker.js` functionality directly into `main.js`
- Removed external module dependencies to prevent module resolution issues in asar archives
- This resolves build-time module loading problems when applications are packaged

## Documentation

### Skill Documentation
- Added `new_tag_and_release` skill documentation
- Improved project documentation structure

## Code Quality & Maintenance
- Bumped version to v1.3.1-rc2
- Simplified code structure by reducing module dependencies
- Improved application stability in production builds
