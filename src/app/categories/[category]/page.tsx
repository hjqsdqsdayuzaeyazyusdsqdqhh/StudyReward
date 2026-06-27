import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { categories, getOpportunitiesByCategory } from "@/lib/placeholders"
import { SectionTitle } from "@/components/ui/section-title"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { OpportunityCard } from "@/components/ui/opportunity-card"
import { ListingSidebar } from "@/components/ui/listing-sidebar"
import { Pagination } from "@/components/ui/pagination"
import { EmptyState } from "@/components/ui/empty-state"
import { TagPills } from "@/components/ui/tag-pills"
import { Separator } from "@/components/ui/separator"
import { RelatedCategories, RelatedGuides } from "@/components/discovery"
import { generateMetadata as genMeta, jsonLdBreadcrumbList, jsonLdCollectionPage } from "@/lib/seo"

interface Props {
  params: Promise<{ category: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateStaticParams() {
  return categories.map((cat) => ({ category: cat.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const cat = categories.find((c) => c.slug === category)
  if (!cat) return { title: "Category Not Found" }
  return genMeta({
    title: `${cat.name} - Paid Research Opportunities | StudyReward`,
    description: `Browse ${cat.count.toLocaleString()} paid ${cat.name.toLowerCase()} research opportunities across the United States. Find legitimate paid studies near you.`,
    canonical: `/categories/${cat.slug}`,
  })
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params
  const { page } = await searchParams
  const cat = categories.find((c) => c.slug === category)
  if (!cat) notFound()

  const allOpportunities = getOpportunitiesByCategory(category)
  const currentPage = Number(page) || 1
  const perPage = 12
  const paginated = allOpportunities.slice(0, perPage)

  const breadcrumbs = [
    { label: "Categories", href: "/categories" },
    { label: cat.name },
  ]

  const jsonLd = [
    jsonLdBreadcrumbList([{ label: "Home", href: "/" }, ...breadcrumbs]),
    jsonLdCollectionPage(
      `${cat.name} Research Opportunities`,
      cat.description ?? "",
      `/categories/${cat.slug}`
    ),
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={breadcrumbs} />
      <SectionTitle title={cat.name} description={cat.description} />

      <div className="flex flex-col gap-8 lg:flex-row">
        <ListingSidebar />
        <div className="min-w-0 flex-1">
          <TagPills
            items={[
              { label: cat.name, href: `/categories/${cat.slug}` },
            ]}
            className="mb-6"
          />
          {paginated.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2" role="list" aria-label="Opportunities in this category">
              {paginated.map((op) => (
                <div key={op.id} role="listitem"><OpportunityCard opportunity={op} /></div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No opportunities yet"
              description="Check back soon for new listings in this category."
              actionLabel="Browse all categories"
              actionHref="/categories"
            />
          )}
          <Pagination totalItems={allOpportunities.length} itemsPerPage={perPage} />
        </div>
      </div>

      <Separator className="my-16" />
      <div className="space-y-16">
        <RelatedCategories currentSlug={category} />
        <RelatedGuides category={cat.name} />
      </div>
    </div>
  )
}
