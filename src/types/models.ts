export interface StateType {
  id: string
  name: string
  slug: string
  abbreviation: string
  createdAt: Date
  updatedAt: Date
}

export interface CityType {
  id: string
  stateId: string
  name: string
  slug: string
  createdAt: Date
  updatedAt: Date
}

export interface CategoryType {
  id: string
  name: string
  slug: string
  icon: string
  description: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CompanyType {
  id: string
  name: string
  slug: string
  logo: string | null
  website: string | null
  description: string | null
  createdAt: Date
  updatedAt: Date
}

export interface StudyTypeType {
  id: string
  name: string
  slug: string
  createdAt: Date
  updatedAt: Date
}

export interface OpportunityType {
  id: string
  title: string
  slug: string
  shortDescription: string
  description: string | null
  companyId: string
  categoryId: string
  studyTypeId: string
  stateId: string
  cityId: string
  compensation: string
  compensationType: "Fixed" | "Hourly" | "Range" | "Negotiable"
  online: boolean
  featured: boolean
  status: "Active" | "Upcoming" | "Filled"
  eligibility: string | null
  postedDate: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface GuideType {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string | null
  categoryId: string
  createdAt: Date
  updatedAt: Date
}

export interface FAQType {
  id: string
  opportunityId: string | null
  question: string
  answer: string
  createdAt: Date
  updatedAt: Date
}

export interface TagType {
  id: string
  name: string
  slug: string
  createdAt: Date
  updatedAt: Date
}
