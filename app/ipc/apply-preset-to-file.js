const { ipcMain } = require('electron')
const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')
const {
  RAW_EXTENSIONS,
  TIFF_EXTENSIONS,
  checkExtension,
  getOpenLuckyPath
} = require('../shared/utils')

function register() {
  ipcMain.on('apply-preset-to-file', async (event, { presetFile, inputFilePath, outputFilePath }) => {
    try {
      if (!fs.existsSync(presetFile)) {
        event.sender.send('preset-to-file-error', { message: 'Preset file not found', error: `Preset file does not exist: ${presetFile}` })
        return
      }

      const presetContent = fs.readFileSync(presetFile, 'utf-8')
      const presetObj = JSON.parse(presetContent)

      const filename = path.basename(inputFilePath)
      const ext = path.extname(filename)
      const isRaw = checkExtension(RAW_EXTENSIONS, ext)

      let presetKey = null

      if (isRaw) {
        const possibleKeys = [
          filename,
          filename + '.tif',
          filename + '.tiff'
        ]

        for (const key of possibleKeys) {
          if (presetObj[key]) {
            presetKey = key
            break
          }
        }
      } else {
        if (presetObj[filename]) {
          presetKey = filename
        }
      }

      if (!presetKey) {
        event.sender.send('preset-to-file-error', { message: 'Preset not found for file', error: `No preset found for file: ${filename}` })
        return
      }

      const presetParams = presetObj[presetKey]
      const paramsString = `${presetParams.mask_r},${presetParams.mask_g},${presetParams.mask_b},${presetParams.gamma},${presetParams.contrast}`

      let finalOutputPath = outputFilePath
      if (isRaw && !checkExtension(TIFF_EXTENSIONS, path.extname(outputFilePath))) {
        finalOutputPath += '.tif'
      }

      const command = getOpenLuckyPath()
      const args = ['filmparam', '--input', inputFilePath, '--output', finalOutputPath, '--param', paramsString]
      console.log(`[openlucky] Executing: ${command} ${args.join(' ')}`)

      event.sender.send('preset-to-file-started', { message: 'Processing started' })

      const child = spawn(command, args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        windowsHide: true
      })

      let output = ''
      let errorOutput = ''

      child.stdout.on('data', (data) => {
        output += data.toString()
        event.sender.send('preset-to-file-progress', { data: data.toString() })
      })

      child.stderr.on('data', (data) => {
        errorOutput += data.toString()
      })

      child.on('close', (code) => {
        if (code === 0) {
          event.sender.send('preset-to-file-success', { message: 'Preset applied to file successfully' })
        } else {
          event.sender.send('preset-to-file-error', { message: `Process exited with code ${code}`, error: errorOutput })
        }
      })

      child.on('error', (err) => {
        event.sender.send('preset-to-file-error', { message: 'Failed to start process', error: err.message })
      })
    } catch (error) {
      console.error('Error applying preset to file:', error)
      event.sender.send('preset-to-file-error', { message: 'Error applying preset to file', error: error.message })
    }
  })
}

module.exports = { register }
