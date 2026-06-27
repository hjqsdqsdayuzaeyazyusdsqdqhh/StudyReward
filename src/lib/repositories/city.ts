import { BaseRepository } from "./base"
import type { City } from "@prisma/client"
import type { IRepository } from "../interfaces/repository"
import type { PaginatedResult, PaginationParams, SearchParams } from "../types/pagination"

export interface CreateCityInput {
  stateId: string
  name: string
  slug: string
}

export interface UpdateCityInput {
  stateId?: string
  name?: string
  slug?: string
}

export class CityRepository extends BaseRepository implements IRepository<City, CreateCityInput, UpdateCityInput> {
  async findAll(): Promise<City[]> {
    try {
      return await this.prisma.city.findMany({ orderBy: { name: "asc" } })
    } catch (error) {
      this.handleError(error, "City.findAll")
    }
  }

  async findById(id: string): Promise<City | null> {
    try {
      return await this.prisma.city.findUnique({ where: { id } })
    } catch (error) {
      this.handleError(error, "City.findById", { id })
    }
  }

  async findBySlug(slug: string): Promise<City | null> {
    try {
      return await this.prisma.city.findUnique({ where: { slug } })
    } catch (error) {
      this.handleError(error, "City.findBySlug", { slug })
    }
  }

  async create(data: CreateCityInput): Promise<City> {
    try {
      return await this.prisma.city.create({ data })
    } catch (error) {
      this.handleError(error, "City.create", { data })
    }
  }

  async update(id: string, data: UpdateCityInput): Promise<City> {
    try {
      return await this.prisma.city.update({ where: { id }, data })
    } catch (error) {
      this.handleError(error, "City.update", { id, data })
    }
  }

  async delete(id: string): Promise<City> {
    try {
      return await this.prisma.city.delete({ where: { id } })
    } catch (error) {
      this.handleError(error, "City.delete", { id })
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const count = await this.prisma.city.count({ where: { id } })
      return count > 0
    } catch (error) {
      this.handleError(error, "City.exists", { id })
    }
  }

  async count(): Promise<number> {
    try {
      return await this.prisma.city.count()
    } catch (error) {
      this.handleError(error, "City.count")
    }
  }

  async paginate(params?: PaginationParams): Promise<PaginatedResult<City>> {
    try {
      const { page, pageSize, skip, orderBy } = this.parsePaginationParams(params)
      const [data, total] = await Promise.all([
        this.prisma.city.findMany({ skip, take: pageSize, orderBy: orderBy ?? { name: "asc" } }),
        this.prisma.city.count(),
      ])
      return this.paginateResult(data, total, { page, pageSize })
    } catch (error) {
      this.handleError(error, "City.paginate", { params })
    }
  }

  async search(params: SearchParams & PaginationParams): Promise<PaginatedResult<City>> {
    try {
      const { query, page = 1, pageSize = 20, sortBy, sortOrder } = params
      const skip = (page - 1) * pageSize
      const where = {
        name: { contains: query, mode: "insensitive" as const },
      }
      const orderBy = sortBy ? { [sortBy]: sortOrder ?? "asc" } : { name: "asc" as const }
      const [data, total] = await Promise.all([
        this.prisma.city.findMany({ where, skip, take: pageSize, orderBy }),
        this.prisma.city.count({ where }),
      ])
      return this.paginateResult(data, total, { page, pageSize })
    } catch (error) {
      this.handleError(error, "City.search", { params })
    }
  }

  async findByStateId(stateId: string): Promise<City[]> {
    try {
      return await this.prisma.city.findMany({ where: { stateId }, orderBy: { name: "asc" } })
    } catch (error) {
      this.handleError(error, "City.findByStateId", { stateId })
    }
  }

  async findByStateAndName(stateId: string, name: string): Promise<City | null> {
    try {
      return await this.prisma.city.findFirst({ where: { stateId, name } })
    } catch (error) {
      this.handleError(error, "City.findByStateAndName", { stateId, name })
    }
  }
}
