import Link from "next/link"
import { Separator } from "@/components/ui/separator"

const footerLinks = {
  discover: {
    title: "Discover",
    links: [
      { label: "Browse Studies", href: "/studies" },
      { label: "Focus Groups", href: "/focus-groups" },
      { label: "Clinical Trials", href: "/clinical-trials" },
      { label: "Medical Studies", href: "/medical-studies" },
      { label: "Product Testing", href: "/product-testing" },
      { label: "Mock Juries", href: "/mock-jury-studies" },
    ],
  },
  browse: {
    title: "Browse",
    links: [
      { label: "Categories", href: "/categories" },
      { label: "States", href: "/states" },
      { label: "Cities", href: "/cities" },
      { label: "Companies", href: "/companies" },
      { label: "Popular Searches", href: "/popular" },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { label: "Guides & Tips", href: "/guides" },
      { label: "Safety Tips", href: "/guides/safety" },
      { label: "FAQ", href: "/faq" },
      { label: "Search", href: "/search" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" },
    ],
  },
}

export function Footer() {
  return (
    <footer className="border-t bg-background" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2" aria-label="StudyReward home">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                SR
              </div>
              <span className="font-bold">StudyReward</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              Your trusted directory for discovering legitimate paid research opportunities across the United States.
            </p>
          </div>
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold">{section.title}</h3>
              <ul className="mt-3 space-y-2" role="list">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} StudyReward. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            StudyReward is a directory and does not conduct research studies. Always verify opportunities independently.
          </p>
        </div>
      </div>
    </footer>
  )
}
