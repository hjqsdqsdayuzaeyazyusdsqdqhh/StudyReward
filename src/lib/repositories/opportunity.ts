import { BaseRepository } from "./base"
import type { Opportunity } from "@prisma/client"
import type { IRepository } from "../interfaces/repository"
import type { PaginatedResult, PaginationParams, SearchParams } from "../types/pagination"

export interface CreateOpportunityInput {
  title: string
  slug: string
  shortDescription: string
  description?: string
  companyId: string
  categoryId: string
  studyTypeId: string
  stateId: string
  cityId: string
  compensation: string
  compensationType?: "Fixed" | "Hourly" | "Range" | "Negotiable"
  online?: boolean
  featured?: boolean
  status?: "Active" | "Upcoming" | "Filled"
  eligibility?: string
  postedDate?: Date
}

export interface UpdateOpportunityInput {
  title?: string
  slug?: string
  shortDescription?: string
  description?: string
  companyId?: string
  categoryId?: string
  studyTypeId?: string
  stateId?: string
  cityId?: string
  compensation?: string
  compensationType?: "Fixed" | "Hourly" | "Range" | "Negotiable"
  online?: boolean
  featured?: boolean
  status?: "Active" | "Upcoming" | "Filled"
  eligibility?: string
  postedDate?: Date
}

export interface OpportunityFilter {
  categoryId?: string
  stateId?: string
  cityId?: string
  companyId?: string
  studyTypeId?: string
  status?: "Active" | "Upcoming" | "Filled"
  featured?: boolean
  online?: boolean
}

export class OpportunityRepository extends BaseRepository implements IRepository<Opportunity, CreateOpportunityInput, UpdateOpportunityInput> {
  async findAll(): Promise<Opportunity[]> {
    try {
      return await this.prisma.opportunity.findMany({ orderBy: { postedDate: "desc" } })
    } catch (error) {
      this.handleError(error, "Opportunity.findAll")
    }
  }

  async findById(id: string): Promise<Opportunity | null> {
    try {
      return await this.prisma.opportunity.findUnique({ where: { id } })
    } catch (error) {
      this.handleError(error, "Opportunity.findById", { id })
    }
  }

  async findBySlug(slug: string): Promise<Opportunity | null> {
    try {
      return await this.prisma.opportunity.findUnique({ where: { slug } })
    } catch (error) {
      this.handleError(error, "Opportunity.findBySlug", { slug })
    }
  }

  async create(data: CreateOpportunityInput): Promise<Opportunity> {
    try {
      return await this.prisma.opportunity.create({ data })
    } catch (error) {
      this.handleError(error, "Opportunity.create", { data })
    }
  }

  async update(id: string, data: UpdateOpportunityInput): Promise<Opportunity> {
    try {
      return await this.prisma.opportunity.update({ where: { id }, data })
    } catch (error) {
      this.handleError(error, "Opportunity.update", { id, data })
    }
  }

  async delete(id: string): Promise<Opportunity> {
    try {
      return await this.prisma.opportunity.delete({ where: { id } })
    } catch (error) {
      this.handleError(error, "Opportunity.delete", { id })
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const count = await this.prisma.opportunity.count({ where: { id } })
      return count > 0
    } catch (error) {
      this.handleError(error, "Opportunity.exists", { id })
    }
  }

  async count(): Promise<number> {
    try {
      return await this.prisma.opportunity.count()
    } catch (error) {
      this.handleError(error, "Opportunity.count")
    }
  }

  async paginate(params?: PaginationParams & { filter?: OpportunityFilter }): Promise<PaginatedResult<Opportunity>> {
    try {
      const { page, pageSize, skip, orderBy } = this.parsePaginationParams(params)
      const where = params?.filter ? this.buildFilterWhere(params.filter) : undefined
      const [data, total] = await Promise.all([
        this.prisma.opportunity.findMany({
          where,
          skip,
          take: pageSize,
          orderBy: orderBy ?? { postedDate: "desc" },
        }),
        this.prisma.opportunity.count({ where }),
      ])
      return this.paginateResult(data, total, { page, pageSize })
    } catch (error) {
      this.handleError(error, "Opportunity.paginate", { params })
    }
  }

  async search(params: SearchParams & PaginationParams): Promise<PaginatedResult<Opportunity>> {
    try {
      const { query, page = 1, pageSize = 20, sortBy, sortOrder } = params
      const skip = (page - 1) * pageSize
      const where = {
        OR: [
          { title: { contains: query, mode: "insensitive" as const } },
          { shortDescription: { contains: query, mode: "insensitive" as const } },
          { compensation: { contains: query, mode: "insensitive" as const } },
        ],
      }
      const orderBy = sortBy ? { [sortBy]: sortOrder ?? "desc" } : { postedDate: "desc" as const }
      const [data, total] = await Promise.all([
        this.prisma.opportunity.findMany({ where, skip, take: pageSize, orderBy }),
        this.prisma.opportunity.count({ where }),
      ])
      return this.paginateResult(data, total, { page, pageSize })
    } catch (error) {
      this.handleError(error, "Opportunity.search", { params })
    }
  }

  async findByCategory(categoryId: string, params?: PaginationParams): Promise<PaginatedResult<Opportunity>> {
    return this.paginate({ ...params, filter: { categoryId } })
  }

  async findByState(stateId: string, params?: PaginationParams): Promise<PaginatedResult<Opportunity>> {
    return this.paginate({ ...params, filter: { stateId } })
  }

  async findByCity(cityId: string, params?: PaginationParams): Promise<PaginatedResult<Opportunity>> {
    return this.paginate({ ...params, filter: { cityId } })
  }

  async findByCompany(companyId: string, params?: PaginationParams): Promise<PaginatedResult<Opportunity>> {
    return this.paginate({ ...params, filter: { companyId } })
  }

  async findFeatured(limit = 6): Promise<Opportunity[]> {
    try {
      return await this.prisma.opportunity.findMany({
        where: { featured: true, status: "Active" },
        orderBy: { postedDate: "desc" },
        take: limit,
      })
    } catch (error) {
      this.handleError(error, "Opportunity.findFeatured", { limit })
    }
  }

  async findLatest(limit = 10): Promise<Opportunity[]> {
    try {
      return await this.prisma.opportunity.findMany({
        where: { status: "Active" },
        orderBy: { postedDate: "desc" },
        take: limit,
      })
    } catch (error) {
      this.handleError(error, "Opportunity.findLatest", { limit })
    }
  }

  private buildFilterWhere(filter: OpportunityFilter): Record<string, unknown> {
    const where: Record<string, unknown> = {}
    if (filter.categoryId) where.categoryId = filter.categoryId
    if (filter.stateId) where.stateId = filter.stateId
    if (filter.cityId) where.cityId = filter.cityId
    if (filter.companyId) where.companyId = filter.companyId
    if (filter.studyTypeId) where.studyTypeId = filter.studyTypeId
    if (filter.status) where.status = filter.status
    if (filter.featured !== undefined) where.featured = filter.featured
    if (filter.online !== undefined) where.online = filter.online
    return where
  }
}
