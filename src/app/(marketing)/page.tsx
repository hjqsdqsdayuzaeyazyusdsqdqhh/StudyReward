import { Hero } from "@/components/home/hero"
import { PopularCategories } from "@/components/home/popular-categories"
import { FeaturedOpportunities } from "@/components/home/featured-opportunities"
import { BrowseByState } from "@/components/home/browse-by-state"
import { BrowseByCategory } from "@/components/home/browse-by-category"
import { LatestGuides } from "@/components/home/latest-guides"
import { CTASection } from "@/components/home/cta-section"
import { Newsletter } from "@/components/home/newsletter"
import { TrendingTopics, PopularSearches } from "@/components/discovery"
import { Separator } from "@/components/ui/separator"

export default function HomePage() {
  return (
    <>
      <Hero />
      <PopularCategories />
      <FeaturedOpportunities />
      <BrowseByState />
      <BrowseByCategory />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <TrendingTopics />
        <Separator className="my-12" />
        <PopularSearches />
      </section>
      <LatestGuides />
      <CTASection />
      <Newsletter />
    </>
  )
}
