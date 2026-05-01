const { ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')
const sharp = require('sharp')
const tmp = require('tmp')
const {
  TIFF_EXTENSIONS,
  checkExtension,
  readPresetJson,
  resolveImagePath
} = require('../shared/utils')

function register() {
  ipcMain.on('get-full-res-image', async (event, { directoryPath, filename }) => {
    try {
      const ext = filename.toLowerCase().slice(filename.lastIndexOf('.'))

      const presets = readPresetJson(directoryPath)
      const fullPath = resolveImagePath(directoryPath, filename, presets)

      let imageUrl = `file://${fullPath}`

      if (checkExtension(TIFF_EXTENSIONS, ext)) {
        try {
          const tempDirObj = tmp.dirSync({ prefix: 'photo-gallery-full-res_', unsafeCleanup: true })
          const tempDir = tempDirObj.name

          const convertedPath = path.join(tempDir, `${path.basename(filename, ext)}.jpg`)
          const buffer = await sharp(fullPath).jpeg({ quality: 95 }).toBuffer()
          fs.writeFileSync(convertedPath, buffer)
          imageUrl = `file://${convertedPath}`
        } catch (err) {
          console.error('Error converting image for', filename, err)
        }
      }

      event.sender.send('full-res-image-loaded', { url: imageUrl })
    } catch (error) {
      console.error('Error getting full resolution image:', error)
      event.sender.send('full-res-image-error', { error: error.message })
    }
  })
}

module.exports = { register }
