import { AppError } from './AppError'
import type { ErrorCode } from './ErrorCodes'

/**
 * 运行期断言工具（Runtime Assertion）
 *
 * 作用：
 * 1. 在运行期验证某个关键条件是否成立
 * 2. 若条件不成立，抛出带错误码和上下文的 AppError
 * 3. 在 TypeScript 编译期收窄类型（通过 `asserts condition`）
 *
 * 使用场景：
 * - 地图 / 世界生成前置条件校验
 * - RNG、寻路、邻居获取等底层工具
 * - AI / Simulation 中「不可恢复的逻辑错误」
 *
 * 不适合的场景：
 * - 用户输入校验
 * - UI 表单错误提示
 * - 可以被业务逻辑正常处理的分支
 *
 * 注意：
 * - assert 失败 = 程序逻辑错误（应尽早暴露）
 * - 不应被 try/catch 吞掉后继续执行
 */
export function assert(
  /**
   * 需要被验证的条件。
   * 若为 falsy（false / 0 / null / undefined），将抛出 AppError。
   */
  condition: unknown,

  /**
   * 错误码，用于程序化区分错误类型（如 RNG_EMPTY_ARRAY）。
   * 必须来自 ErrorCodes，禁止使用任意字符串。
   */
  code: ErrorCode,

  /**
   * 面向开发者的错误描述信息。
   * 应描述「发生了什么」，而不是「怎么修」。
   */
  message: string,

  /**
   * 可选的错误上下文信息，用于定位问题。
   * 推荐包含：
   * - seed / mapId / tileId
   * - actorId / tick
   * - system（如 'MapEngine' / 'AI'）
   */
  context?: Record<string, unknown>,
): asserts condition {
  // 如果断言条件不成立，说明程序进入了非法状态
  if (!condition) {
    // 抛出结构化错误，统一由上层捕获并记录
    throw new AppError(code, message, context)
  }
}
