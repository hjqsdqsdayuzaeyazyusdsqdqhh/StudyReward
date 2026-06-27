import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { companies, getOpportunitiesByProvider } from "@/lib/placeholders"
import { SectionTitle } from "@/components/ui/section-title"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { OpportunityCard } from "@/components/ui/opportunity-card"
import { ListingSidebar } from "@/components/ui/listing-sidebar"
import { Pagination } from "@/components/ui/pagination"
import { EmptyState } from "@/components/ui/empty-state"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RelatedCompanies, RelatedStudies } from "@/components/discovery"
import { generateMetadata as genMeta, jsonLdBreadcrumbList, jsonLdCollectionPage } from "@/lib/seo"

interface Props {
  params: Promise<{ company: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateStaticParams() {
  return companies.map((c) => ({ company: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { company } = await params
  const comp = companies.find((c) => c.slug === company)
  if (!comp) return { title: "Company Not Found" }
  return genMeta({
    title: `${comp.name} - Paid Research Studies and Clinical Trials`,
    description: comp.description,
    canonical: `/companies/${comp.slug}`,
  })
}

export default async function CompanyPage({ params, searchParams }: Props) {
  const { company } = await params
  const { page } = await searchParams
  const comp = companies.find((c) => c.slug === company)
  if (!comp) notFound()

  const allOpportunities = getOpportunitiesByProvider(company)
  const currentPage = Number(page) || 1
  const perPage = 12
  const paginated = allOpportunities.slice(0, perPage)

  const breadcrumbs = [
    { label: "Companies", href: "/companies" },
    { label: comp.name },
  ]

  const jsonLd = [
    jsonLdBreadcrumbList([{ label: "Home", href: "/" }, ...breadcrumbs]),
    jsonLdCollectionPage(
      `${comp.name} Research Studies`,
      comp.description,
      `/companies/${comp.slug}`
    ),
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={breadcrumbs} />
      <SectionTitle title={comp.name} description={comp.description} />
      <div className="mb-6 flex flex-wrap gap-2">
        {comp.types.map((t) => (
          <Badge key={t} variant="secondary">{t.replace(/-/g, " ")}</Badge>
        ))}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <ListingSidebar />
        <div className="min-w-0 flex-1">
          {paginated.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2" role="list" aria-label="Company listings">
              {paginated.map((op) => (
                <div key={op.id} role="listitem"><OpportunityCard opportunity={op} /></div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No current listings"
              description="This company has no active opportunities right now."
              actionLabel="Browse all companies"
              actionHref="/companies"
            />
          )}
          <Pagination totalItems={allOpportunities.length} itemsPerPage={perPage} />
        </div>
      </div>

      <Separator className="my-16" />
      <div className="space-y-16">
        <RelatedCompanies currentSlug={company} type={comp.types[0]} />
        <RelatedStudies providerSlug={company} />
      </div>
    </div>
  )
}
