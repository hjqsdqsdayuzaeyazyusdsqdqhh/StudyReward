import Link from "next/link"
import { Search, TrendingUp, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/50 pb-16 pt-20 sm:pb-24 sm:pt-32" aria-label="Hero">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full border bg-background px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
            <TrendingUp className="mr-1.5 h-3.5 w-3.5 text-emerald-500" />
            12,000+ paid opportunities listed
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Find Paid Research
            <br />
            <span className="text-primary">Opportunities</span> Across the US
          </h1>

          <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-8 md:text-xl">
            Your trusted directory for discovering legitimate paid focus groups, clinical trials,
            product testing, and medical studies. All opportunities vetted for authenticity.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="xl" className="w-full sm:w-auto" asChild>
              <Link href="/studies">
                <Search className="mr-2 h-5 w-5" />
                Browse Opportunities
              </Link>
            </Button>
            <Button variant="outline" size="xl" className="w-full sm:w-auto" asChild>
              <Link href="/guides">
                <Shield className="mr-2 h-5 w-5" />
                Learn How It Works
              </Link>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              Verified listings
            </span>
            <span className="flex items-center gap-1.5">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              Updated daily
            </span>
            <span className="flex items-center gap-1.5">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              All 50 states
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
