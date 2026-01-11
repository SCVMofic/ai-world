<template>
  <div class="world-map-view">
    <canvas ref="pixiCanvas" class="pixi-container"></canvas>

    <div class="controls">
      <button @click="regenerate">重新生成</button>
      <span>Seed: {{ seed }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as PIXI from 'pixi.js'

import { MapEngine } from '@/core/engine/MapEngine'
import type { HexTile } from '@/types/schemas/map_hex'
import { renderHexTile } from '@/components/map/HexGridRenderer'
import { logger } from '@/core/diagnostics/logger'
import { assert } from '@/core/diagnostics/assert'
import { ErrorCodes } from '@/core/diagnostics/ErrorCodes'

const log = logger.withModule('WorldMapView')

/* -------------------- 基础状态 -------------------- */

const pixiCanvas = ref<HTMLCanvasElement | null>(null)
const seed = ref(`world-${Date.now()}`)
const radius = 12

// 在 v8 中，我们主要操作 app.stage
let app: PIXI.Application | null = null
let mapLayer: PIXI.Container | null = null

/* -------------------- 初始化 Pixi -------------------- */
const isLoading = ref(true)

async function initPixi() {
  log.info('Initializing Pixi v8 renderer')

  if (!pixiCanvas.value) {
    log.error('Canvas element not found')
    return
  }

  try {
    // 1. 创建 Application 实例
    app = new PIXI.Application()

    // 2. 初始化应用
    await app.init({
      canvas: pixiCanvas.value,
      resizeTo: window,
      backgroundColor: 0x1e1e1e,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    })

    // 3. 设置图层
    mapLayer = new PIXI.Container()
    app.stage.addChild(mapLayer)

    log.info('Pixi v8 initialized')

    // 初始化完成后生成地图
    generateMap()
  } catch (err) {
    log.error('Error initializing Pixi v8', err)
  } finally {
    isLoading.value = false
  }
}

/* -------------------- 地图生成 & 渲染 -------------------- */

function generateMap() {
  if (!app || !mapLayer) {
    log.error('App or Map layer not ready')
    return
  }

  // 清理旧内容
  mapLayer.removeChildren()

  try {
    const tiles: HexTile[] = MapEngine.generateHexMap({
      seed: seed.value,
      radius,
      terrains: ['PLAIN', 'FOREST', 'MOUNTAIN', 'WATER'],
      resources: ['IRON_ORE', 'HERBS'],
      buildings: ['VILLAGE', 'TOWN'],
    })

    if (!tiles || tiles.length === 0) {
      log.warn('Generated map tiles are empty')
      return
    }

    log.debug('Rendering hex tiles', { count: tiles.length })

    tiles.forEach((tile) => {
      const hex = renderHexTile(tile)
      assert(hex, ErrorCodes.MAP_INVALID_TITLE, '地图渲染错误', { tile })

      // 在 v8 中，hex 应该是 PIXI.Graphics 或 Container
      mapLayer!.addChild(hex)
    })

    // 居中显示（可选，根据你的坐标系统调整）
    mapLayer.x = app.screen.width / 2
    mapLayer.y = app.screen.height / 2
  } catch (error) {
    log.error('Error generating map:', error)
  }
}

/* -------------------- 交互 -------------------- */

function regenerate() {
  seed.value = `world-${Date.now()}`
  generateMap()
}

/* -------------------- 生命周期 -------------------- */

onMounted(() => {
  initPixi()
})

onBeforeUnmount(() => {
  if (app) {
    // v8 的 destroy 会自动清理 renderer 和 stage
    app.destroy(true, { children: true, texture: true })
    app = null
  }
})
</script>

<style scoped>
.world-map-view {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #000;
}

.pixi-container {
  display: block; /* 消除 canvas 默认间隙 */
  width: 100%;
  height: 100%;
}

.controls {
  position: absolute;
  left: 12px;
  top: 12px;
  z-index: 10;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px 15px;
  border-radius: 8px;
  color: #fff;
  font-family: sans-serif;
}

button {
  cursor: pointer;
  padding: 4px 8px;
}
</style>
