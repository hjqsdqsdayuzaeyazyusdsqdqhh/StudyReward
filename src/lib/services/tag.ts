import type { IService } from "../interfaces/service"
import type { Tag } from "@prisma/client"
import type { TagRepository, CreateTagInput, UpdateTagInput } from "../repositories/tag"
import { NotFoundError } from "../errors/not-found"
import { ValidationError } from "../errors/validation"
import type { PaginatedResult, PaginationParams, SearchParams } from "../types/pagination"

export class TagService implements IService<Tag, CreateTagInput, UpdateTagInput> {
  constructor(private readonly repository: TagRepository) {}

  async getAll(): Promise<Tag[]> {
    return this.repository.findAll()
  }

  async getById(id: string): Promise<Tag> {
    const tag = await this.repository.findById(id)
    if (!tag) throw new NotFoundError("Tag", id)
    return tag
  }

  async getBySlug(slug: string): Promise<Tag> {
    const tag = await this.repository.findBySlug(slug)
    if (!tag) throw new NotFoundError("Tag", slug)
    return tag
  }

  async create(data: CreateTagInput): Promise<Tag> {
    if (!data.name?.trim()) throw new ValidationError("Tag name is required")
    if (!data.slug?.trim()) throw new ValidationError("Tag slug is required")
    return this.repository.create(data)
  }

  async update(id: string, data: UpdateTagInput): Promise<Tag> {
    const exists = await this.repository.exists(id)
    if (!exists) throw new NotFoundError("Tag", id)
    return this.repository.update(id, data)
  }

  async delete(id: string): Promise<Tag> {
    const exists = await this.repository.exists(id)
    if (!exists) throw new NotFoundError("Tag", id)
    return this.repository.delete(id)
  }

  async exists(id: string): Promise<boolean> {
    return this.repository.exists(id)
  }

  async count(): Promise<number> {
    return this.repository.count()
  }

  async paginate(params?: PaginationParams): Promise<PaginatedResult<Tag>> {
    return this.repository.paginate(params)
  }

  async search(params: SearchParams & PaginationParams): Promise<PaginatedResult<Tag>> {
    if (!params.query?.trim()) throw new ValidationError("Search query is required")
    return this.repository.search(params)
  }
}
