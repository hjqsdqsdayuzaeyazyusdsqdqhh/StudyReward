import { randomUUID } from "crypto"
import type { z } from "zod"
import type { BatchConfig, ImportError, ImportResult } from "../../types"
import { ValidationError } from "../../errors"

export interface ImportRepository<TModel, TCreate, TUpdate> {
  findBySlug(slug: string): Promise<TModel | null>
  create(data: TCreate): Promise<TModel>
  update(id: string, data: TUpdate): Promise<TModel>
  findByExternalId?(externalId: string): Promise<TModel | null>
}

export interface ImportAdapter<TNormalized> {
  readonly providerId: string
  parse(raw: unknown): Promise<TNormalized>
  parseBatch(raw: unknown[], config?: BatchConfig): Promise<TNormalized[]>
}

export interface ImportNormalizer<TNormalized, TStructured> {
  normalize(data: TNormalized): Promise<TStructured>
  normalizeBatch(data: TNormalized[]): Promise<TStructured[]>
}

export interface ImportTransformer<TStructured, TCreate, TUpdate> {
  toCreate(data: TStructured): Promise<TCreate>
  toUpdate(data: TStructured): Promise<TUpdate>
}

export class BaseImporter<TModel, TCreate, TUpdate, TNormalized, TStructured> {
  private adapter: ImportAdapter<TNormalized>
  private normalizer: ImportNormalizer<TNormalized, TStructured>
  private transformer: ImportTransformer<TStructured, TCreate, TUpdate>
  private repository: ImportRepository<TModel, TCreate, TUpdate>
  private schema: z.ZodSchema<TStructured>
  private batchConfig: BatchConfig

  constructor(
    providerId: string,
    adapter: ImportAdapter<TNormalized>,
    normalizer: ImportNormalizer<TNormalized, TStructured>,
    transformer: ImportTransformer<TStructured, TCreate, TUpdate>,
    repository: ImportRepository<TModel, TCreate, TUpdate>,
    schema: z.ZodSchema<TStructured>,
    batchConfig?: Partial<BatchConfig>,
  ) {
    this.adapter = adapter
    this.normalizer = normalizer
    this.transformer = transformer
    this.repository = repository
    this.schema = schema
    this.batchConfig = { batchSize: batchConfig?.batchSize ?? 100, concurrency: batchConfig?.concurrency ?? 5 }
  }

  async import(raw: unknown[] | unknown): Promise<ImportResult> {
    const batchId = randomUUID()
    const startedAt = new Date()
    const errors: ImportError[] = []
    let totalFetched = 0
    let totalValidated = 0
    let totalNormalized = 0
    let totalTransformed = 0
    let totalSaved = 0
    let totalFailed = 0

    try {
      const rawArray = Array.isArray(raw) ? raw : [raw]
      totalFetched = rawArray.length

      const parsed = await this.adapter.parseBatch(rawArray, this.batchConfig)
      totalValidated = parsed.length

      const normalized = await this.normalizer.normalizeBatch(parsed)
      totalNormalized = normalized.length

      for (let i = 0; i < normalized.length; i++) {
        try {
          const item = normalized[i]

          const validation = this.schema.safeParse(item)
          if (!validation.success) {
            const importErr: ImportError = {
              index: i,
              stage: "validate",
              message: "Zod validation failed",
              code: "VALIDATION_ERROR",
              raw: item,
            }
            errors.push(importErr)
            totalFailed++
            continue
          }

          const createInput = await this.transformer.toCreate(validation.data)
          totalTransformed++

          const saved = await this.repository.create(createInput)
          if (saved) {
            totalSaved++
          } else {
            totalFailed++
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : "Unknown error"
          errors.push({ index: i, stage: "save", message })
          totalFailed++
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error"
      errors.push({ index: -1, stage: "fetch", message })
      totalFailed = totalFetched
    }

    return {
      providerId: this.adapter.providerId,
      batchId,
      totalFetched,
      totalValidated,
      totalNormalized,
      totalTransformed,
      totalSaved,
      totalFailed,
      errors,
      startedAt,
      completedAt: new Date(),
    }
  }

  async importSingle(raw: unknown): Promise<{ data: TModel | null; error?: ImportError }> {
    interface WithExternalId {
      externalId?: string
      [key: string]: unknown
    }
    try {
      const parsed = await this.adapter.parse(raw)
      const normalized = await this.normalizer.normalize(parsed)

      const validation = this.schema.safeParse(normalized)
      if (!validation.success) {
        return {
          data: null,
          error: {
            index: 0,
            stage: "validate",
            message: "Zod validation failed",
            code: "VALIDATION_ERROR",
          },
        }
      }

      const updateInput = await this.transformer.toUpdate(validation.data)
      const createInput = await this.transformer.toCreate(validation.data)

      if (this.repository.findByExternalId) {
        const dataWithId = validation.data as WithExternalId
        if (dataWithId.externalId) {
          const existing = await this.repository.findByExternalId(dataWithId.externalId)
          if (existing) {
            const updated = await this.repository.update((existing as Record<string, unknown>).id as string, updateInput)
            return { data: updated }
          }
        }
      }

      const saved = await this.repository.create(createInput)
      return { data: saved }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error"
      return { data: null, error: { index: 0, stage: "save", message } }
    }
  }
}
