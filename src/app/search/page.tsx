import type { Metadata } from "next"
import Link from "next/link"
import { opportunities, categories, states, guides, studyTypes } from "@/lib/placeholders"
import { SectionTitle } from "@/components/ui/section-title"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { OpportunityCard } from "@/components/ui/opportunity-card"
import { Pagination } from "@/components/ui/pagination"
import { EmptyState } from "@/components/ui/empty-state"
import { TagPills } from "@/components/ui/tag-pills"
import { Filters } from "@/components/ui/filters"
import type { FilterSection } from "@/components/ui/filters"
import { SearchAutocomplete } from "@/components/search/autocomplete"
import { CompensationFilter } from "@/components/search/compensation-filter"

export const metadata: Metadata = {
  title: "Search Research Opportunities | StudyReward",
  description: "Search paid research studies, clinical trials, focus groups, and more across the United States.",
  robots: { index: false, follow: true },
}

interface Props {
  searchParams: Promise<{
    q?: string
    page?: string
    category?: string
    state?: string
    type?: string
    compensationMin?: string
    compensationMax?: string
    remote?: string
  }>
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams
  const query = params.q?.toLowerCase() || ""
  const currentPage = Number(params.page) || 1
  const perPage = 12

  const filterSections: FilterSection[] = [
    {
      id: "category",
      label: "Category",
      type: "single",
      param: "category",
      options: categories.map((c) => ({
        label: c.name,
        value: c.slug,
        count: c.count,
      })),
    },
    {
      id: "state",
      label: "State",
      type: "single",
      param: "state",
      options: states.map((s) => ({
        label: s.name,
        value: s.slug,
        count: s.count,
      })),
    },
    {
      id: "type",
      label: "Study Type",
      type: "single",
      param: "type",
      options: studyTypes.map((t) => ({
        label: t.name,
        value: t.id,
      })),
    },
    {
      id: "remote",
      label: "Location",
      type: "single",
      param: "remote",
      options: [
        { label: "Online / Remote", value: "remote" },
        { label: "In-Person", value: "in-person" },
      ],
    },
  ]

  const minComp = params.compensationMin ? Number(params.compensationMin) : null
  const maxComp = params.compensationMax ? Number(params.compensationMax) : null

  const all = opportunities.filter((o) => {
    if (query) {
      const matchesText =
        o.title.toLowerCase().includes(query) ||
        o.description.toLowerCase().includes(query) ||
        o.category.toLowerCase().includes(query) ||
        o.state.toLowerCase().includes(query) ||
        o.city.toLowerCase().includes(query) ||
        o.provider.toLowerCase().includes(query)
      if (!matchesText) return false
    }

    if (params.category && o.categorySlug !== params.category) return false
    if (params.state && o.stateSlug !== params.state) return false
    if (params.type && o.type !== params.type) return false

    if (params.remote === "remote" && !o.isRemote) return false
    if (params.remote === "in-person" && o.isRemote) return false

    if (minComp !== null && o.compensationRange.max < minComp) return false
    if (maxComp !== null && o.compensationRange.min > maxComp) return false

    return true
  })

  const paginated = all.slice(0, perPage)

  const matchingCategories = query
    ? categories.filter((c) => c.name.toLowerCase().includes(query))
    : []
  const matchingStates = query
    ? states.filter((s) => s.name.toLowerCase().includes(query))
    : []
  const matchingGuides = query
    ? guides.filter(
        (g) =>
          g.title.toLowerCase().includes(query) ||
          g.description.toLowerCase().includes(query)
      )
    : []

  const hasActiveFilters = params.category || params.state || params.type || params.remote || params.compensationMin || params.compensationMax

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Search" }]} />
      <SectionTitle
        title="Search"
        description={
          query
            ? `Results for "${query}"`
            : "Search paid research opportunities"
        }
      />

      <div className="mb-8 max-w-xl">
        <SearchAutocomplete />
      </div>

      {!query && !hasActiveFilters && (
        <div className="py-10 text-center text-muted-foreground">
          Enter a search term or use the filters to find studies, categories,
          states, and more.
        </div>
      )}

      {(query || hasActiveFilters) && (
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex w-full shrink-0 flex-col gap-6 lg:w-64">
            <Filters sections={filterSections} />
            <div className="rounded-lg border bg-card p-5">
              <CompensationFilter />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            {matchingCategories.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-semibold">Categories</h3>
                <TagPills
                  items={matchingCategories.map((c) => ({
                    label: c.name,
                    href: `/categories/${c.slug}`,
                  }))}
                />
              </div>
            )}

            {matchingStates.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-semibold">States</h3>
                <TagPills
                  items={matchingStates.map((s) => ({
                    label: s.name,
                    href: `/states/${s.slug}`,
                  }))}
                />
              </div>
            )}

            {matchingGuides.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-semibold">Guides</h3>
                <div className="flex flex-wrap gap-2">
                  {matchingGuides.map((g) => (
                    <Link
                      key={g.slug}
                      href={`/guides/${g.slug}`}
                      className="rounded-full border bg-background px-3 py-1 text-xs transition-colors hover:bg-accent"
                    >
                      {g.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {paginated.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2" role="list" aria-label="Search results">
                {paginated.map((op) => (
                  <div key={op.id} role="listitem"><OpportunityCard opportunity={op} /></div>
                ))}
              </div>
            ) : (
              <EmptyState
                title={query ? `No results for "${query}"` : "No results found"}
                description="Try different keywords, adjust your filters, or browse categories and states."
                actionLabel="Browse all studies"
                actionHref="/studies"
              />
            )}

            <Pagination totalItems={all.length} itemsPerPage={perPage} />
          </div>
        </div>
      )}
    </div>
  )
}
