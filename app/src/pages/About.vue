<template>
  <div class="about-page">
    <h1>{{ $t('about.title') }}</h1>
    <div class="content">
      <section class="info-section">
        <h2>{{ $t('about.version') }}</h2>
        <p>OpenLucky Desktop v{{ version }}</p>
      </section>

      <section class="info-section">
        <h2>{{ $t('about.description') }}</h2>
        <p>{{ $t('about.descriptionText') }}</p>
      </section>

      <section class="info-section">
        <h2>{{ $t('about.homepage') }}</h2>
        <p>
          <a class="repo-link" href="#" @click.prevent="openExternal(homepageUrl)">{{ homepageUrl }}</a>
        </p>
      </section>

      <section class="info-section">
        <h2>{{ $t('about.license') }}</h2>
        <p>
          <a class="repo-link" href="#" @click.prevent="openExternal(licenseUrl)">Apache License 2.0</a>
        </p>
        <p class="license-summary">{{ $t('about.licenseSummary') }}</p>
      </section>

      <section class="info-section">
        <h2>{{ $t('about.language') }}</h2>
        <LanguageSwitcher />
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LanguageSwitcher from '../components/LanguageSwitcher.vue'

const version = ref(__APP_VERSION__)
const homepageUrl = 'https://github.com/Zhzhou-Publishing/OpenLucky'
const licenseUrl = 'https://github.com/Zhzhou-Publishing/OpenLucky/blob/main/LICENSE'

function openExternal(url) {
  if (window.require) {
    window.require('electron').ipcRenderer.send('open-external', url)
  } else {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}
</script>

<style scoped>
.about-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  color: #42b883;
  margin-bottom: 30px;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.info-section h2 {
  font-size: 18px;
  color: #35495e;
  margin-bottom: 10px;
}

.info-section p {
  line-height: 1.6;
  color: #666;
}

.repo-link {
  color: #42b883;
  text-decoration: none;
  word-break: break-all;
}

.repo-link:hover {
  text-decoration: underline;
}

.license-summary {
  margin-top: 6px;
  font-size: 13px;
  color: #888;
}
</style>
