type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogPayload {
  message: string
  data?: unknown
  context?: Record<string, unknown>
  module?: string
}

class Logger {
  level: LogLevel = import.meta.env.DEV ? 'debug' : 'warn'

  private shouldLog(level: LogLevel) {
    const order: LogLevel[] = ['debug', 'info', 'warn', 'error']
    return order.indexOf(level) >= order.indexOf(this.level)
  }

  private write(level: LogLevel, payload: LogPayload) {
    if (!this.shouldLog(level)) return

    console[level]({
      time: new Date().toISOString(),
      level,
      module: payload.module ?? 'GLOBAL',
      message: payload.message,
      data: payload.data,
      context: payload.context,
    })
  }

  debug(message: string, data?: unknown, context?: Record<string, unknown>, module?: string) {
    this.write('debug', { message, data, context, module })
  }

  info(message: string, data?: unknown, context?: Record<string, unknown>, module?: string) {
    this.write('info', { message, data, context, module })
  }

  warn(message: string, data?: unknown, context?: Record<string, unknown>, module?: string) {
    this.write('warn', { message, data, context, module })
  }

  error(message: string, data?: unknown, context?: Record<string, unknown>, module?: string) {
    this.write('error', { message, data, context, module })
  }

  withModule(module: string) {
    return {
      debug: (message: string, data?: unknown, context?: Record<string, unknown>) =>
        this.debug(message, data, context, module),
      info: (message: string, data?: unknown, context?: Record<string, unknown>) =>
        this.info(message, data, context, module),
      warn: (message: string, data?: unknown, context?: Record<string, unknown>) =>
        this.warn(message, data, context, module),
      error: (message: string, data?: unknown, context?: Record<string, unknown>) =>
        this.error(message, data, context, module),
    }
  }
}

export const logger = new Logger()
