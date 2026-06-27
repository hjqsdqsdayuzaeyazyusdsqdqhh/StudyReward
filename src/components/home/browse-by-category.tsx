"use client"

import { useState } from "react"
import Link from "next/link"
import { categories } from "@/lib/placeholders"
import { ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function BrowseByCategory() {
  const [selected, setSelected] = useState(categories[0].slug)

  const category = categories.find((c) => c.slug === selected)
  const opportunities = [
    { id: "1", title: `${category?.name} Research Study - Los Angeles`, compensation: "$150-$500", location: "Los Angeles, CA" },
    { id: "2", title: `${category?.name} Paid Participation Program`, compensation: "$200-$750", location: "New York, NY" },
    { id: "3", title: `${category?.name} Study - Remote Available`, compensation: "$50-$300", location: "Remote" },
  ]

  return (
    <section className="bg-muted/50 py-16 sm:py-24" aria-labelledby="browse-category-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="browse-category-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
            Explore by Category
          </h2>
          <p className="mt-4 text-muted-foreground">
            Select a category to see available opportunities
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <Button
              key={cat.slug}
              variant={selected === cat.slug ? "default" : "outline"}
              size="sm"
              onClick={() => setSelected(cat.slug)}
            >
              {cat.name}
            </Button>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {opportunities.map((op) => (
            <Card key={op.id} className="group cursor-pointer transition-colors hover:border-primary/50">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-medium leading-snug">{op.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{op.location}</p>
                  </div>
                  <Badge variant="secondary" className="shrink-0">{op.compensation}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" asChild>
            <Link href={`/categories/${selected}`}>
              View All {category?.name}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
