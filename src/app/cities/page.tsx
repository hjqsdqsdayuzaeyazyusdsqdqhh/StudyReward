import type { Metadata } from "next"
import Link from "next/link"
import { cities, states } from "@/lib/placeholders"
import { SectionTitle } from "@/components/ui/section-title"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Building2 } from "lucide-react"
import { generateMetadata as genMeta, jsonLdBreadcrumbList, jsonLdCollectionPage } from "@/lib/seo"

export const metadata: Metadata = genMeta({
  title: "Browse Paid Research Opportunities by City",
  description: "Find paid research studies, clinical trials, and focus groups in cities across the United States. Browse opportunities near you.",
  canonical: "/cities",
})

export default function CitiesPage() {
  const breadcrumbs = [{ label: "Cities" }]

  const jsonLd = [
    jsonLdBreadcrumbList([{ label: "Home", href: "/" }, ...breadcrumbs]),
    jsonLdCollectionPage(
      "Research Opportunities by City",
      "Browse paid research studies in cities across the US.",
      "/cities",
    ),
  ]

  const grouped = states
    .map((st) => ({
      state: st,
      cities: cities.filter((c) => c.stateSlug === st.slug),
      total: cities.filter((c) => c.stateSlug === st.slug).reduce((sum, c) => sum + c.count, 0),
    }))
    .filter((g) => g.cities.length > 0)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={breadcrumbs} />
      <SectionTitle
        title="Browse by City"
        description={`Explore paid research opportunities in cities across the US`}
      />

      <div className="space-y-10">
        {grouped.map((g) => (
          <section key={g.state.slug} aria-labelledby={`state-${g.state.slug}`}>
            <div className="mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              <Link
                href={`/states/${g.state.slug}`}
                className="text-lg font-semibold hover:text-primary"
              >
                {g.state.name}
              </Link>
              <span className="text-sm text-muted-foreground">
                ({g.total.toLocaleString()} studies)
              </span>
            </div>
            <div
              className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4"
              role="list"
              aria-label={`Cities in ${g.state.name}`}
            >
              {g.cities.map((c) => (
                <Link key={c.slug} href={`/cities/${c.slug}`} role="listitem">
                  <Card className="transition-colors hover:border-primary/50">
                    <CardContent className="flex items-center gap-3 p-4">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-medium">{c.name}</span>
                        <p className="text-xs text-muted-foreground">{c.count} studies</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
