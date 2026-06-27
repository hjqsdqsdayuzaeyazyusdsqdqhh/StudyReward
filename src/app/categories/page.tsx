import type { Metadata } from "next"
import Link from "next/link"
import { categories } from "@/lib/placeholders"
import { SectionTitle } from "@/components/ui/section-title"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { CategoryCard } from "@/components/ui/category-card"

export const metadata: Metadata = {
  title: "Browse Research Categories | StudyReward",
  description: "Explore paid research opportunities by category. Find clinical trials, focus groups, product testing, medical studies, and more.",
  openGraph: { title: "Browse Research Categories | StudyReward", description: "Explore paid research opportunities by category." },
}

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Categories" }]} />
      <SectionTitle title="Research Categories" description="Browse paid research opportunities by category" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  )
}
