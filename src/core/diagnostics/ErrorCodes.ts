export const ErrorCodes = {
  RNG_EMPTY_ARRAY: 'RNG_EMPTY_ARRAY',
  MAP_INVALID_TITLE: 'MAP_INVALID_TITLE',
  MAP_INVALID_TERRAIN: 'MAP_INVALID_TERRAIN',
  HEX_INVALID_NEIGHBOR: 'HEX_INVALID_NEIGHBOR',
} as const

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes]
