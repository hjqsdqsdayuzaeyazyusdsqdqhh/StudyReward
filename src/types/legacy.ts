export interface StateData {
  name: string
  slug: string
  abbreviation: string
  count: number
}

export interface CityData {
  name: string
  slug: string
  state: string
  stateSlug: string
  count: number
}

export interface CompanyData {
  id: string
  name: string
  slug: string
  description: string
  studyCount: number
  types: string[]
  locations: string[]
}

export interface Category {
  name: string
  slug: string
  icon: string
  count: number
  description?: string
  id?: string
}

export interface StudyOpportunity {
  id: string
  title: string
  slug: string
  description: string
  category: string
  categorySlug: string
  compensation: string
  compensationRange: { min: number; max: number }
  provider: string
  providerSlug: string
  type: string
  state: string
  stateSlug: string
  city: string
  citySlug: string
  isRemote: boolean
  featured: boolean
  status: "active" | "upcoming" | "filled"
  postedDate: string
  url?: string
}

export interface Guide {
  id: string
  title: string
  slug: string
  description: string
  category: string
  date: string
  author: string
  readTime: string
}

export interface BreadcrumbItem {
  label: string
  href?: string
}
