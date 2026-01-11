<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import { Play, FolderOpen, Settings, Globe } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import SettingsModal from '@/components/SettingsModal.vue'

const router = useRouter()
const settings = useSettingsStore()
const { t, locale } = useI18n()

const showSettingsManager = ref(false)

const handleNewGame = () => {
  console.log('Starting New Game...')
  router.push({ name: 'world-map' })
}
const handleLoadGame = () => {
  console.log('Loading Game...')
}
const handleSettings = () => {
  showSettingsManager.value = true
}

// Language Toggle
const toggleLang = () => {
  const next = locale.value === 'en' ? 'zh' : 'en'
  locale.value = next
  localStorage.setItem('user-locale', next)
}
</script>

<template>
  <div
    class="home-container"
    :style="{
      backgroundImage: settings.state.backgroundImage
        ? `url(${settings.state.backgroundImage})`
        : 'none',
      backgroundColor: !settings.state.backgroundImage
        ? settings.state.colors.bgPrimary
        : 'transparent',
    }"
  >
    <div class="background-overlay" v-if="settings.state.backgroundImage"></div>

    <!-- Top Right Language Switcher -->
    <button class="lang-switch-fixed" @click="toggleLang" :title="t('settings.language')">
      <Globe :size="20" />
      <span>{{ locale.toUpperCase() }}</span>
    </button>

    <div class="content glass-panel" v-if="!showSettingsManager">
      <!-- ARTISTIC TITLE SECTION -->
      <div class="title-section">
        <h1
          class="title"
          :style="{
            fontFamily: settings.state.titleFontFamily,
          }"
        >
          {{ t('home.title') }}
        </h1>
        <p class="subtitle" :style="{ fontFamily: settings.state.bodyFontFamily }">
          {{ t('home.subtitle') }}
        </p>
        <div
          class="title-decoration"
          :style="{ backgroundColor: settings.state.colors.primary }"
        ></div>
      </div>

      <div class="menu">
        <button class="menu-btn primary" @click="handleNewGame">
          <Play class="icon" :size="20" />
          <span class="btn-text" :style="{ fontFamily: settings.state.bodyFontFamily }">{{
            t('home.new_world')
          }}</span>
        </button>

        <button class="menu-btn" @click="handleLoadGame">
          <FolderOpen class="icon" :size="20" />
          <span class="btn-text" :style="{ fontFamily: settings.state.bodyFontFamily }">{{
            t('home.continue')
          }}</span>
        </button>

        <button class="menu-btn" @click="handleSettings">
          <Settings class="icon" :size="20" />
          <span class="btn-text" :style="{ fontFamily: settings.state.bodyFontFamily }">{{
            t('home.settings')
          }}</span>
        </button>
      </div>

      <div class="footer" :style="{ fontFamily: settings.state.bodyFontFamily }">
        <span class="version">{{ t('home.version') }}</span>
        <span class="status-dot"></span>
        <span class="phase">{{ t('home.phase') }}</span>
      </div>
    </div>

    <!-- Settings Modal Component -->
    <SettingsModal :isOpen="showSettingsManager" @close="showSettingsManager = false" />
  </div>
</template>

<style scoped>
.home-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: var(--text-primary);
  position: relative;
  overflow: hidden;
}
.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.lang-switch-fixed {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 50;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  padding: 8px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.8rem;
  backdrop-filter: blur(4px);
  transition: all 0.2s;
}
.lang-switch-fixed:hover {
  background: var(--primary-color);
  color: var(--bg-primary);
  border-color: var(--primary-color);
}

.content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  width: 420px;
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
  padding: 3.5rem;
  border-radius: 8px;
  transition: all 0.3s;
}

/* Artistic Text Enhancements */
.title {
  font-size: 4rem;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -1px;
  margin: 0;
  background: linear-gradient(135deg, var(--text-primary) 30%, var(--text-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.subtitle {
  font-size: 0.85rem;
  color: var(--text-secondary);
  letter-spacing: 4px;
  margin-top: 10px;
  font-weight: 600;
  text-transform: uppercase;
}

.title-decoration {
  width: 40px;
  height: 4px;
  margin-top: 1.5rem;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.menu-btn {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1.5rem;
  padding: 1.2rem 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-secondary);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 4px;
}

.menu-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-left: 4px solid var(--primary-color);
  padding-left: calc(1.5rem - 4px);
  color: var(--text-primary);
  transform: translateX(5px);
}

.menu-btn.primary {
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  background: rgba(var(--primary-color), 0.1);
}
.menu-btn.primary:hover {
  background: var(--primary-color);
  color: var(--bg-primary);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
}

.footer {
  margin-top: auto;
  font-size: 0.75rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  justify-content: center;
  opacity: 0.7;
}
.status-dot {
  width: 6px;
  height: 6px;
  background-color: #22c55e;
  border-radius: 50%;
  box-shadow: 0 0 5px #22c55e;
}
</style>
