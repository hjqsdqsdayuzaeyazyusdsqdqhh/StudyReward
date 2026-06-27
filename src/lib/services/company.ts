import type { IService } from "../interfaces/service"
import type { Company } from "@prisma/client"
import type { CompanyRepository, CreateCompanyInput, UpdateCompanyInput } from "../repositories/company"
import { NotFoundError } from "../errors/not-found"
import { ValidationError } from "../errors/validation"
import type { PaginatedResult, PaginationParams, SearchParams } from "../types/pagination"

export class CompanyService implements IService<Company, CreateCompanyInput, UpdateCompanyInput> {
  constructor(private readonly repository: CompanyRepository) {}

  async getAll(): Promise<Company[]> {
    return this.repository.findAll()
  }

  async getById(id: string): Promise<Company> {
    const company = await this.repository.findById(id)
    if (!company) throw new NotFoundError("Company", id)
    return company
  }

  async getBySlug(slug: string): Promise<Company> {
    const company = await this.repository.findBySlug(slug)
    if (!company) throw new NotFoundError("Company", slug)
    return company
  }

  async getByName(name: string): Promise<Company | null> {
    return this.repository.findByName(name)
  }

  async getOrCreateByName(name: string, website?: string): Promise<Company> {
    const existing = await this.repository.findByName(name)
    if (existing) return existing
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
    return this.repository.create({ name, slug, website })
  }

  async create(data: CreateCompanyInput): Promise<Company> {
    if (!data.name?.trim()) throw new ValidationError("Company name is required")
    if (!data.slug?.trim()) throw new ValidationError("Company slug is required")
    return this.repository.create(data)
  }

  async update(id: string, data: UpdateCompanyInput): Promise<Company> {
    const exists = await this.repository.exists(id)
    if (!exists) throw new NotFoundError("Company", id)
    return this.repository.update(id, data)
  }

  async delete(id: string): Promise<Company> {
    const exists = await this.repository.exists(id)
    if (!exists) throw new NotFoundError("Company", id)
    return this.repository.delete(id)
  }

  async exists(id: string): Promise<boolean> {
    return this.repository.exists(id)
  }

  async count(): Promise<number> {
    return this.repository.count()
  }

  async paginate(params?: PaginationParams): Promise<PaginatedResult<Company>> {
    return this.repository.paginate(params)
  }

  async search(params: SearchParams & PaginationParams): Promise<PaginatedResult<Company>> {
    if (!params.query?.trim()) throw new ValidationError("Search query is required")
    return this.repository.search(params)
  }
}
