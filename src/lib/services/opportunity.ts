import type { IService } from "../interfaces/service"
import type { Opportunity } from "@/generated/prisma/client"
import type {
  OpportunityRepository,
  CreateOpportunityInput,
  UpdateOpportunityInput,
  OpportunityFilter,
} from "../repositories/opportunity"
import { NotFoundError } from "../errors/not-found"
import { ValidationError } from "../errors/validation"
import type { PaginatedResult, PaginationParams, SearchParams } from "../types/pagination"

export class OpportunityService implements IService<Opportunity, CreateOpportunityInput, UpdateOpportunityInput> {
  constructor(private readonly repository: OpportunityRepository) {}

  async getAll(): Promise<Opportunity[]> {
    return this.repository.findAll()
  }

  async getById(id: string): Promise<Opportunity> {
    const opportunity = await this.repository.findById(id)
    if (!opportunity) throw new NotFoundError("Opportunity", id)
    return opportunity
  }

  async getBySlug(slug: string): Promise<Opportunity> {
    const opportunity = await this.repository.findBySlug(slug)
    if (!opportunity) throw new NotFoundError("Opportunity", slug)
    return opportunity
  }

  async create(data: CreateOpportunityInput): Promise<Opportunity> {
    if (!data.title?.trim()) throw new ValidationError("Opportunity title is required")
    if (!data.slug?.trim()) throw new ValidationError("Opportunity slug is required")
    if (!data.companyId) throw new ValidationError("Opportunity companyId is required")
    if (!data.categoryId) throw new ValidationError("Opportunity categoryId is required")
    if (!data.studyTypeId) throw new ValidationError("Opportunity studyTypeId is required")
    if (!data.stateId) throw new ValidationError("Opportunity stateId is required")
    if (!data.cityId) throw new ValidationError("Opportunity cityId is required")
    if (!data.compensation?.trim()) throw new ValidationError("Opportunity compensation is required")
    return this.repository.create(data)
  }

  async update(id: string, data: UpdateOpportunityInput): Promise<Opportunity> {
    const exists = await this.repository.exists(id)
    if (!exists) throw new NotFoundError("Opportunity", id)
    return this.repository.update(id, data)
  }

  async delete(id: string): Promise<Opportunity> {
    const exists = await this.repository.exists(id)
    if (!exists) throw new NotFoundError("Opportunity", id)
    return this.repository.delete(id)
  }

  async exists(id: string): Promise<boolean> {
    return this.repository.exists(id)
  }

  async count(): Promise<number> {
    return this.repository.count()
  }

  async paginate(params?: PaginationParams & { filter?: OpportunityFilter }): Promise<PaginatedResult<Opportunity>> {
    return this.repository.paginate(params)
  }

  async search(params: SearchParams & PaginationParams): Promise<PaginatedResult<Opportunity>> {
    if (!params.query?.trim()) throw new ValidationError("Search query is required")
    return this.repository.search(params)
  }

  async getByCategory(categoryId: string, params?: PaginationParams): Promise<PaginatedResult<Opportunity>> {
    return this.repository.findByCategory(categoryId, params)
  }

  async getByState(stateId: string, params?: PaginationParams): Promise<PaginatedResult<Opportunity>> {
    return this.repository.findByState(stateId, params)
  }

  async getByCity(cityId: string, params?: PaginationParams): Promise<PaginatedResult<Opportunity>> {
    return this.repository.findByCity(cityId, params)
  }

  async getByCompany(companyId: string, params?: PaginationParams): Promise<PaginatedResult<Opportunity>> {
    return this.repository.findByCompany(companyId, params)
  }

  async getFeatured(limit = 6): Promise<Opportunity[]> {
    return this.repository.findFeatured(limit)
  }

  async getLatest(limit = 10): Promise<Opportunity[]> {
    return this.repository.findLatest(limit)
  }
}
