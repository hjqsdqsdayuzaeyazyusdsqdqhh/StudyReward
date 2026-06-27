import type { StudyOpportunity } from "@/types"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { SectionTitle } from "@/components/ui/section-title"
import { ListingSidebar } from "@/components/ui/listing-sidebar"
import { OpportunityCard } from "@/components/ui/opportunity-card"
import { Pagination } from "@/components/ui/pagination"
import { EmptyState } from "@/components/ui/empty-state"
import { TagPills } from "@/components/ui/tag-pills"

interface StudyTypePageProps {
  slug: string
  config: { label: string; description: string }
  page?: string
  opportunities: StudyOpportunity[]
}

export function StudyTypePage({ slug, config, page, opportunities: all }: StudyTypePageProps) {
  const currentPage = Number(page) || 1
  const perPage = 12
  const paginated = all.slice(0, perPage)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: config.label }]} />
      <SectionTitle title={config.label} description={config.description} />
      <div className="flex flex-col gap-8 lg:flex-row">
        <ListingSidebar />
        <div className="flex-1 min-w-0">
          <TagPills items={[{ label: config.label, href: `/${slug}` }]} className="mb-6" />
          {paginated.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2" role="list" aria-label={`${config.label} opportunities`}>
              {paginated.map((op) => (
                <div key={op.id} role="listitem"><OpportunityCard opportunity={op} /></div>
              ))}
            </div>
          ) : (
            <EmptyState title="No opportunities currently" actionLabel="Browse all studies" actionHref="/studies" />
          )}
          <Pagination totalItems={all.length} itemsPerPage={perPage} />
        </div>
      </div>
    </div>
  )
}
