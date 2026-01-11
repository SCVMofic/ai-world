import seedrandom from 'seedrandom' // 需要 npm install seedrandom @types/seedrandom
import { assert } from '@/core/diagnostics/assert'
import { ErrorCodes } from '@/core/diagnostics/ErrorCodes'
import type { ErrorContext } from '@/core/diagnostics/AppError'
export class SeededRNG {
  private rng: seedrandom.PRNG

  constructor(seed: string) {
    this.rng = seedrandom(seed)
  }

  // 返回 0 - 1
  next(): number {
    return this.rng()
  }

  // 返回数组中的随机一项
  pick<T>(items: readonly T[] | T[], context?: ErrorContext): T {
    assert(items.length > 0, ErrorCodes.RNG_EMPTY_ARRAY, 'rng.pick called with empty array', {
      context,
    })
    const index = Math.floor(this.rng() * items.length)
    return items[index]!
  }

  // 是否命中概率
  chance(probability: number): boolean {
    return this.rng() < probability
  }
}

export function createRNG(seed: string) {
  const rng = seedrandom(seed)

  return {
    float: () => rng(),
    int: (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min,
    pick<T>(arr: readonly T[]): T {
      assert(arr.length > 0, ErrorCodes.RNG_EMPTY_ARRAY, 'rng.pick called with empty array', {
        seed,
        system: 'RNG',
      })
      return arr[Math.floor(rng() * arr.length)]!
    },
  }
}
