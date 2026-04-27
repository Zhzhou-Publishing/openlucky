# v1.4.2

## New Features

- **macOS Native Support**: First-class macOS app with Apple Silicon support
- **Image Rotation**: Rotate photos in 90° increments, with each photo's rotation remembered independently
- **Four-point Perspective Correction**: New tool to fix tilted or skewed photos
- **Highlight & Shadow Curves**: Fine-tune highlights and shadows with precise curve controls
- **Per-channel Contrast**: Adjust red, green, and blue contrast independently for finer color control
- **HARMAN Phoenix II 200 Film Preset**: New film preset
- **Tabbed Photo Editor**: Editing controls reorganized into Basic and Advanced tabs
- **Version Recall Protection**: Automatic alerts when an installed version is no longer supported
- **Automatic Configuration**: Default settings are created on first launch

## Improvements

- **Faster Batch Processing**: Uses all available CPU cores for significant speed gains
- **Smoother File Loading**: Less UI lag when preparing the working directory
- **More Reliable Batch Save**: Clearer per-file progress and more stable saving of many photos at once
- **Better RAW Handling**: RAW files are now correctly saved as TIFF when applying presets
- **Smarter File Recognition**: Uppercase and mixed-case extensions (e.g. `.JPG`, `.NEF`, `.TIF`) are recognized correctly
- **Improved Photo Editing**: More consistent button feedback and a cleaner layout with better spacing
- **Multi-language Support**: Photo editor and update dialogs now support both English and Simplified Chinese
- **Better Update Checks**: Clearer notifications and more reliable handling of network problems
- **Lower Memory Usage**: Reduced memory consumption when processing many photos
- **Cross-platform Builds**: Unified Windows and macOS release builds with stronger checksums

## Bug Fixes

- Fixed installer shortcuts not being created correctly
- Fixed update check sometimes failing to detect new versions
- Fixed occasional false-positive errors during image resizing
- Fixed inconsistent CPU detection that affected batch performance
- Fixed processed photos occasionally reloading unexpectedly
- Fixed RAW file output format issues
