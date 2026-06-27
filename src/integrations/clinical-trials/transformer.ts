import type { NormalizedClinicalTrial } from "./types"
import type { CreateOpportunityInput, UpdateOpportunityInput } from "@/lib/repositories/opportunity"
import type { StateService } from "@/lib/services/state"
import type { CityService } from "@/lib/services/city"
import type { CategoryService } from "@/lib/services/category"
import type { CompanyService } from "@/lib/services/company"
import type { StudyTypeService } from "@/lib/services/study-type"

const STATE_ABBREVIATION_MAP: Record<string, string> = {
  alabama: "AL", alaska: "AK", arizona: "AZ", arkansas: "AR",
  california: "CA", colorado: "CO", connecticut: "CT", delaware: "DE",
  florida: "FL", georgia: "GA", hawaii: "HI", idaho: "ID",
  illinois: "IL", indiana: "IN", iowa: "IA", kansas: "KS",
  kentucky: "KY", louisiana: "LA", maine: "ME", maryland: "MD",
  massachusetts: "MA", michigan: "MI", minnesota: "MN", mississippi: "MS",
  missouri: "MO", montana: "MT", nebraska: "NE", nevada: "NV",
  "new hampshire": "NH", "new jersey": "NJ", "new mexico": "NM",
  "new york": "NY", "north carolina": "NC", "north dakota": "ND",
  ohio: "OH", oklahoma: "OK", oregon: "OR", pennsylvania: "PA",
  "rhode island": "RI", "south carolina": "SC", "south dakota": "SD",
  tennessee: "TN", texas: "TX", utah: "UT", vermont: "VT",
  virginia: "VA", washington: "WA", "west virginia": "WV",
  wisconsin: "WI", wyoming: "WY",
  dc: "DC",
}

export class ClinicalTrialsTransformer {
  private stateService: StateService
  private cityService: CityService
  private categoryService: CategoryService
  private companyService: CompanyService
  private studyTypeService: StudyTypeService

  private stateCache = new Map<string, string>()
  private cityCache = new Map<string, string>()
  private categoryCache = new Map<string, string>()
  private companyCache = new Map<string, string>()
  private studyTypeCache = new Map<string, string>()

  constructor(
    stateService: StateService,
    cityService: CityService,
    categoryService: CategoryService,
    companyService: CompanyService,
    studyTypeService: StudyTypeService,
  ) {
    this.stateService = stateService
    this.cityService = cityService
    this.categoryService = categoryService
    this.companyService = companyService
    this.studyTypeService = studyTypeService
  }

  clearCache(): void {
    this.stateCache.clear()
    this.cityCache.clear()
    this.categoryCache.clear()
    this.companyCache.clear()
    this.studyTypeCache.clear()
  }

  async toCreate(data: NormalizedClinicalTrial): Promise<CreateOpportunityInput> {
    const location = data.locations[0]
    const stateId = await this.resolveStateId(location.state)
    const cityId = await this.resolveCityId(stateId, location.city)
    const categoryId = await this.resolveCategoryId(data.conditions[0])
    const companyId = await this.resolveCompanyId(data.sponsor)
    const studyTypeId = await this.resolveStudyTypeId(data.studyType)

    return {
      title: data.title,
      slug: data.nctId.toLowerCase(),
      shortDescription: data.summary.slice(0, 500),
      description: data.description ? data.description.slice(0, 5000) : undefined,
      companyId,
      categoryId,
      studyTypeId,
      stateId,
      cityId,
      compensation: "Compensation varies by study",
      compensationType: "Range",
      online: false,
      featured: false,
      status: data.status,
      eligibility: data.eligibility ? data.eligibility.slice(0, 1000) : undefined,
      postedDate: data.lastUpdated ? new Date(data.lastUpdated) : new Date(),
    }
  }

  async toUpdate(data: NormalizedClinicalTrial): Promise<UpdateOpportunityInput> {
    const location = data.locations[0]
    const stateId = await this.resolveStateId(location.state)
    const cityId = await this.resolveCityId(stateId, location.city)
    const categoryId = await this.resolveCategoryId(data.conditions[0])
    const companyId = await this.resolveCompanyId(data.sponsor)
    const studyTypeId = await this.resolveStudyTypeId(data.studyType)

    return {
      title: data.title,
      shortDescription: data.summary.slice(0, 500),
      description: data.description ? data.description.slice(0, 5000) : undefined,
      companyId,
      categoryId,
      studyTypeId,
      stateId,
      cityId,
      compensation: "Compensation varies by study",
      status: data.status,
      eligibility: data.eligibility ? data.eligibility.slice(0, 1000) : undefined,
      postedDate: data.lastUpdated ? new Date(data.lastUpdated) : new Date(),
    }
  }

  private async resolveStateId(stateInput: string): Promise<string> {
    const cached = this.stateCache.get(stateInput.toLowerCase())
    if (cached) return cached

    const abbreviation = this.toStateAbbreviation(stateInput)
    const state = await this.stateService.getOrCreateByAbbreviation(stateInput, abbreviation)
    this.stateCache.set(stateInput.toLowerCase(), state.id)
    return state.id
  }

  private async resolveCityId(stateId: string, cityName: string): Promise<string> {
    const cacheKey = `${stateId}:${cityName.toLowerCase()}`
    const cached = this.cityCache.get(cacheKey)
    if (cached) return cached

    const city = await this.cityService.getOrCreateByStateAndName(stateId, cityName)
    this.cityCache.set(cacheKey, city.id)
    return city.id
  }

  private async resolveCategoryId(condition: string): Promise<string> {
    const cached = this.categoryCache.get(condition.toLowerCase())
    if (cached) return cached

    const category = await this.categoryService.getOrCreateByName(condition)
    this.categoryCache.set(condition.toLowerCase(), category.id)
    return category.id
  }

  private async resolveCompanyId(sponsor: string): Promise<string> {
    const cached = this.companyCache.get(sponsor.toLowerCase())
    if (cached) return cached

    const company = await this.companyService.getOrCreateByName(sponsor)
    this.companyCache.set(sponsor.toLowerCase(), company.id)
    return company.id
  }

  private async resolveStudyTypeId(studyType: string): Promise<string> {
    const cached = this.studyTypeCache.get(studyType.toLowerCase())
    if (cached) return cached

    const st = await this.studyTypeService.getOrCreateByName(studyType)
    this.studyTypeCache.set(studyType.toLowerCase(), st.id)
    return st.id
  }

  private toStateAbbreviation(input: string): string {
    const trimmed = input.trim()
    if (trimmed.length <= 2) return trimmed.toUpperCase()

    const lower = trimmed.toLowerCase()
    return STATE_ABBREVIATION_MAP[lower] ?? trimmed.toUpperCase().slice(0, 2)
  }
}
