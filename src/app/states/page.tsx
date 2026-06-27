import type { Metadata } from "next"
import Link from "next/link"
import { states } from "@/lib/placeholders"
import { SectionTitle } from "@/components/ui/section-title"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import { generateMetadata as genMeta, jsonLdBreadcrumbList, jsonLdCollectionPage } from "@/lib/seo"

export const metadata: Metadata = genMeta({
  title: "Browse Paid Research Opportunities by State",
  description: "Find paid research studies, clinical trials, and focus groups in all 50 states. Browse opportunities near you by selecting your state.",
  canonical: "/states",
})

export default function StatesPage() {
  const breadcrumbs = [{ label: "States" }]

  const jsonLd = [
    jsonLdBreadcrumbList([{ label: "Home", href: "/" }, ...breadcrumbs]),
    jsonLdCollectionPage(
      "Research Opportunities by State",
      "Browse paid research studies in every state.",
      "/states",
    ),
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={breadcrumbs} />
      <SectionTitle
        title="Browse by State"
        description={`Explore paid research opportunities in ${states.length} states across the US`}
      />

      <div
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        role="list"
        aria-label="US states"
      >
        {states.map((st) => (
          <Link key={st.slug} href={`/states/${st.slug}`} role="listitem">
            <Card className="transition-colors hover:border-primary/50">
              <CardContent className="flex flex-col items-center gap-2 p-5 text-center">
                <MapPin className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <span className="text-sm font-medium">{st.name}</span>
                <span className="text-xs text-muted-foreground">
                  {st.count.toLocaleString()} studies
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
