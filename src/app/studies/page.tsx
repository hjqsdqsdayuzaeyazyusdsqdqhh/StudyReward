import type { Metadata } from "next"
import { opportunities } from "@/lib/placeholders"
import { SectionTitle } from "@/components/ui/section-title"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { OpportunityCard } from "@/components/ui/opportunity-card"
import { ListingSidebar } from "@/components/ui/listing-sidebar"
import { FiltersSidebar } from "@/components/ui/filters-sidebar"
import { Pagination } from "@/components/ui/pagination"
import { EmptyState } from "@/components/ui/empty-state"
import { Separator } from "@/components/ui/separator"
import { RelatedCategories, TrendingTopics } from "@/components/discovery"
import { jsonLdBreadcrumbList, jsonLdCollectionPage } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Browse All Paid Research Studies | StudyReward",
  description: "Browse thousands of paid research opportunities across the United States. Find clinical trials, focus groups, product testing, and more.",
  openGraph: { title: "Browse All Paid Research Studies | StudyReward" },
}

export default async function StudiesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; state?: string; remote?: string; type?: string }>
}) {
  const { page, category, state, remote, type } = await searchParams
  const currentPage = Number(page) || 1
  const perPage = 12

  let filtered = [...opportunities]
  if (category) filtered = filtered.filter((o) => o.categorySlug === category)
  if (state) filtered = filtered.filter((o) => o.stateSlug === state)
  if (remote === "remote") filtered = filtered.filter((o) => o.isRemote)
  if (remote === "in-person") filtered = filtered.filter((o) => !o.isRemote)
  if (type) filtered = filtered.filter((o) => o.type === type)

  const paginated = filtered.slice(0, perPage)

  const jsonLd = [
    jsonLdBreadcrumbList([{ label: "Home", href: "/" }, { label: "Studies" }]),
    jsonLdCollectionPage("All Research Studies", "Browse thousands of paid research opportunities."),
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={[{ label: "Studies" }]} />
      <SectionTitle title="All Research Studies" description={`${filtered.length} opportunities available`} />

      <div className="flex flex-col gap-8 lg:flex-row">
        <FiltersSidebar />
        <div className="flex-1 min-w-0">
          <div className="grid gap-5 sm:grid-cols-2" role="list" aria-label="Research studies">
            {paginated.map((op) => (
              <div key={op.id} role="listitem"><OpportunityCard opportunity={op} /></div>
            ))}
          </div>
          {paginated.length === 0 && (
            <EmptyState
              title="No studies match your filters"
              description="Try adjusting your filter criteria."
              actionLabel="Clear filters"
              actionHref="/studies"
            />
          )}
          <Pagination totalItems={filtered.length} itemsPerPage={perPage} />
        </div>
      </div>

      <Separator className="my-16" />
      <div className="space-y-16">
        <RelatedCategories />
        <TrendingTopics />
      </div>
    </div>
  )
}
