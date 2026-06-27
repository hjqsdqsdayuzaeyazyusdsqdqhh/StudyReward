import type { CompanyData } from "@/types"
import data from "@/data/companies.json"

const companiesData = data as CompanyData[]

export const companies: CompanyData[] = companiesData

export function getCompanyBySlug(slug: string) {
  return companies.find((c) => c.slug === slug)
}
