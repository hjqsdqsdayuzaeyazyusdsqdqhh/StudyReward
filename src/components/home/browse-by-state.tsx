import Link from "next/link"
import { states } from "@/lib/placeholders"
import { Button } from "@/components/ui/button"

export function BrowseByState() {
  return (
    <section className="py-16 sm:py-24" aria-labelledby="states-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="states-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
            Browse by State
          </h2>
          <p className="mt-4 text-muted-foreground">
            Find paid research opportunities near you
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
          {states.map((state) => (
            <Link
              key={state.abbreviation}
              href={`/states/${state.slug}`}
              className="group relative rounded-lg border p-3 text-center transition-colors hover:border-primary/50 hover:bg-accent"
            >
              <span className="text-sm font-medium">{state.abbreviation}</span>
              <span className="block text-xs text-muted-foreground">{state.count} studies</span>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" asChild>
            <Link href="/states">View All States</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
