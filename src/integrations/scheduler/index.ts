import type { CronConfig, ScheduledTask, SyncConfig } from "../types"
import type { SyncEngine } from "../sync/engine"

export interface IScheduler {
  register(task: ScheduledTask): void
  unregister(id: string): void
  start(): void
  stop(): void
  getTask(id: string): ScheduledTask | undefined
  getAllTasks(): ScheduledTask[]
}

export class SchedulerEngine implements IScheduler {
  private tasks: Map<string, ScheduledTask> = new Map()
  private intervals: Map<string, NodeJS.Timeout> = new Map()
  private syncEngine: SyncEngine
  private running = false

  constructor(syncEngine: SyncEngine) {
    this.syncEngine = syncEngine
  }

  register(task: ScheduledTask): void {
    this.tasks.set(task.id, task)
    if (this.running && task.enabled) {
      this.scheduleTask(task)
    }
  }

  unregister(id: string): void {
    this.tasks.delete(id)
    const interval = this.intervals.get(id)
    if (interval) {
      clearInterval(interval)
      this.intervals.delete(id)
    }
  }

  start(): void {
    if (this.running) return
    this.running = true

    for (const [, task] of this.tasks) {
      if (task.enabled) {
        this.scheduleTask(task)
      }
    }
  }

  stop(): void {
    this.running = false
    for (const [, interval] of this.intervals) {
      clearInterval(interval)
    }
    this.intervals.clear()
  }

  getTask(id: string): ScheduledTask | undefined {
    return this.tasks.get(id)
  }

  getAllTasks(): ScheduledTask[] {
    return Array.from(this.tasks.values())
  }

  addSyncTask(
    id: string,
    name: string,
    providerId: string | undefined,
    cron: CronConfig,
    syncConfig?: Partial<SyncConfig>,
  ): void {
    const task: ScheduledTask = {
      id,
      name,
      cron,
      providerId,
      enabled: true,
      lastRun: null,
      nextRun: null,
    }

    this.register(task)
  }

  private scheduleTask(task: ScheduledTask): void {
    const intervalMs = this.cronToMs(task.cron.expression)
    const interval = setInterval(async () => {
      try {
        if (task.providerId) {
          await this.syncEngine.syncProvider(task.providerId)
        } else {
          await this.syncEngine.syncAll()
        }
        task.lastRun = new Date()
      } catch {
        task.lastRun = new Date()
      }
    }, intervalMs)

    this.intervals.set(task.id, interval)
  }

  private cronToMs(expression: string): number {
    const parts = expression.trim().split(/\s+/)
    if (parts.length === 5) {
      const minute = parts[0]
      const hour = parts[1]

      if (minute === "0" && hour === "*") return 3600000
      if (minute === "0" && hour === "*/2") return 7200000
      if (minute === "0" && hour === "*/6") return 21600000
      if (minute === "0" && hour === "0") return 86400000
      if (minute === "*/5") return 300000
      if (minute === "*/15") return 900000
      if (minute === "*/30") return 1800000
    }

    if (expression === "0 0 * * *") return 86400000
    if (expression === "0 */6 * * *") return 21600000
    if (expression === "*/5 * * * *") return 300000

    return 3600000
  }
}
