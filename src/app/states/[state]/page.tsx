import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { states, getOpportunitiesByState, cities } from "@/lib/placeholders"
import { SectionTitle } from "@/components/ui/section-title"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { OpportunityCard } from "@/components/ui/opportunity-card"
import { ListingSidebar } from "@/components/ui/listing-sidebar"
import { Pagination } from "@/components/ui/pagination"
import { EmptyState } from "@/components/ui/empty-state"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RelatedStates, PopularSearches } from "@/components/discovery"
import { generateMetadata as genMeta, jsonLdBreadcrumbList, jsonLdCollectionPage } from "@/lib/seo"

interface Props {
  params: Promise<{ state: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateStaticParams() {
  return states.map((st) => ({ state: st.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state } = await params
  const st = states.find((s) => s.slug === state)
  if (!st) return { title: "State Not Found" }
  return genMeta({
    title: `Paid Research Opportunities in ${st.name} (${st.abbreviation})`,
    description: `Discover ${st.count.toLocaleString()} paid research studies, clinical trials, and focus groups in ${st.name}. Browse legitimate paid research opportunities near you in ${st.abbreviation}.`,
    canonical: `/states/${st.slug}`,
  })
}

export default async function StatePage({ params, searchParams }: Props) {
  const { state } = await params
  const { page } = await searchParams
  const st = states.find((s) => s.slug === state)
  if (!st) notFound()

  const allOpportunities = getOpportunitiesByState(state)
  const stateCities = cities.filter((c) => c.stateSlug === state)
  const currentPage = Number(page) || 1
  const perPage = 12
  const paginated = allOpportunities.slice(0, perPage)

  const breadcrumbs = [
    { label: "States", href: "/states" },
    { label: st.name },
  ]

  const jsonLd = [
    jsonLdBreadcrumbList([{ label: "Home", href: "/" }, ...breadcrumbs]),
    jsonLdCollectionPage(
      `Research Opportunities in ${st.name}`,
      `Find paid research studies in ${st.name}.`,
      `/states/${st.slug}`
    ),
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={breadcrumbs} />
      <SectionTitle
        title={`Paid Research in ${st.name}`}
        description={`${st.count.toLocaleString()} opportunities available`}
      />

      <div className="flex flex-col gap-8 lg:flex-row">
        <ListingSidebar />
        <div className="min-w-0 flex-1">
          {stateCities.length > 1 && (
            <div className="mb-8">
              <h3 className="mb-3 text-sm font-semibold">Cities in {st.name}</h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {stateCities.map((c) => (
                  <Link key={c.slug} href={`/cities/${c.slug}`}>
                    <Card className="transition-colors hover:border-primary/50">
                      <CardContent className="p-3 text-center">
                        <span className="text-sm font-medium">{c.name}</span>
                        <p className="text-xs text-muted-foreground">{c.count} studies</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {paginated.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2" role="list" aria-label="Opportunities in this state">
              {paginated.map((op) => (
                <div key={op.id} role="listitem"><OpportunityCard opportunity={op} /></div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No opportunities in this state"
              description="New opportunities are added regularly. Check back soon."
              actionLabel="Browse all states"
              actionHref="/states"
            />
          )}
          <Pagination totalItems={allOpportunities.length} itemsPerPage={perPage} />
        </div>
      </div>

      <Separator className="my-16" />
      <div className="space-y-16">
        <RelatedStates currentSlug={state} />
        <PopularSearches />
      </div>
    </div>
  )
}
