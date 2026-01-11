type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogPayload {
  message: string
  data?: unknown
  context?: Record<string, unknown>
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
      ...payload,
    })
  }

  debug(message: string, data?: unknown, context?: Record<string, unknown>) {
    this.write('debug', { message, data, context })
  }

  info(message: string, data?: unknown, context?: Record<string, unknown>) {
    this.write('info', { message, data, context })
  }

  warn(message: string, data?: unknown, context?: Record<string, unknown>) {
    this.write('warn', { message, data, context })
  }

  error(message: string, data?: unknown, context?: Record<string, unknown>) {
    this.write('error', { message, data, context })
  }
}

export const logger = new Logger()
