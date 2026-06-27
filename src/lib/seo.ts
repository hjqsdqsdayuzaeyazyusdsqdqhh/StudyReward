import type { Metadata } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://studyreward.com"

interface SEOInput {
  title: string
  description: string
  slug?: string
  canonical?: string
  noindex?: boolean
  publishedTime?: string
  author?: string
  image?: string
  type?: "website" | "article"
}

export function generateMetadata({
  title,
  description,
  slug,
  canonical,
  noindex,
  publishedTime,
  author,
  image,
  type = "website",
}: SEOInput): Metadata {
  const url = canonical || (slug ? `${siteUrl}${slug}` : siteUrl)

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url,
      type,
      siteName: "StudyReward",
      ...(publishedTime && { publishedTime }),
      ...(author && { authors: [author] }),
      ...(image && {
        images: [{ url: image, width: 1200, height: 630, alt: title }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image && { images: [image] }),
    },
  }
}

export function jsonLdOrganization() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "StudyReward",
    url: siteUrl,
    logo: `${siteUrl}/favicon.ico`,
    description: "Your trusted directory for discovering legitimate paid research opportunities across the United States.",
    foundingDate: "2026",
    contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: "support@studyreward.com" },
    sameAs: ["https://twitter.com/studyreward", "https://facebook.com/studyreward"],
  }
}

export function jsonLdWebSite() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "StudyReward",
    url: siteUrl,
    description: "Find paid research opportunities across the United States.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}

export function jsonLdBreadcrumbList(items: { label: string; href?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href && { item: `${siteUrl}${item.href}` }),
    })),
  }
}

export function jsonLdCollectionPage(name: string, description: string, path?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: path ? `${siteUrl}${path}` : siteUrl,
    isPartOf: { "@type": "WebSite", name: "StudyReward", url: siteUrl },
  }
}

export function jsonLdArticle(title: string, description: string, date: string, author: string, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    author: { "@type": "Person", name: author },
    datePublished: date,
    dateModified: date,
    url: `${siteUrl}/guides/${slug}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}/guides/${slug}` },
  }
}

export function jsonLdFAQ(questions: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  }
}

export function slugToLabel(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}
