import { BaseProvider } from "../providers/base/BaseProvider"
import type { ProviderConfig } from "../types"
import type { ImportResult } from "../types"
import type { FetchStudiesParams } from "./client"
import { ClinicalTrialsImportService } from "./import-service"

export class ClinicalTrialsProvider extends BaseProvider {
  private importService: ClinicalTrialsImportService

  constructor(
    config: ProviderConfig,
    importService: ClinicalTrialsImportService,
  ) {
    super("clinical-trials-gov", "ClinicalTrials.gov", "2.0", config)
    this.importService = importService
  }

  async connect(): Promise<void> {
    this.status = "connected"
  }

  async disconnect(): Promise<void> {
    this.status = "disconnected"
  }

  async fetch(params?: Record<string, unknown>): Promise<unknown[]> {
    const fetchParams: FetchStudiesParams = {
      status: (params?.status as string) ?? "RECRUITING,NOT_YET_RECRUITING,ACTIVE_NOT_RECRUITING,ENROLLING_BY_INVITATION",
      country: (params?.country as string) ?? "US",
    }

    if (params?.query) fetchParams.query = params.query as string

    const result = await this.importService.importSinglePage(fetchParams)
    return []
  }

  async import(data: unknown[] | unknown): Promise<ImportResult> {
    return {
      providerId: this.id,
      batchId: crypto.randomUUID(),
      totalFetched: 0,
      totalValidated: 0,
      totalNormalized: 0,
      totalTransformed: 0,
      totalSaved: 0,
      totalFailed: 0,
      errors: [],
      startedAt: new Date(),
      completedAt: new Date(),
    }
  }
}
