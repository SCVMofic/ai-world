import * as PIXI from 'pixi.js'
import type { HexTile } from '@/types/schemas/map.schema'

const HEX_SIZE = 32

/**
 * 针对 Flat-Topped (平边向上) 的轴向坐标转像素坐标
 */
function axialToPixel(q: number, r: number) {
  const x = HEX_SIZE * 1.5 * q
  const y = HEX_SIZE * Math.sqrt(3) * (r + q / 2)
  return { x, y }
}

export function renderHexTile(tile: HexTile): PIXI.Container {
  const container = new PIXI.Container()
  const { x, y } = axialToPixel(tile.q, tile.r)
  container.position.set(x, y)

  // --- PIXI 8 图形绘制逻辑 ---

  // 外框
  const outer = new PIXI.Graphics()
  // v8 使用 poly 或 moveTo/lineTo 后接 stroke()
  drawHexPath(outer, HEX_SIZE)
  outer.stroke({ width: 3, color: 0x000000 })
  container.addChild(outer)

  // 内框
  const inner = new PIXI.Graphics()
  drawHexPath(inner, HEX_SIZE - 3)
  inner.stroke({ width: 2, color: 0xffffff })
  container.addChild(inner)

  // 中心文字 (PIXI 8 的 Text 样式定义基本保持一致，但内部渲染有优化)
  const label = new PIXI.Text({
    text: getTerrainChar(tile.terrain),
    style: {
      fontSize: 18,
      fill: getTerrainColor(tile.terrain),
      align: 'center',
    },
  })
  label.anchor.set(0.5)
  container.addChild(label)

  return container
}

/**
 * 确保路径闭合，避免边缘缝隙
 */
function drawHexPath(g: PIXI.Graphics, size: number) {
  // 第一个点在右侧顶点
  g.moveTo(size, 0)
  for (let i = 1; i <= 6; i++) {
    const angle = (Math.PI / 3) * i
    g.lineTo(size * Math.cos(angle), size * Math.sin(angle))
  }
  g.closePath() // 必须闭合，否则 stroke 边缘会断开
}

function getTerrainChar(t: string) {
  return (
    {
      FOREST: '森',
      MOUNTAIN: '山',
      WATER: '水',
      PLAIN: '平',
      CAVE: '洞',
    }[t] ?? '?'
  )
}

function getTerrainColor(t: string) {
  return (
    {
      FOREST: 0x2ecc71,
      MOUNTAIN: 0x7f8c8d,
      WATER: 0x3498db,
      PLAIN: 0xf1c40f,
      CAVE: 0x9b59b6,
    }[t] ?? 0xffffff
  )
}
