"use client"

import Link from "next/link"
import { useState } from "react"
import { categories, states, guides, companies } from "@/lib/placeholders"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MapPin, FlaskConical, Building2, BookOpen, TrendingUp, ChevronDown } from "lucide-react"

export function ListingSidebar() {
  const [showAllStates, setShowAllStates] = useState(false)
  const visibleStates = showAllStates ? states : states.slice(0, 10)

  return (
    <aside className="w-full shrink-0 lg:w-64" aria-label="Browse sidebar">
      <div className="space-y-6">
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <FlaskConical className="h-4 w-4 text-primary" />
            Categories
          </h3>
          <div className="space-y-1">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="flex items-center justify-between rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {cat.name}
                <span className="text-xs">{cat.count}</span>
              </Link>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <MapPin className="h-4 w-4 text-primary" />
            States
          </h3>
          <div className="space-y-1">
            {visibleStates.map((st) => (
              <Link
                key={st.slug}
                href={`/states/${st.slug}`}
                className="flex items-center justify-between rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {st.name}
                <span className="text-xs">{st.count}</span>
              </Link>
            ))}
          </div>
          {states.length > 10 && (
            <Button variant="ghost" size="sm" className="mt-1 w-full text-xs" onClick={() => setShowAllStates(!showAllStates)}>
              {showAllStates ? "Show less" : `Show all ${states.length} states`}
              <ChevronDown className={`ml-1 h-3 w-3 transition-transform ${showAllStates ? "rotate-180" : ""}`} />
            </Button>
          )}
        </div>

        <Separator />

        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Building2 className="h-4 w-4 text-primary" />
            Companies
          </h3>
          <div className="space-y-1">
            {companies.slice(0, 8).map((c) => (
              <Link
                key={c.slug}
                href={`/companies/${c.slug}`}
                className="block rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {c.name}
              </Link>
            ))}
          </div>
          <Button variant="ghost" size="sm" className="mt-1 w-full text-xs" asChild>
            <Link href="/companies">View all companies</Link>
          </Button>
        </div>

        <Separator />

        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <BookOpen className="h-4 w-4 text-primary" />
            Guides
          </h3>
          <div className="space-y-1">
            {guides.slice(0, 4).map((g) => (
              <Link
                key={g.slug}
                href={`/guides/${g.slug}`}
                className="block rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {g.title}
              </Link>
            ))}
          </div>
          <Button variant="ghost" size="sm" className="mt-1 w-full text-xs" asChild>
            <Link href="/guides">View all guides</Link>
          </Button>
        </div>

        <Separator />

        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <TrendingUp className="h-4 w-4 text-primary" />
            Popular Searches
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {["Clinical Trials", "Remote Studies", "Product Testing", "Focus Groups", "Mock Juries"].map((term) => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="rounded-full border bg-background px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
