const { ipcMain } = require('electron')

function register(win) {
  let allowClose = false

  const onConfirmCloseResponse = (_, allow) => {
    if (allow) {
      allowClose = true
      if (!win.isDestroyed()) {
        win.close()
      }
    }
  }

  win.on('close', (e) => {
    if (allowClose) return
    e.preventDefault()
    if (!win.isDestroyed()) {
      win.webContents.send('confirm-close')
    }
  })

  ipcMain.on('confirm-close-response', onConfirmCloseResponse)

  win.on('closed', () => {
    ipcMain.removeListener('confirm-close-response', onConfirmCloseResponse)
  })
}

module.exports = { register }
