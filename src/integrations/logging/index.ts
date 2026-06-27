import { randomUUID } from "crypto"
import type { LogCategory, LogEntry, LogLevel } from "../types"

export interface ILogger {
  debug(message: string, category?: LogCategory, details?: Record<string, unknown>): void
  info(message: string, category?: LogCategory, details?: Record<string, unknown>): void
  warn(message: string, category?: LogCategory, details?: Record<string, unknown>): void
  error(message: string, category?: LogCategory, details?: Record<string, unknown>): void
  getLogs(filters?: Partial<LogEntry>): LogEntry[]
  clear(): void
}

export class IntegrationLogger implements ILogger {
  private logs: LogEntry[] = []
  private maxEntries: number
  private consoleOutput: boolean

  constructor(maxEntries = 10000, consoleOutput = true) {
    this.maxEntries = maxEntries
    this.consoleOutput = consoleOutput
  }

  debug(message: string, category: LogCategory = "provider", details?: Record<string, unknown>): void {
    this.log("debug", message, category, details)
  }

  info(message: string, category: LogCategory = "provider", details?: Record<string, unknown>): void {
    this.log("info", message, category, details)
  }

  warn(message: string, category: LogCategory = "provider", details?: Record<string, unknown>): void {
    this.log("warn", message, category, details)
  }

  error(message: string, category: LogCategory = "error", details?: Record<string, unknown>): void {
    this.log("error", message, category, details)
  }

  getLogs(filters?: Partial<LogEntry>): LogEntry[] {
    if (!filters) return [...this.logs]

    return this.logs.filter((entry) => {
      for (const [key, value] of Object.entries(filters)) {
        if (entry[key as keyof LogEntry] !== value) return false
      }
      return true
    })
  }

  clear(): void {
    this.logs = []
  }

  private log(level: LogLevel, message: string, category: LogCategory, details?: Record<string, unknown>): void {
    const entry: LogEntry = {
      id: randomUUID(),
      timestamp: new Date(),
      level,
      category,
      message,
      details,
    }

    this.logs.push(entry)

    if (this.logs.length > this.maxEntries) {
      this.logs.shift()
    }

    if (this.consoleOutput) {
      const prefix = `[${level.toUpperCase()}] [${category}]`
      switch (level) {
        case "error":
          console.error(prefix, message, details ?? "")
          break
        case "warn":
          console.warn(prefix, message, details ?? "")
          break
        default:
          console.log(prefix, message, details ?? "")
      }
    }
  }
}
