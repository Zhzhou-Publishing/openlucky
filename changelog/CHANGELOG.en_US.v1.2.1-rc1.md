# OpenLucky v1.2.1-rc1 Release Notes

## Release Information
- **Version**: v1.2.1-rc1
- **Release Date**: 2026-03-24
- **Branch**: feature/desktop-app

## Summary
This release focuses on performance optimization, improved image processing capabilities, and enhanced user experience during installation.

---

## 🚀 New Features

### Performance Optimization
- **Global Preset Caching**: Implemented in-memory caching for preset options with 5-minute validity period
  - Load presets from cache immediately upon application startup
  - Update cache silently in the background without blocking UI
  - Significantly reduced loading time for preset dropdowns

### Image Processing Enhancements
- **16-bit TIFF Support**: Added support for 16-bit TIFF image processing
  - Auto-detect input bit depth (8-bit or 16-bit)
  - Dynamic output bit depth determination based on input
  - Normalized all image processing to 0-1 float space for higher precision
  - Maintains full color fidelity for high-bit-depth images

### User Experience Improvements
- **Custom Installation Directory**: Users can now customize installation location
  - Enabled directory selection page in installer
  - Enabled program group selection page
  - Provides more control over installation settings

---

## 🔧 Improvements

### Refresh Button Enhancement
- Updated Refresh button to load presets and images in parallel
- Improved UX with instant cache loading followed by background updates
- Better responsiveness during data refresh operations

### Code Quality
- Improved Chinese code comments for better understanding
- Standardized license format to SPDX identifier (Apache-2.0)
- Normalized package.json naming convention (openlucky-app)

---

## 🐛 Bug Fixes

- Fixed package.json name and license format inconsistencies
- Updated MyAppVersion in OpenLucky.iss to match package.json version

---

## 📦 Installation Changes

### Installer Configuration
- Enabled `DisableDirPage=no` to show directory selection
- Enabled `DisableProgramGroupPage=no` to show program group selection
- Maintained modern wizard style and LZMA compression

---

## 📝 Technical Details

### Caching Mechanism
- New utility module: `app/src/utils/presetCache.js`
- Functions:
  - `getCachedPresets()`: Retrieve cached presets with validation
  - `updateCachedPresets(presets)`: Update cache with timestamp
  - `clearCachedPresets()`: Clear cache manually
  - `hasValidCache()`: Check cache validity

### Image Processing Pipeline
1. Read image with `cv2.IMREAD_UNCHANGED` to preserve bit depth
2. Detect input bit depth and normalize to 0-1 float space
3. Color mask removal in normalized space
4. Color inversion
5. Gamma correction
6. Auto-levels and contrast adjustment
7. Dynamic output based on input bit depth

---

## 🔄 Migration Notes

- No breaking changes introduced
- Existing 8-bit image processing remains unchanged
- New 16-bit support is automatically applied to 16-bit input images
- Caching is transparent to users

---

## ⚠️ Known Issues

None reported for this release.

---

## 📅 Future Plans

- Additional caching strategies for image thumbnails
- Enhanced installation customization options
- Further performance optimizations for large image sets

---

## 👥 Contributors

- Core development team
- Community feedback and testing

---

**Thank you for using OpenLucky!**
