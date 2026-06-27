const prefix = "[StudyReward]"

export const logger = {
  info: (message: string, ...args: unknown[]) => {
    console.log(`${prefix} [INFO] ${message}`, ...args)
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(`${prefix} [WARN] ${message}`, ...args)
  },
  error: (message: string, ...args: unknown[]) => {
    console.error(`${prefix} [ERROR] ${message}`, ...args)
  },
  debug: (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV !== "production") {
      console.debug(`${prefix} [DEBUG] ${message}`, ...args)
    }
  },
}
