import type { z } from "zod"

export type ProviderStatus = "disconnected" | "connecting" | "connected" | "error"

export type SyncStrategy = "full" | "incremental"

export type SyncStatus = "idle" | "running" | "completed" | "failed" | "cancelled"

export type JobStatus = "waiting" | "active" | "completed" | "failed" | "delayed"

export type LogLevel = "debug" | "info" | "warn" | "error"

export type LogCategory = "import" | "provider" | "sync" | "error" | "performance"

export type BackoffStrategy = "exponential" | "linear" | "fixed"

export type ImportStage = "fetch" | "validate" | "normalize" | "transform" | "save"

export interface ProviderConfig {
  id: string
  name: string
  version: string
  baseUrl?: string
  apiKey?: string
  timeout: number
  retry: RetryConfig
  enabled: boolean
  priority: number
}

export interface RetryConfig {
  maxRetries: number
  initialDelay: number
  backoff: BackoffStrategy
  maxDelay: number
}

export interface SyncConfig {
  strategy: SyncStrategy
  interval: number
  batchSize: number
}

export interface CacheConfig {
  ttl: number
  maxSize: number
}

export interface CacheEntry<T> {
  value: T
  expiresAt: number
}

export interface QueueConfig {
  name: string
  concurrency: number
  maxRetries: number
  deadLetterQueue: string
}

export interface QueueJob<T = unknown> {
  id: string
  type: string
  data: T
  status: JobStatus
  attempts: number
  maxAttempts: number
  createdAt: Date
  processedAt?: Date
  failedAt?: Date
  error?: string
}

export interface CronConfig {
  expression: string
  timezone: string
}

export interface ScheduledTask {
  id: string
  name: string
  cron: CronConfig
  providerId?: string
  enabled: boolean
  lastRun: Date | null
  nextRun: Date | null
}

export interface LogEntry {
  id: string
  timestamp: Date
  level: LogLevel
  category: LogCategory
  providerId?: string
  message: string
  details?: Record<string, unknown>
  duration?: number
}

export interface HealthStatus {
  healthy: boolean
  providerId?: string
  lastCheck: Date
  checks: HealthCheck[]
}

export interface HealthCheck {
  name: string
  status: "passed" | "failed" | "warning"
  message?: string
  duration: number
}

export interface ProviderMetadata {
  id: string
  name: string
  version: string
  status: ProviderStatus
  lastSync: Date | null
  nextSync: Date | null
  recordsImported: number
  recordsUpdated: number
  recordsFailed: number
}

export interface SyncResult {
  providerId: string
  strategy: SyncStrategy
  startedAt: Date
  completedAt: Date
  recordsFetched: number
  recordsImported: number
  recordsUpdated: number
  recordsFailed: number
  skipped: number
  errors: string[]
}

export interface ImportResult {
  providerId: string
  batchId: string
  totalFetched: number
  totalValidated: number
  totalNormalized: number
  totalTransformed: number
  totalSaved: number
  totalFailed: number
  errors: ImportError[]
  startedAt: Date
  completedAt: Date
}

export interface ImportError {
  index: number
  stage: ImportStage
  message: string
  code?: string
  raw?: unknown
}

export interface MetricsSnapshot {
  timestamp: Date
  providers: ProviderMetadata[]
  totalRecords: number
  successRate: number
  avgSyncDuration: number
}

export interface ProviderSettings {
  baseUrl?: string
  apiKey?: string
  timeout?: number
  retry?: Partial<RetryConfig>
  enabled: boolean
  priority: number
}

export interface BatchConfig {
  batchSize: number
  concurrency: number
}

export interface IConnectable {
  connect(): Promise<void>
  disconnect(): Promise<void>
}

export interface IHealthCheckable {
  healthCheck(): Promise<HealthStatus>
}

export interface IIdentifiable {
  readonly id: string
  readonly name: string
}
