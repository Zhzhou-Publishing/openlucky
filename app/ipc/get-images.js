const { ipcMain } = require('electron')
const fs = require('fs')
const path = require('path')
const tmp = require('tmp')
const {
  IMAGE_EXTENSIONS,
  RAW_EXTENSIONS,
  checkExtension,
  readPresetJson,
  buildThumbnailEntry
} = require('../shared/utils')

function register(win) {
  ipcMain.on('get-images', async (_, directoryPath) => {
    try {
      const files = fs.readdirSync(directoryPath)

      const allImageFiles = files.filter(file => {
        const ext = file.toLowerCase().slice(file.lastIndexOf('.'))
        return (checkExtension(IMAGE_EXTENSIONS, ext) || checkExtension(RAW_EXTENSIONS, ext))
          && fs.statSync(path.join(directoryPath, file)).isFile()
      })

      const tempDirObj = tmp.dirSync({ prefix: 'photo-gallery-thumbnails_', unsafeCleanup: true })
      const tempDir = tempDirObj.name

      const presets = readPresetJson(directoryPath)
      const timestamp = Date.now()

      const images = await Promise.all(
        allImageFiles.map(file => buildThumbnailEntry(directoryPath, file, presets, tempDir, timestamp))
      )

      win.webContents.send('images-loaded', { images })
    } catch (error) {
      console.error('Error loading images:', error)
      win.webContents.send('images-error', error.message)
    }
  })
}

module.exports = { register }
