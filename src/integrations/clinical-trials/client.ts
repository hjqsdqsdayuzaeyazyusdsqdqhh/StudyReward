const API_BASE_URL = "https://clinicaltrials.gov/api/v2"
const DEFAULT_PAGE_SIZE = 100

export interface ClinicalTrialsApiResponse {
  studies?: StudyJson[]
  nextPageToken?: string
  totalCount?: number
}

export interface StudyJson {
  protocolSection: {
    identificationModule?: {
      nctId?: string
      briefTitle?: string
      officialTitle?: string
    }
    statusModule?: {
      overallStatus?: string
      lastUpdatePostDate?: string
    }
    sponsorCollaboratorsModule?: {
      leadSponsor?: { name?: string; class?: string }
    }
    descriptionModule?: {
      briefSummary?: string
      detailedDescription?: string
    }
    conditionsModule?: {
      conditions?: string[]
    }
    designModule?: {
      studyType?: string
      phases?: string[]
    }
    armsInterventionsModule?: {
      interventions?: { type?: string; name?: string }[]
    }
    eligibilityModule?: {
      eligibilityCriteria?: string
      sex?: string
      minimumAge?: string
      maximumAge?: string
      healthyVolunteers?: string
    }
    contactsLocationsModule?: {
      locations?: {
        facility?: string
        city?: string
        state?: string
        country?: string
      }[]
    }
  }
}

export interface FetchStudiesParams {
  query?: string
  status?: string
  country?: string
  pageSize?: number
  pageToken?: string
}

export interface FetchStudiesResult {
  studies: StudyJson[]
  nextPageToken: string | null
  totalCount: number | null
}

export class ClinicalTrialsApiClient {
  private baseUrl: string
  private timeout: number

  constructor(baseUrl = API_BASE_URL, timeout = 30000) {
    this.baseUrl = baseUrl
    this.timeout = timeout
  }

  async fetchStudies(params: FetchStudiesParams): Promise<FetchStudiesResult> {
    const url = this.buildUrl(params)
    const response = await this.request(url)
    const data = response as ClinicalTrialsApiResponse
    return {
      studies: data.studies ?? [],
      nextPageToken: data.nextPageToken ?? null,
      totalCount: data.totalCount ?? null,
    }
  }

  async fetchAllStudies(
    params: Omit<FetchStudiesParams, "pageToken">,
    onProgress?: (page: number, total: number) => void,
  ): Promise<StudyJson[]> {
    const allStudies: StudyJson[] = []
    let pageToken: string | null = null
    let page = 0
    let totalCount: number | null = null

    do {
      const result = await this.fetchStudies({ ...params, pageToken: pageToken ?? undefined })
      allStudies.push(...result.studies)
      pageToken = result.nextPageToken
      if (totalCount === null && result.totalCount !== null) {
        totalCount = result.totalCount
      }
      page++
      onProgress?.(page, totalCount ?? allStudies.length)
    } while (pageToken !== null)

    return allStudies
  }

  private buildUrl(params: FetchStudiesParams): string {
    const searchParams = new URLSearchParams()
    searchParams.set("format", "json")
    searchParams.set("pageSize", String(params.pageSize ?? DEFAULT_PAGE_SIZE))

    if (params.query) searchParams.set("query.term", params.query)
    if (params.status) searchParams.set("filter.overallStatus", params.status)
    if (params.country) searchParams.set("filter.geo", params.country)
    if (params.pageToken) searchParams.set("pageToken", params.pageToken)

    return `${this.baseUrl}/studies?${searchParams.toString()}`
  }

  private async request(url: string): Promise<unknown> {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, { signal: controller.signal })
      if (!response.ok) {
        throw new Error(`ClinicalTrials.gov API error: ${response.status} ${response.statusText}`)
      }
      return await response.json()
    } finally {
      clearTimeout(timer)
    }
  }
}
