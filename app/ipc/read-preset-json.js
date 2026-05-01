const { ipcMain } = require('electron')
const { readPresetJson } = require('../shared/utils')

function register() {
  ipcMain.on('read-preset-json', async (event, directoryPath) => {
    try {
      event.sender.send('preset-json-loaded', { presets: readPresetJson(directoryPath) })
    } catch (error) {
      console.error('Error reading preset json:', error)
      event.sender.send('preset-json-error', { error: error.message })
    }
  })
}

module.exports = { register }
