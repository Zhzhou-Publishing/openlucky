const { ipcMain, dialog } = require('electron')
const fs = require('fs')

function register(win) {
  ipcMain.on('select-directory', async () => {
    try {
      const result = await dialog.showOpenDialog(win, {
        properties: ['openDirectory']
      })

      if (result.canceled) {
        win.webContents.send('directory-cancelled')
        return
      }

      const selectedPath = result.filePaths[0]
      const files = fs.readdirSync(selectedPath)

      win.webContents.send('directory-selected', {
        path: selectedPath,
        files: files
      })
    } catch (error) {
      console.error('Error selecting directory:', error)
      win.webContents.send('directory-error', error.message)
    }
  })
}

module.exports = { register }
