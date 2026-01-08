import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  const theme = ref<'light' | 'dark'>('dark')
  const nsfwEnabled = ref(false)
  const locale = ref('zh-CN')

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  return {
    theme,
    nsfwEnabled,
    locale,
    toggleTheme,
  }
})
