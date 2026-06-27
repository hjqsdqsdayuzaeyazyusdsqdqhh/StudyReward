import type { IService } from "../interfaces/service"
import type { FAQ } from "@prisma/client"
import type { FAQRepository, CreateFAQInput, UpdateFAQInput } from "../repositories/faq"
import { NotFoundError } from "../errors/not-found"
import { ValidationError } from "../errors/validation"
import type { PaginatedResult, PaginationParams, SearchParams } from "../types/pagination"

export class FAQService implements IService<FAQ, CreateFAQInput, UpdateFAQInput> {
  constructor(private readonly repository: FAQRepository) {}

  async getAll(): Promise<FAQ[]> {
    return this.repository.findAll()
  }

  async getById(id: string): Promise<FAQ> {
    const faq = await this.repository.findById(id)
    if (!faq) throw new NotFoundError("FAQ", id)
    return faq
  }

  async getBySlug(_slug: string): Promise<FAQ> {
    throw new NotFoundError("FAQ slug lookup not supported")
  }

  async create(data: CreateFAQInput): Promise<FAQ> {
    if (!data.question?.trim()) throw new ValidationError("FAQ question is required")
    if (!data.answer?.trim()) throw new ValidationError("FAQ answer is required")
    return this.repository.create(data)
  }

  async update(id: string, data: UpdateFAQInput): Promise<FAQ> {
    const exists = await this.repository.exists(id)
    if (!exists) throw new NotFoundError("FAQ", id)
    return this.repository.update(id, data)
  }

  async delete(id: string): Promise<FAQ> {
    const exists = await this.repository.exists(id)
    if (!exists) throw new NotFoundError("FAQ", id)
    return this.repository.delete(id)
  }

  async exists(id: string): Promise<boolean> {
    return this.repository.exists(id)
  }

  async count(): Promise<number> {
    return this.repository.count()
  }

  async paginate(params?: PaginationParams): Promise<PaginatedResult<FAQ>> {
    return this.repository.paginate(params)
  }

  async search(params: SearchParams & PaginationParams): Promise<PaginatedResult<FAQ>> {
    if (!params.query?.trim()) throw new ValidationError("Search query is required")
    return this.repository.search(params)
  }

  async getByOpportunity(opportunityId: string): Promise<FAQ[]> {
    return this.repository.findByOpportunity(opportunityId)
  }
}
