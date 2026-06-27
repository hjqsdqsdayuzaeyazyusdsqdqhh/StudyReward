import type { CacheConfig, CacheEntry } from "../types"

export interface ICache {
  get<T>(key: string): Promise<T | undefined>
  set<T>(key: string, value: T, ttl?: number): Promise<void>
  delete(key: string): Promise<boolean>
  clear(): Promise<void>
  has(key: string): Promise<boolean>
  getOrSet<T>(key: string, factory: () => Promise<T>, ttl?: number): Promise<T>
}

export class MemoryCache implements ICache {
  private store: Map<string, CacheEntry<unknown>> = new Map()
  private config: CacheConfig

  constructor(config?: Partial<CacheConfig>) {
    this.config = {
      ttl: config?.ttl ?? 300,
      maxSize: config?.maxSize ?? 1000,
    }
  }

  async get<T>(key: string): Promise<T | undefined> {
    const entry = this.store.get(key)
    if (!entry) return undefined

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return undefined
    }

    return entry.value as T
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    if (this.store.size >= this.config.maxSize) {
      const oldest = this.store.keys().next().value
      if (oldest) this.store.delete(oldest)
    }

    const expiresAt = Date.now() + (ttl ?? this.config.ttl) * 1000
    this.store.set(key, { value, expiresAt })
  }

  async delete(key: string): Promise<boolean> {
    return this.store.delete(key)
  }

  async clear(): Promise<void> {
    this.store.clear()
  }

  async has(key: string): Promise<boolean> {
    const entry = this.store.get(key)
    if (!entry) return false
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return false
    }
    return true
  }

  async getOrSet<T>(key: string, factory: () => Promise<T>, ttl?: number): Promise<T> {
    const existing = await this.get<T>(key)
    if (existing !== undefined) return existing

    const value = await factory()
    await this.set(key, value, ttl)
    return value
  }

  size(): number {
    return this.store.size
  }
}
