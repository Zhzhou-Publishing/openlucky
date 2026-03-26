import { parseTwemoji } from '../utils/twemoji'

// Vue 指令：自动替换 emoji 为 Twemoji
export const twemojiDirective = {
  mounted(el) {
    parseTwemoji(el)
  },
  updated(el) {
    parseTwemoji(el)
  }
}

// 注册为全局指令的函数
export const setupTwemojiDirective = (app) => {
  app.directive('emoji', twemojiDirective)
}

export default twemojiDirective
