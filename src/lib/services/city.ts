import type { IService } from "../interfaces/service"
import type { City } from "@/generated/prisma/client"
import type { CityRepository, CreateCityInput, UpdateCityInput } from "../repositories/city"
import { NotFoundError } from "../errors/not-found"
import { ValidationError } from "../errors/validation"
import type { PaginatedResult, PaginationParams, SearchParams } from "../types/pagination"

export class CityService implements IService<City, CreateCityInput, UpdateCityInput> {
  constructor(private readonly repository: CityRepository) {}

  async getAll(): Promise<City[]> {
    return this.repository.findAll()
  }

  async getById(id: string): Promise<City> {
    const city = await this.repository.findById(id)
    if (!city) throw new NotFoundError("City", id)
    return city
  }

  async getBySlug(slug: string): Promise<City> {
    const city = await this.repository.findBySlug(slug)
    if (!city) throw new NotFoundError("City", slug)
    return city
  }

  async create(data: CreateCityInput): Promise<City> {
    if (!data.name?.trim()) throw new ValidationError("City name is required")
    if (!data.slug?.trim()) throw new ValidationError("City slug is required")
    if (!data.stateId?.trim()) throw new ValidationError("City stateId is required")
    return this.repository.create(data)
  }

  async update(id: string, data: UpdateCityInput): Promise<City> {
    const exists = await this.repository.exists(id)
    if (!exists) throw new NotFoundError("City", id)
    return this.repository.update(id, data)
  }

  async delete(id: string): Promise<City> {
    const exists = await this.repository.exists(id)
    if (!exists) throw new NotFoundError("City", id)
    return this.repository.delete(id)
  }

  async exists(id: string): Promise<boolean> {
    return this.repository.exists(id)
  }

  async count(): Promise<number> {
    return this.repository.count()
  }

  async paginate(params?: PaginationParams): Promise<PaginatedResult<City>> {
    return this.repository.paginate(params)
  }

  async search(params: SearchParams & PaginationParams): Promise<PaginatedResult<City>> {
    if (!params.query?.trim()) throw new ValidationError("Search query is required")
    return this.repository.search(params)
  }

  async getByStateId(stateId: string): Promise<City[]> {
    return this.repository.findByStateId(stateId)
  }

  async getByStateAndName(stateId: string, name: string): Promise<City | null> {
    return this.repository.findByStateAndName(stateId, name)
  }

  async getOrCreateByStateAndName(stateId: string, name: string): Promise<City> {
    const existing = await this.repository.findByStateAndName(stateId, name)
    if (existing) return existing
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
    return this.repository.create({ stateId, name, slug })
  }
}
