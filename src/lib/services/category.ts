import type { IService } from "../interfaces/service"
import type { Category } from "@/generated/prisma/client"
import type { CategoryRepository, CreateCategoryInput, UpdateCategoryInput } from "../repositories/category"
import { NotFoundError } from "../errors/not-found"
import { ValidationError } from "../errors/validation"
import type { PaginatedResult, PaginationParams, SearchParams } from "../types/pagination"

export class CategoryService implements IService<Category, CreateCategoryInput, UpdateCategoryInput> {
  constructor(private readonly repository: CategoryRepository) {}

  async getAll(): Promise<Category[]> {
    return this.repository.findAll()
  }

  async getById(id: string): Promise<Category> {
    const category = await this.repository.findById(id)
    if (!category) throw new NotFoundError("Category", id)
    return category
  }

  async getBySlug(slug: string): Promise<Category> {
    const category = await this.repository.findBySlug(slug)
    if (!category) throw new NotFoundError("Category", slug)
    return category
  }

  async getByName(name: string): Promise<Category | null> {
    return this.repository.findByName(name)
  }

  async getOrCreateByName(name: string, description?: string): Promise<Category> {
    const existing = await this.repository.findByName(name)
    if (existing) return existing
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
    return this.repository.create({ name, slug, description })
  }

  async create(data: CreateCategoryInput): Promise<Category> {
    if (!data.name?.trim()) throw new ValidationError("Category name is required")
    if (!data.slug?.trim()) throw new ValidationError("Category slug is required")
    return this.repository.create(data)
  }

  async update(id: string, data: UpdateCategoryInput): Promise<Category> {
    const exists = await this.repository.exists(id)
    if (!exists) throw new NotFoundError("Category", id)
    return this.repository.update(id, data)
  }

  async delete(id: string): Promise<Category> {
    const exists = await this.repository.exists(id)
    if (!exists) throw new NotFoundError("Category", id)
    return this.repository.delete(id)
  }

  async exists(id: string): Promise<boolean> {
    return this.repository.exists(id)
  }

  async count(): Promise<number> {
    return this.repository.count()
  }

  async paginate(params?: PaginationParams): Promise<PaginatedResult<Category>> {
    return this.repository.paginate(params)
  }

  async search(params: SearchParams & PaginationParams): Promise<PaginatedResult<Category>> {
    if (!params.query?.trim()) throw new ValidationError("Search query is required")
    return this.repository.search(params)
  }
}
