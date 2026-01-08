<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'

const router = useRouter()
const settings = useSettingsStore()

const handleNewGame = () => {
  console.log('Starting New Game...')
  // In Phase 2, this will route to GameView
  // router.push('/game');
}

const handleLoadGame = () => {
  console.log('Loading Game...')
}

const handleSettings = () => {
  console.log('Opening Settings...')
}
</script>

<template>
  <div class="home-container">
    <div class="background-overlay"></div>

    <div class="content">
      <h1 class="title">AI WORLD</h1>
      <p class="subtitle">Neural Simulation Sandbox</p>

      <div class="menu">
        <button class="menu-btn primary" @click="handleNewGame">
          <span class="icon">►</span> New World
        </button>
        <button class="menu-btn" @click="handleLoadGame">
          <span class="icon">📂</span> Continue
        </button>
        <button class="menu-btn" @click="handleSettings">
          <span class="icon">⚙</span> Settings
        </button>
      </div>

      <div class="footer">
        <span>v0.1.0 Pre-Alpha</span>
        <span class="divider">|</span>
        <span>Phase 1: Environment</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at center, #1f242d 0%, #0d1117 100%);
  color: white;
  overflow: hidden;
}

/* Dynamic background effect */
.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.03), transparent 60%);
  animation: pulse 10s infinite alternate;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  100% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

.content {
  position: relative;
  z-index: 10;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  backdrop-filter: blur(5px);
  padding: 4rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  background: rgba(13, 17, 23, 0.6);
}

.title {
  font-size: 4rem;
  font-weight: 800;
  letter-spacing: 0.5rem;
  margin: 0;
  background: linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 4px 20px rgba(255, 255, 255, 0.1);
}

.subtitle {
  font-size: 1.2rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.2rem;
  margin-top: -1.5rem;
  margin-bottom: 2rem;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  min-width: 240px;
}

.menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem 2rem;
  color: #cbd5e1;
  font-size: 1.1rem;
  font-weight: 500;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 4px;
}

.menu-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  color: #fff;
}

.menu-btn.primary {
  background: linear-gradient(90deg, #0ea5e9, #0284c7);
  border: none;
  color: white;
}

.menu-btn.primary:hover {
  background: linear-gradient(90deg, #38bdf8, #0ea5e9);
  box-shadow: 0 0 20px rgba(14, 165, 233, 0.4);
}

.footer {
  margin-top: 3rem;
  font-size: 0.8rem;
  color: #475569;
  display: flex;
  gap: 10px;
}

.divider {
  color: #334155;
}
</style>
