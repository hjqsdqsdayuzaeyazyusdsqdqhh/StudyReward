import type { Category } from "@/types"
import data from "@/data/categories.json"

const categoriesData = data as Category[]

export const categories: Category[] = categoriesData

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug)
}

export function getFeaturedCategories() {
  return categories.filter((c) => c.count > 1000)
}
