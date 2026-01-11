import { v4 as uuid } from 'uuid'
import { createRNG } from '@/utils/rng'
import type { HexTile, TerrainType, ResourceType, BuildingType } from '@/types/schemas/map.schema'
import { logger } from '@/core/diagnostics/logger'

const log = logger.withModule('MapEngine')

interface MapGenerateOptions {
  seed: string
  radius: number

  terrains: readonly TerrainType[]
  resources?: readonly ResourceType[]
  buildings?: readonly BuildingType[]
}

export class MapEngine {
  static generateHexMap(opts: MapGenerateOptions): HexTile[] {
    const rng = createRNG(opts.seed)
    const tiles: HexTile[] = []

    for (let q = -opts.radius; q <= opts.radius; q++) {
      for (let r = -opts.radius; r <= opts.radius; r++) {
        if (Math.abs(q + r) > opts.radius) continue

        const tile: HexTile = {
          id: uuid(),
          q,
          r,
          terrain: rng.pick(opts.terrains),
        }

        if (opts.resources && rng.float() < 0.15) {
          tile.resource = rng.pick(opts.resources)
        }

        if (opts.buildings && rng.float() < 0.05) {
          tile.building = rng.pick(opts.buildings)
        }
        log.debug('MapEngine.generateHexMap tile', tile)
        tiles.push(tile)
      }
    }

    return tiles
  }
}
