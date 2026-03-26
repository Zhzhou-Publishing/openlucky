const fs = require('fs')
const path = require('path')

const SOURCE_DIR = path.join(__dirname, '../node_modules/@twemoji/svg')
const TARGET_DIR = path.join(__dirname, '../dist/build-resources/emoji')

// 创建目标目录
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true })
}

// 从本地 npm 包获取 emoji 列表
function getLocalEmojiList() {
  const svgPackagePath = path.join(__dirname, '../node_modules/@twemoji/svg')
  if (!fs.existsSync(svgPackagePath)) {
    console.error('❌ cannot find @twemoji/svg package, please install it first: npm install @twemoji/svg')
    process.exit(1)
  }

  const files = fs.readdirSync(svgPackagePath).filter(file => file.endsWith('.svg'))
  return files
}

// 拷贝文件
function copyFile(filename) {
  const srcPath = path.join(SOURCE_DIR, filename)
  const destPath = path.join(TARGET_DIR, filename)
  fs.copyFileSync(srcPath, destPath)
}

// 过滤掉旗帜符号（包含两个 emoji code 用 - 连接的）
function filterFlags(files) {
  return files.filter(file => !file.includes('-'))
}

// 主函数
async function main() {
  try {
    const allFiles = getLocalEmojiList()
    const filteredFiles = filterFlags(allFiles)
    for (const file of filteredFiles) {
      copyFile(file)
    }
    console.log(`✅ emoji copied!`)
  } catch (error) {
    console.error('❌ error:', error)
    process.exit(1)
  }
}

main()
