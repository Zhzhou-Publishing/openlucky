const { ipcMain } = require('electron')
const { spawn } = require('child_process')
const { getOpenLuckyPath } = require('../shared/utils')

function register() {
  ipcMain.on('check-openlucky', async (event) => {
    try {
      const command = getOpenLuckyPath()
      const args = ['--help']
      console.log(`[openlucky] Executing: ${command} ${args.join(' ')}`)

      const child = spawn(command, args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        windowsHide: true
      })

      let errorOutput = ''

      child.stderr.on('data', (data) => {
        errorOutput += data.toString()
      })

      child.on('close', (code) => {
        const success = code === 0
        event.sender.send('openlucky-checked', { success, error: errorOutput })
      })

      child.on('error', (err) => {
        event.sender.send('openlucky-checked', { success: false, error: err.message })
      })
    } catch (error) {
      console.error('Error checking openlucky:', error)
      event.sender.send('openlucky-checked', { success: false, error: error.message })
    }
  })
}

module.exports = { register }
