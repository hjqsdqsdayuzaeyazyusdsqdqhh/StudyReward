import { BaseRepository } from "./base"
import type { StudyType } from "@prisma/client"
import type { IRepository } from "../interfaces/repository"
import type { PaginatedResult, PaginationParams, SearchParams } from "../types/pagination"

export interface CreateStudyTypeInput {
  name: string
  slug: string
}

export interface UpdateStudyTypeInput {
  name?: string
  slug?: string
}

export class StudyTypeRepository extends BaseRepository implements IRepository<StudyType, CreateStudyTypeInput, UpdateStudyTypeInput> {
  async findAll(): Promise<StudyType[]> {
    try {
      return await this.prisma.studyType.findMany({ orderBy: { name: "asc" } })
    } catch (error) {
      this.handleError(error, "StudyType.findAll")
    }
  }

  async findById(id: string): Promise<StudyType | null> {
    try {
      return await this.prisma.studyType.findUnique({ where: { id } })
    } catch (error) {
      this.handleError(error, "StudyType.findById", { id })
    }
  }

  async findBySlug(slug: string): Promise<StudyType | null> {
    try {
      return await this.prisma.studyType.findUnique({ where: { slug } })
    } catch (error) {
      this.handleError(error, "StudyType.findBySlug", { slug })
    }
  }

  async findByName(name: string): Promise<StudyType | null> {
    try {
      return await this.prisma.studyType.findFirst({ where: { name } })
    } catch (error) {
      this.handleError(error, "StudyType.findByName", { name })
    }
  }

  async create(data: CreateStudyTypeInput): Promise<StudyType> {
    try {
      return await this.prisma.studyType.create({ data })
    } catch (error) {
      this.handleError(error, "StudyType.create", { data })
    }
  }

  async update(id: string, data: UpdateStudyTypeInput): Promise<StudyType> {
    try {
      return await this.prisma.studyType.update({ where: { id }, data })
    } catch (error) {
      this.handleError(error, "StudyType.update", { id, data })
    }
  }

  async delete(id: string): Promise<StudyType> {
    try {
      return await this.prisma.studyType.delete({ where: { id } })
    } catch (error) {
      this.handleError(error, "StudyType.delete", { id })
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const count = await this.prisma.studyType.count({ where: { id } })
      return count > 0
    } catch (error) {
      this.handleError(error, "StudyType.exists", { id })
    }
  }

  async count(): Promise<number> {
    try {
      return await this.prisma.studyType.count()
    } catch (error) {
      this.handleError(error, "StudyType.count")
    }
  }

  async paginate(params?: PaginationParams): Promise<PaginatedResult<StudyType>> {
    try {
      const { page, pageSize, skip, orderBy } = this.parsePaginationParams(params)
      const [data, total] = await Promise.all([
        this.prisma.studyType.findMany({ skip, take: pageSize, orderBy: orderBy ?? { name: "asc" } }),
        this.prisma.studyType.count(),
      ])
      return this.paginateResult(data, total, { page, pageSize })
    } catch (error) {
      this.handleError(error, "StudyType.paginate", { params })
    }
  }

  async search(params: SearchParams & PaginationParams): Promise<PaginatedResult<StudyType>> {
    try {
      const { query, page = 1, pageSize = 20, sortBy, sortOrder } = params
      const skip = (page - 1) * pageSize
      const where = {
        name: { contains: query, mode: "insensitive" as const },
      }
      const orderBy = sortBy ? { [sortBy]: sortOrder ?? "asc" } : { name: "asc" as const }
      const [data, total] = await Promise.all([
        this.prisma.studyType.findMany({ where, skip, take: pageSize, orderBy }),
        this.prisma.studyType.count({ where }),
      ])
      return this.paginateResult(data, total, { page, pageSize })
    } catch (error) {
      this.handleError(error, "StudyType.search", { params })
    }
  }
}
