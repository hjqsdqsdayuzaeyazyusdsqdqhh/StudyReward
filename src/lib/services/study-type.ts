import type { IService } from "../interfaces/service"
import type { StudyType } from "@prisma/client"
import type { StudyTypeRepository, CreateStudyTypeInput, UpdateStudyTypeInput } from "../repositories/study-type"
import { NotFoundError } from "../errors/not-found"
import { ValidationError } from "../errors/validation"
import type { PaginatedResult, PaginationParams, SearchParams } from "../types/pagination"

export class StudyTypeService implements IService<StudyType, CreateStudyTypeInput, UpdateStudyTypeInput> {
  constructor(private readonly repository: StudyTypeRepository) {}

  async getAll(): Promise<StudyType[]> {
    return this.repository.findAll()
  }

  async getById(id: string): Promise<StudyType> {
    const studyType = await this.repository.findById(id)
    if (!studyType) throw new NotFoundError("StudyType", id)
    return studyType
  }

  async getBySlug(slug: string): Promise<StudyType> {
    const studyType = await this.repository.findBySlug(slug)
    if (!studyType) throw new NotFoundError("StudyType", slug)
    return studyType
  }

  async getByName(name: string): Promise<StudyType | null> {
    return this.repository.findByName(name)
  }

  async getOrCreateByName(name: string): Promise<StudyType> {
    const existing = await this.repository.findByName(name)
    if (existing) return existing
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
    return this.repository.create({ name, slug })
  }

  async create(data: CreateStudyTypeInput): Promise<StudyType> {
    if (!data.name?.trim()) throw new ValidationError("StudyType name is required")
    if (!data.slug?.trim()) throw new ValidationError("StudyType slug is required")
    return this.repository.create(data)
  }

  async update(id: string, data: UpdateStudyTypeInput): Promise<StudyType> {
    const exists = await this.repository.exists(id)
    if (!exists) throw new NotFoundError("StudyType", id)
    return this.repository.update(id, data)
  }

  async delete(id: string): Promise<StudyType> {
    const exists = await this.repository.exists(id)
    if (!exists) throw new NotFoundError("StudyType", id)
    return this.repository.delete(id)
  }

  async exists(id: string): Promise<boolean> {
    return this.repository.exists(id)
  }

  async count(): Promise<number> {
    return this.repository.count()
  }

  async paginate(params?: PaginationParams): Promise<PaginatedResult<StudyType>> {
    return this.repository.paginate(params)
  }

  async search(params: SearchParams & PaginationParams): Promise<PaginatedResult<StudyType>> {
    if (!params.query?.trim()) throw new ValidationError("Search query is required")
    return this.repository.search(params)
  }
}
