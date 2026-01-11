import { AppError } from './AppError'
import type { ErrorCode } from './ErrorCodes'

export function assert(
  condition: unknown,
  code: ErrorCode,
  message: string,
  context?: Record<string, unknown>,
): asserts condition {
  if (!condition) {
    throw new AppError(code, message, context)
  }
}
