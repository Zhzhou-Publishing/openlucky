const { ipcMain, nativeTheme } = require('electron')

function register() {
  ipcMain.on('set-theme', (_, themeName) => {
    nativeTheme.themeSource = themeName === 'dark' ? 'dark' : 'light'
  })
}

module.exports = { register }
