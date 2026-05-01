const { ipcMain, shell } = require('electron')

function register() {
  ipcMain.on('open-external', (_, url) => {
    if (typeof url === 'string' && /^https?:\/\//i.test(url)) {
      shell.openExternal(url)
    }
  })
}

module.exports = { register }
