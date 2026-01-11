import type { HexDirection } from './map_hex'

export type TerrainType = 'PLAIN' | 'FOREST' | 'MOUNTAIN' | 'WATER' | 'CAVE' | 'URBAN'

export type ResourceType = 'IRON_ORE' | 'GOLD_ORE' | 'HERBS' | 'MONSTER_NEST'

export type BuildingType = 'VILLAGE' | 'TOWN' | 'CITY' | 'HOUSE' | 'BLACKSMITH' | 'INN'

export interface HexTile {
  id: string
  q: number // axial coord
  r: number

  terrain: TerrainType
  resource?: ResourceType
  building?: BuildingType

  roads?: HexDirection[] // 道路连接方向
}
