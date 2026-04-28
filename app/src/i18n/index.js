import { createI18n } from 'vue-i18n'
import zh_Hans from '../locales/zh_Hans'
import zh_Hant from '../locales/zh_Hant'
import en_US from '../locales/en_US'
import fr_FR from '../locales/fr_FR'
import ru_RU from '../locales/ru_RU'
import es_ES from '../locales/es_ES'
import pt_PT from '../locales/pt_PT'
import ja_JP from '../locales/ja_JP'

const SUPPORTED = ['zh_Hans', 'zh_Hant', 'en_US', 'fr_FR', 'ru_RU', 'es_ES', 'pt_PT', 'ja_JP']

function detectInitialLocale() {
  const stored = localStorage.getItem('locale')
  if (stored && SUPPORTED.includes(stored)) return stored

  const candidates = navigator.languages?.length
    ? navigator.languages
    : [navigator.language || '']

  for (const tag of candidates) {
    const lower = String(tag).toLowerCase()
    if (lower.startsWith('zh')) {
      if (
        lower.includes('hant') ||
        lower.startsWith('zh-tw') ||
        lower.startsWith('zh-hk') ||
        lower.startsWith('zh-mo')
      ) {
        return 'zh_Hant'
      }
      return 'zh_Hans'
    }
    if (lower.startsWith('en')) return 'en_US'
    if (lower.startsWith('fr')) return 'fr_FR'
    if (lower.startsWith('ru')) return 'ru_RU'
    if (lower.startsWith('es')) return 'es_ES'
    if (lower.startsWith('pt')) return 'pt_PT'
    if (lower.startsWith('ja')) return 'ja_JP'
  }

  return 'en_US'
}

const i18n = createI18n({
  legacy: false,
  locale: detectInitialLocale(),
  fallbackLocale: 'en_US',
  messages: {
    zh_Hans,
    zh_Hant,
    en_US,
    fr_FR,
    ru_RU,
    es_ES,
    pt_PT,
    ja_JP
  }
})

export default i18n
