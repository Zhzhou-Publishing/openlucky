let mainWindow = null

function getWin() {
  return mainWindow
}

function setWin(win) {
  mainWindow = win
}

module.exports = { getWin, setWin }
