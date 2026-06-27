import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { cities, getOpportunitiesByCity, states } from "@/lib/placeholders"
import { SectionTitle } from "@/components/ui/section-title"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { OpportunityCard } from "@/components/ui/opportunity-card"
import { ListingSidebar } from "@/components/ui/listing-sidebar"
import { Pagination } from "@/components/ui/pagination"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { RelatedCities, PopularSearches } from "@/components/discovery"
import { generateMetadata as genMeta, jsonLdBreadcrumbList, jsonLdCollectionPage } from "@/lib/seo"
import { ArrowLeft } from "lucide-react"

interface Props {
  params: Promise<{ city: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateStaticParams() {
  return cities.map((c) => ({ city: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params
  const c = cities.find((x) => x.slug === city)
  if (!c) return { title: "City Not Found" }
  return genMeta({
    title: `Paid Research Opportunities in ${c.name}, ${c.state}`,
    description: `Discover ${c.count.toLocaleString()} paid research studies, clinical trials, and focus groups in ${c.name}, ${c.state}. Find legitimate paid research opportunities near you.`,
    canonical: `/cities/${c.slug}`,
  })
}

export default async function CityPage({ params, searchParams }: Props) {
  const { city } = await params
  const { page } = await searchParams
  const c = cities.find((x) => x.slug === city)
  if (!c) notFound()

  const allOpportunities = getOpportunitiesByCity(city)
  const currentPage = Number(page) || 1
  const perPage = 12
  const paginated = allOpportunities.slice(0, perPage)

  const breadcrumbs = [
    { label: "Cities", href: "/cities" },
    { label: `${c.name}, ${c.state}` },
  ]

  const jsonLd = [
    jsonLdBreadcrumbList([{ label: "Home", href: "/" }, ...breadcrumbs]),
    jsonLdCollectionPage(
      `Research Opportunities in ${c.name}, ${c.state}`,
      `Find paid research studies in ${c.name}, ${c.state}.`,
      `/cities/${c.slug}`
    ),
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={breadcrumbs} />
      <div className="mb-2">
        <Button variant="link" size="sm" className="p-0 text-muted-foreground" asChild>
          <Link href={`/states/${c.stateSlug}`}>
            <ArrowLeft className="mr-1 h-3 w-3" />
            Browse all {c.state} opportunities
          </Link>
        </Button>
      </div>
      <SectionTitle
        title={`Paid Research in ${c.name}`}
        description={`${c.count} opportunities in ${c.name}, ${c.state}`}
      />

      <div className="flex flex-col gap-8 lg:flex-row">
        <ListingSidebar />
        <div className="min-w-0 flex-1">
          {paginated.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2" role="list" aria-label="Opportunities in this city">
              {paginated.map((op) => (
                <div key={op.id} role="listitem"><OpportunityCard opportunity={op} /></div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No opportunities in this city"
              description="New opportunities are added regularly."
              actionLabel="Browse all cities"
              actionHref="/cities"
            />
          )}
          <Pagination totalItems={allOpportunities.length} itemsPerPage={perPage} />
        </div>
      </div>

      <Separator className="my-16" />
      <div className="space-y-16">
        <RelatedCities currentSlug={city} stateSlug={c.stateSlug} />
        <PopularSearches />
      </div>
    </div>
  )
}
