import type { IService } from "../interfaces/service"
import type { State } from "@/generated/prisma/client"
import type { StateRepository, CreateStateInput, UpdateStateInput } from "../repositories/state"
import { NotFoundError } from "../errors/not-found"
import { ValidationError } from "../errors/validation"
import type { PaginatedResult, PaginationParams, SearchParams } from "../types/pagination"

export class StateService implements IService<State, CreateStateInput, UpdateStateInput> {
  constructor(private readonly repository: StateRepository) {}

  async getAll(): Promise<State[]> {
    return this.repository.findAll()
  }

  async getById(id: string): Promise<State> {
    const state = await this.repository.findById(id)
    if (!state) throw new NotFoundError("State", id)
    return state
  }

  async getBySlug(slug: string): Promise<State> {
    const state = await this.repository.findBySlug(slug)
    if (!state) throw new NotFoundError("State", slug)
    return state
  }

  async getByAbbreviation(abbreviation: string): Promise<State | null> {
    return this.repository.findByAbbreviation(abbreviation)
  }

  async getOrCreateByAbbreviation(name: string, abbreviation: string): Promise<State> {
    const existing = await this.repository.findByAbbreviation(abbreviation)
    if (existing) return existing
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
    return this.repository.create({ name, slug, abbreviation })
  }

  async create(data: CreateStateInput): Promise<State> {
    if (!data.name?.trim()) throw new ValidationError("State name is required")
    if (!data.slug?.trim()) throw new ValidationError("State slug is required")
    if (!data.abbreviation?.trim()) throw new ValidationError("State abbreviation is required")
    return this.repository.create(data)
  }

  async update(id: string, data: UpdateStateInput): Promise<State> {
    const exists = await this.repository.exists(id)
    if (!exists) throw new NotFoundError("State", id)
    return this.repository.update(id, data)
  }

  async delete(id: string): Promise<State> {
    const exists = await this.repository.exists(id)
    if (!exists) throw new NotFoundError("State", id)
    return this.repository.delete(id)
  }

  async exists(id: string): Promise<boolean> {
    return this.repository.exists(id)
  }

  async count(): Promise<number> {
    return this.repository.count()
  }

  async paginate(params?: PaginationParams): Promise<PaginatedResult<State>> {
    return this.repository.paginate(params)
  }

  async search(params: SearchParams & PaginationParams): Promise<PaginatedResult<State>> {
    if (!params.query?.trim()) throw new ValidationError("Search query is required")
    return this.repository.search(params)
  }
}
