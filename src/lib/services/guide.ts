import type { IService } from "../interfaces/service"
import type { Guide } from "@/generated/prisma/client"
import type { GuideRepository, CreateGuideInput, UpdateGuideInput } from "../repositories/guide"
import { NotFoundError } from "../errors/not-found"
import { ValidationError } from "../errors/validation"
import type { PaginatedResult, PaginationParams, SearchParams } from "../types/pagination"

export class GuideService implements IService<Guide, CreateGuideInput, UpdateGuideInput> {
  constructor(private readonly repository: GuideRepository) {}

  async getAll(): Promise<Guide[]> {
    return this.repository.findAll()
  }

  async getById(id: string): Promise<Guide> {
    const guide = await this.repository.findById(id)
    if (!guide) throw new NotFoundError("Guide", id)
    return guide
  }

  async getBySlug(slug: string): Promise<Guide> {
    const guide = await this.repository.findBySlug(slug)
    if (!guide) throw new NotFoundError("Guide", slug)
    return guide
  }

  async create(data: CreateGuideInput): Promise<Guide> {
    if (!data.title?.trim()) throw new ValidationError("Guide title is required")
    if (!data.slug?.trim()) throw new ValidationError("Guide slug is required")
    if (!data.excerpt?.trim()) throw new ValidationError("Guide excerpt is required")
    if (!data.categoryId) throw new ValidationError("Guide categoryId is required")
    return this.repository.create(data)
  }

  async update(id: string, data: UpdateGuideInput): Promise<Guide> {
    const exists = await this.repository.exists(id)
    if (!exists) throw new NotFoundError("Guide", id)
    return this.repository.update(id, data)
  }

  async delete(id: string): Promise<Guide> {
    const exists = await this.repository.exists(id)
    if (!exists) throw new NotFoundError("Guide", id)
    return this.repository.delete(id)
  }

  async exists(id: string): Promise<boolean> {
    return this.repository.exists(id)
  }

  async count(): Promise<number> {
    return this.repository.count()
  }

  async paginate(params?: PaginationParams): Promise<PaginatedResult<Guide>> {
    return this.repository.paginate(params)
  }

  async search(params: SearchParams & PaginationParams): Promise<PaginatedResult<Guide>> {
    if (!params.query?.trim()) throw new ValidationError("Search query is required")
    return this.repository.search(params)
  }

  async getByCategory(categoryId: string): Promise<Guide[]> {
    return this.repository.findByCategory(categoryId)
  }
}
