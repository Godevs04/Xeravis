type LogLevel = 'debug' | 'info' | 'success' | 'warn' | 'error'

type LoggerOptions = {
  scope?: string
}

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  success: 25,
  warn: 30,
  error: 40,
}

const LEVEL_COLOR: Record<LogLevel, string> = {
  debug: '\x1b[90m',
  info: '\x1b[36m',
  success: '\x1b[32m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
}

const LEVEL_LABEL: Record<LogLevel, string> = {
  debug: 'DEBUG',
  info: 'INFO ',
  success: 'OK   ',
  warn: 'WARN ',
  error: 'ERROR',
}

const RESET = '\x1b[0m'
const DIM = '\x1b[2m'
const BOLD = '\x1b[1m'
const MAGENTA = '\x1b[35m'

function resolveMinLevel(): LogLevel {
  const raw = (typeof process !== 'undefined' ? process.env.LOG_LEVEL || '' : '').toLowerCase()
  if (raw === 'debug' || raw === 'info' || raw === 'success' || raw === 'warn' || raw === 'error') {
    return raw
  }
  const nodeEnv = typeof process !== 'undefined' ? process.env.NODE_ENV : 'development'
  return nodeEnv === 'production' ? 'info' : 'debug'
}

function isServer(): boolean {
  return typeof window === 'undefined'
}

function supportsColor(): boolean {
  if (!isServer()) return false
  if (process.env.NO_COLOR) return false
  if (process.env.FORCE_COLOR) return true
  return Boolean(process.stdout?.isTTY)
}

function stamp(): string {
  return new Date().toISOString().replace('T', ' ').replace('Z', '')
}

function stringifyArg(arg: unknown): string {
  if (typeof arg === 'string') return arg
  if (arg instanceof Error) return arg.stack || arg.message
  if (typeof arg === 'number' || typeof arg === 'boolean' || arg == null) return String(arg)

  try {
    return JSON.stringify(arg, null, 2)
  } catch {
    return String(arg)
  }
}

function write(level: LogLevel, scope: string | undefined, args: unknown[]) {
  const min = resolveMinLevel()
  if (LEVEL_ORDER[level] < LEVEL_ORDER[min]) return

  const color = supportsColor()
  const scopePart = scope ? `[${scope}]` : ''
  const body = args.map((arg) => stringifyArg(arg)).join(' ')

  if (!isServer()) {
    const prefix = `[xelarvis] ${LEVEL_LABEL[level].trim()}${scopePart ? ` ${scopePart}` : ''}`
    const style =
      level === 'error'
        ? 'color:#ef4444;font-weight:700'
        : level === 'warn'
          ? 'color:#f59e0b;font-weight:700'
          : level === 'success'
            ? 'color:#16a34a;font-weight:700'
            : level === 'debug'
              ? 'color:#9ca3af'
              : 'color:#0891b2;font-weight:700'
    globalThis.console.log(`%c${prefix}`, style, ...args)
    return
  }

  const label = color
    ? `${DIM}${stamp()}${RESET} ${LEVEL_COLOR[level]}${BOLD}${LEVEL_LABEL[level]}${RESET}${
        scope ? ` ${MAGENTA}${scopePart}${RESET}` : ''
      }`
    : `${stamp()} ${LEVEL_LABEL[level]}${scopePart ? ` ${scopePart}` : ''}`

  const line = `${label} ${body}\n`
  const stream = level === 'error' || level === 'warn' ? process.stderr : process.stdout
  stream.write(line)
}

function createLogger(options: LoggerOptions = {}) {
  const { scope } = options

  return {
    debug: (...args: unknown[]) => write('debug', scope, args),
    info: (...args: unknown[]) => write('info', scope, args),
    success: (...args: unknown[]) => write('success', scope, args),
    warn: (...args: unknown[]) => write('warn', scope, args),
    error: (...args: unknown[]) => write('error', scope, args),
    child: (childScope: string) =>
      createLogger({ scope: scope ? `${scope}:${childScope}` : childScope }),
  }
}

export const logger = createLogger({ scope: 'app' })
export type Logger = ReturnType<typeof createLogger>
export { createLogger }
