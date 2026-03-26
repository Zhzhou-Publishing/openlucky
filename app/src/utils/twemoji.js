import twemoji from '@twemoji/api'

// Twemoji 配置 - 使用本地资源
const twemojiConfig = {
  base: './',
  folder: 'build-resources/emoji',
  ext: '.svg',
  className: 'twemoji',
  attributes: () => ({
    crossorigin: 'anonymous'
  })
}

// 解析单个元素
export const parseElement = (element) => {
  if (!element) return
  twemoji.parse(element, twemojiConfig)
}

// 解析整个文档
export const parseDocument = () => {
  twemoji.parse(document.body, twemojiConfig)
}

// 创建一个可重用的函数来处理动态内容
export const parseTwemoji = (container = document.body) => {
  if (typeof container === 'string') {
    container = document.querySelector(container)
  }
  if (container) {
    twemoji.parse(container, twemojiConfig)
  }
}

export default { parseElement, parseDocument, parseTwemoji }
