import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWorldStore = defineStore('world', () => {
  const isInitialized = ref(false)

  // Phase 1: Just a placeholder
  const worldName = ref('Simulated World')

  function initializeWorld() {
    console.log('Initializing World...')
    isInitialized.value = true
  }

  return {
    isInitialized,
    worldName,
    initializeWorld,
  }
})
