import type { JobStatus, QueueConfig, QueueJob } from "../types"

export interface IQueue {
  readonly name: string
  readonly config: QueueConfig

  add<T>(type: string, data: T): Promise<QueueJob<T>>
  addBatch<T>(jobs: { type: string; data: T }[]): Promise<QueueJob<T>[]>
  getJob<T>(id: string): Promise<QueueJob<T> | null>
  getJobs<T>(status?: JobStatus): Promise<QueueJob<T>[]>
  removeJob(id: string): Promise<void>
  retryJob(id: string): Promise<void>
  clear(): Promise<void>
  getWaitingCount(): Promise<number>
  getFailedCount(): Promise<number>
}

export interface IQueueProcessor {
  process<T>(job: QueueJob<T>): Promise<void>
  onCompleted(job: QueueJob<unknown>): Promise<void>
  onFailed(job: QueueJob<unknown>, error: Error): Promise<void>
}

export interface IDeadLetterQueue {
  send<T>(job: QueueJob<T>): Promise<void>
  replay(id: string): Promise<void>
  replayAll(): Promise<void>
  purge(): Promise<void>
}

export class MemoryQueue implements IQueue {
  public readonly name: string
  public readonly config: QueueConfig
  private jobs: Map<string, QueueJob<unknown>> = new Map()
  private processors: IQueueProcessor[] = []

  constructor(name: string, config?: Partial<QueueConfig>) {
    this.name = name
    this.config = {
      name,
      concurrency: config?.concurrency ?? 5,
      maxRetries: config?.maxRetries ?? 3,
      deadLetterQueue: config?.deadLetterQueue ?? `dlq:${name}`,
    }
  }

  registerProcessor(processor: IQueueProcessor): void {
    this.processors.push(processor)
  }

  async add<T>(type: string, data: T): Promise<QueueJob<T>> {
    const job: QueueJob<T> = {
      id: crypto.randomUUID(),
      type,
      data,
      status: "waiting",
      attempts: 0,
      maxAttempts: this.config.maxRetries,
      createdAt: new Date(),
    }
    this.jobs.set(job.id, job as QueueJob<unknown>)
    return job
  }

  async addBatch<T>(jobs: { type: string; data: T }[]): Promise<QueueJob<T>[]> {
    return Promise.all(jobs.map((j) => this.add(j.type, j.data)))
  }

  async getJob<T>(id: string): Promise<QueueJob<T> | null> {
    const job = this.jobs.get(id)
    return (job as QueueJob<T>) ?? null
  }

  async getJobs<T>(status?: JobStatus): Promise<QueueJob<T>[]> {
    const all = Array.from(this.jobs.values())
    if (status) {
      return all.filter((j) => j.status === status) as QueueJob<T>[]
    }
    return all as QueueJob<T>[]
  }

  async removeJob(id: string): Promise<void> {
    this.jobs.delete(id)
  }

  async retryJob(id: string): Promise<void> {
    const job = this.jobs.get(id)
    if (job && job.status === "failed") {
      job.status = "waiting"
      job.attempts = 0
      job.error = undefined
    }
  }

  async clear(): Promise<void> {
    this.jobs.clear()
  }

  async getWaitingCount(): Promise<number> {
    return Array.from(this.jobs.values()).filter((j) => j.status === "waiting").length
  }

  async getFailedCount(): Promise<number> {
    return Array.from(this.jobs.values()).filter((j) => j.status === "failed").length
  }

  async processNext<T>(): Promise<void> {
    const waiting = Array.from(this.jobs.values()).filter((j) => j.status === "waiting")
    if (waiting.length === 0) return

    const job = waiting[0] as QueueJob<T>
    job.status = "active"
    job.processedAt = new Date()

    for (const processor of this.processors) {
      try {
        await processor.process(job)
        job.status = "completed"
        await processor.onCompleted(job as QueueJob<unknown>)
      } catch (err) {
        job.attempts++
        job.failedAt = new Date()
        job.error = err instanceof Error ? err.message : "Unknown error"

        if (job.attempts >= job.maxAttempts) {
          job.status = "failed"
          await processor.onFailed(job as QueueJob<unknown>, err instanceof Error ? err : new Error(String(err)))
        } else {
          job.status = "waiting"
        }
      }
    }
  }
}
