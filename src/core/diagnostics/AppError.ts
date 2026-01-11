export interface ErrorContext {
  seed?: string
  mapId?: string
  tileId?: string
  actorId?: string
  tick?: number
  extra?: unknown
}

export class AppError extends Error {
  code: string
  context?: ErrorContext

  constructor(code: string, message: string, context?: ErrorContext) {
    super(message)
    this.code = code
    this.context = context
  }
}
