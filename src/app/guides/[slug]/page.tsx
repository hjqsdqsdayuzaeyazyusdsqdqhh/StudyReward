import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { guides } from "@/lib/placeholders"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, User, Clock, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RelatedCategories } from "@/components/discovery"
import { generateMetadata as genMeta, jsonLdBreadcrumbList, jsonLdArticle } from "@/lib/seo"
import { formatDate } from "@/lib/utils"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const guide = guides.find((g) => g.slug === slug)
  if (!guide) return { title: "Guide Not Found" }
  return genMeta({
    title: guide.title,
    description: guide.description,
    canonical: `/guides/${guide.slug}`,
    publishedTime: guide.date,
    author: guide.author,
    type: "article",
  })
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params
  const guide = guides.find((g) => g.slug === slug)
  if (!guide) notFound()

  const relatedGuides = guides.filter(
    (g) => g.category === guide.category && g.slug !== slug
  )

  const breadcrumbs = [
    { label: "Guides", href: "/guides" },
    { label: guide.title },
  ]

  const jsonLd = [
    jsonLdBreadcrumbList([{ label: "Home", href: "/" }, ...breadcrumbs]),
    jsonLdArticle(
      guide.title,
      guide.description,
      guide.date,
      guide.author,
      guide.slug
    ),
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs items={breadcrumbs} />
      <div className="mb-2">
        <Button
          variant="link"
          size="sm"
          className="p-0 text-muted-foreground"
          asChild
        >
          <Link href="/guides">
            <ArrowLeft className="mr-1 h-3 w-3" />
            Back to guides
          </Link>
        </Button>
      </div>
      <article className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <Badge variant="secondary">{guide.category}</Badge>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(guide.date)}
          </span>
          <span className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            {guide.author}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {guide.readTime} read
          </span>
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          {guide.title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {guide.description}
        </p>
        <Separator className="my-8" />
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <p>
            This is a placeholder guide. Full content will be added in a future
            update.
          </p>
          <p>
            In the meantime, browse our{" "}
            <Link href="/studies" className="text-primary hover:underline">
              available research opportunities
            </Link>{" "}
            or explore{" "}
            <Link href="/guides" className="text-primary hover:underline">
              other guides
            </Link>
            .
          </p>
        </div>
      </article>

      {relatedGuides.length > 0 && (
        <div className="mx-auto mt-16 max-w-3xl">
          <Separator className="mb-8" />
          <h2 className="mb-6 text-xl font-bold">Related Guides</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {relatedGuides.map((g) => (
              <Card key={g.id}>
                <CardHeader>
                  <CardTitle className="text-sm">
                    <Link
                      href={`/guides/${g.slug}`}
                      className="hover:underline"
                    >
                      {g.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {g.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Separator className="my-16" />
      <div className="mx-auto max-w-3xl">
        <RelatedCategories />
      </div>
    </div>
  )
}
