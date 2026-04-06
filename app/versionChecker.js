const https = require('https')
const path = require('path')
const fs = require('fs')
const { app } = require('electron')

const GITHUB_API_URL = 'https://api.github.com/repos/Zhzhou-Publishing/openlucky/releases/latest'
const STORAGE_FILE_NAME = 'lastUpdateCheck.txt'

// 读取当前版本号
function getCurrentVersion() {
  try {
    // 使用 Electron 的 app.getVersion() 方法，它会从应用程序的元数据中读取版本号
    // 这个方法在开发环境和打包环境中都能正常工作
    return app.getVersion()
  } catch (error) {
    console.error('[UpdateChecker] Error reading version:', error)
    return 'unknown'
  }
}

/**
 * Get the path to the storage file
 */
function getStorageFilePath() {
  try {
    const userDataPath = app.getPath('userData')
    const storageFilePath = path.join(userDataPath, STORAGE_FILE_NAME)
    console.log(`[UpdateChecker] saved ${storageFilePath}`)
    return storageFilePath
  } catch (error) {
    console.error('Error getting user data path:', error)
    // Fallback to current working directory
    return path.join(process.cwd(), STORAGE_FILE_NAME)
  }
}

/**
 * Get the last check timestamp from file
 */
function getLastCheckTime() {
  try {
    const filePath = getStorageFilePath()
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8')
      return parseInt(data.trim(), 10) || 0
    }
    return 0
  } catch (e) {
    console.error('Error reading last check time:', e)
    return 0
  }
}

/**
 * Save the check timestamp to file
 */
function saveCheckTime() {
  try {
    const filePath = getStorageFilePath()
    const userDataDir = app.getPath('userData')

    // Ensure userData directory exists
    if (!fs.existsSync(userDataDir)) {
      fs.mkdirSync(userDataDir, { recursive: true })
    }

    fs.writeFileSync(filePath, Date.now().toString(), 'utf-8')
  } catch (e) {
    console.error('Failed to save check time:', e)
  }
}

/**
 * Check if we should check for updates based on hour interval
 * Returns true if we should check (either first time or new hour interval)
 */
function shouldCheckForUpdates() {
  const lastCheck = getLastCheckTime()
  if (lastCheck === 0) {
    return true // Never checked before
  }

  const now = Date.now()
  const lastCheckHour = Math.floor(lastCheck / (60 * 60 * 1000))
  const currentHour = Math.floor(now / (60 * 60 * 1000))

  // Check if we're in a new hour interval
  return currentHour > lastCheckHour
}

/**
 * Fetch latest release info from GitHub API
 */
function fetchLatestRelease() {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'openlucky-desktop-updater'
      },
      timeout: 10000 // 10 秒超时
    }

    const req = https.get(GITHUB_API_URL, options, (res) => {
      let data = ''

      // 检查 HTTP 状态码
      if (res.statusCode !== 200) {
        reject(new Error(`GitHub API returned status code: ${res.statusCode}`))
        return
      }

      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        try {
          const release = JSON.parse(data)
          resolve(release)
        } catch (e) {
          reject(new Error('Failed to parse GitHub API response'))
        }
      })
    })

    req.on('timeout', () => {
      req.destroy()
      reject(new Error('GitHub API request timed out'))
    })

    req.on('error', (err) => {
      console.error('[UpdateChecker] Network error:', err.message)
      reject(new Error(`Network error: ${err.message}`))
    })
  })
}

/**
 * Check for updates
 * Returns { hasUpdate: boolean, version: string, publishedAt: string, htmlUrl: string } or
 *         { skipped: true } or
 *         null (on error)
 */
async function checkForUpdates() {
  try {
    if (!shouldCheckForUpdates()) {
      console.log('[UpdateChecker] Already checked this hour, skipping')
      return { skipped: true }
    }

    console.log('[UpdateChecker] Checking for updates...')
    const release = await fetchLatestRelease()

    if (!release || !release.name) {
      console.error('[UpdateChecker] Invalid release data')
      return null
    }

    // Get current version from package.json
    const currentVersion = getCurrentVersion()

    console.log('[UpdateChecker] Current version:', currentVersion)
    console.log('[UpdateChecker] Latest version:', release.name)

    // Save check time after successful API call
    saveCheckTime()

    // Compare versions
    if (release.name !== currentVersion) {
      return {
        hasUpdate: true,
        version: release.name,
        publishedAt: release.published_at,
        htmlUrl: release.html_url
      }
    }

    console.log('[UpdateChecker] Already on latest version')
    return { hasUpdate: false }
  } catch (error) {
    console.error('[UpdateChecker] Error checking for updates:', error)
    return null
  }
}

module.exports = {
  checkForUpdates,
  shouldCheckForUpdates,
  getLastCheckTime
}
