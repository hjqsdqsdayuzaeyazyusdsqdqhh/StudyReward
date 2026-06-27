import type { Opportunity } from "@/generated/prisma/client"
import type { OpportunityRepository } from "@/lib/repositories/opportunity"
import type { NormalizedClinicalTrial } from "./types"
import { NormalizedClinicalTrialSchema } from "./types"
import { ClinicalTrialsApiClient, type FetchStudiesParams } from "./client"
import { ClinicalTrialsNormalizer } from "./normalizer"
import { ClinicalTrialsTransformer } from "./transformer"
import { IntegrationLogger } from "../logging"

export interface ImportStats {
  totalFetched: number
  totalSkipped: number
  totalCreated: number
  totalUpdated: number
  totalFailed: number
  totalPages: number
  errors: string[]
}

export class ClinicalTrialsImportService {
  private apiClient: ClinicalTrialsApiClient
  private normalizer: ClinicalTrialsNormalizer
  private transformer: ClinicalTrialsTransformer
  private opportunityRepository: OpportunityRepository
  private logger: IntegrationLogger

  constructor(
    apiClient: ClinicalTrialsApiClient,
    normalizer: ClinicalTrialsNormalizer,
    transformer: ClinicalTrialsTransformer,
    opportunityRepository: OpportunityRepository,
    logger?: IntegrationLogger,
  ) {
    this.apiClient = apiClient
    this.normalizer = normalizer
    this.transformer = transformer
    this.opportunityRepository = opportunityRepository
    this.logger = logger ?? new IntegrationLogger(10000, false)
  }

  async importAll(params?: Omit<FetchStudiesParams, "pageToken">): Promise<ImportStats> {
    const stats: ImportStats = {
      totalFetched: 0,
      totalSkipped: 0,
      totalCreated: 0,
      totalUpdated: 0,
      totalFailed: 0,
      totalPages: 0,
      errors: [],
    }

    let pageToken: string | null = null
    let page = 0

    this.transformer.clearCache()
    this.logger.info("Starting ClinicalTrials.gov import", "sync", { status: "RECRUITING" })

    do {
      page++
      stats.totalPages = page

      try {
        const result = await this.apiClient.fetchStudies({
          ...params,
          pageToken: pageToken ?? undefined,
        })
        stats.totalFetched += result.studies.length
        pageToken = result.nextPageToken

        this.logger.info(
          `Fetched page ${page}: ${result.studies.length} studies`,
          "import",
          { page, batchSize: result.studies.length },
        )

        const normalized = this.normalizer.normalizeBatch(result.studies)
        const skipped = result.studies.length - normalized.length
        stats.totalSkipped += skipped

        if (skipped > 0) {
          this.logger.warn(`Skipped ${skipped} studies on page ${page}`, "import", { page, skipped })
        }

        for (const trial of normalized) {
          try {
            await this.processTrial(trial, stats, page)
          } catch (err) {
            const msg = err instanceof Error ? err.message : "Unknown error"
            stats.errors.push(`Trial ${trial.nctId}: ${msg}`)
            stats.totalFailed++
            this.logger.error(`Failed to process ${trial.nctId}`, "import", { nctId: trial.nctId, error: msg })
          }
        }

        this.logger.info(
          `Page ${page} complete: ${stats.totalCreated} created, ${stats.totalUpdated} updated, ${stats.totalFailed} failed`,
          "import",
          { page, created: stats.totalCreated, updated: stats.totalUpdated, failed: stats.totalFailed },
        )
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error"
        stats.errors.push(`Page ${page}: ${msg}`)
        this.logger.error(`Page ${page} failed`, "error", { page, error: msg })
      }
    } while (pageToken !== null)

    this.logger.info(
      "Import complete",
      "sync",
      {
        totalFetched: stats.totalFetched,
        totalCreated: stats.totalCreated,
        totalUpdated: stats.totalUpdated,
        totalFailed: stats.totalFailed,
        totalPages: stats.totalPages,
      },
    )

    return stats
  }

  async importSinglePage(params?: FetchStudiesParams): Promise<ImportStats> {
    const stats: ImportStats = {
      totalFetched: 0,
      totalSkipped: 0,
      totalCreated: 0,
      totalUpdated: 0,
      totalFailed: 0,
      totalPages: 1,
      errors: [],
    }

    this.transformer.clearCache()
    this.logger.info("Starting single-page import", "import")

    try {
      const result = await this.apiClient.fetchStudies(params ?? {})
      stats.totalFetched = result.studies.length

      const normalized = this.normalizer.normalizeBatch(result.studies)
      stats.totalSkipped = result.studies.length - normalized.length

      for (const trial of normalized) {
        try {
          await this.processTrial(trial, stats, 1)
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Unknown error"
          stats.errors.push(`Trial ${trial.nctId}: ${msg}`)
          stats.totalFailed++
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error"
      stats.errors.push(msg)
      this.logger.error("Single-page import failed", "error", { error: msg })
    }

    return stats
  }

  private async processTrial(
    trial: NormalizedClinicalTrial,
    stats: ImportStats,
    _page: number,
  ): Promise<void> {
    const validation = NormalizedClinicalTrialSchema.safeParse(trial)
    if (!validation.success) {
      stats.totalFailed++
      stats.errors.push(`Trial ${trial.nctId}: Zod validation failed`)
      return
    }

    const slug = trial.nctId.toLowerCase()
    const existing = await this.opportunityRepository.findBySlug(slug)

    if (existing) {
      const updateInput = await this.transformer.toUpdate(validation.data)
      await this.opportunityRepository.update(existing.id, updateInput)
      stats.totalUpdated++
    } else {
      const createInput = await this.transformer.toCreate(validation.data)
      await this.opportunityRepository.create(createInput)
      stats.totalCreated++
    }
  }
}
