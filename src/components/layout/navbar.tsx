"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SearchCommand } from "@/components/search/search-command"

const navLinks = [
  {
    label: "Browse Studies",
    href: "/studies",
    children: [
      { label: "Focus Groups", href: "/focus-groups" },
      { label: "Clinical Trials", href: "/clinical-trials" },
      { label: "Medical Studies", href: "/medical-studies" },
      { label: "Product Testing", href: "/product-testing" },
      { label: "Mock Juries", href: "/mock-jury-studies" },
    ],
  },
  { label: "Categories", href: "/categories" },
  { label: "By State", href: "/states" },
  { label: "Companies", href: "/companies" },
  { label: "Guides", href: "/guides" },
]

export function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2" aria-label="StudyReward home">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              SR
            </div>
            <span className="hidden font-bold sm:inline-block">StudyReward</span>
          </Link>
          <div className="hidden md:flex md:gap-1">
            {navLinks.map((link) => {
              if (link.children) {
                return (
                  <div key={link.href} className="relative group">
                    <button
                      className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                      onMouseEnter={() => setDropdownOpen(true)}
                      onMouseLeave={() => setDropdownOpen(false)}
                      aria-haspopup="true"
                      aria-expanded={dropdownOpen}
                    >
                      {link.label}
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                    <div
                      className="absolute left-0 top-full z-50 w-56 origin-top-left rounded-lg border bg-popover p-1.5 shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all"
                      role="menu"
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="flex rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                          role="menuitem"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="hidden h-9 w-64 justify-start gap-2 text-sm text-muted-foreground sm:flex"
            onClick={() => setSearchOpen(true)}
            aria-label="Open search"
          >
            <Search className="h-4 w-4" />
            <span>Search studies, categories...</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            onClick={() => setSearchOpen(true)}
            aria-label="Open search"
          >
            <Search className="h-5 w-5" />
          </Button>

          <ThemeToggle />

          <div className="md:hidden">
            <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col gap-6 pt-6">
                  <Link href="/" className="flex items-center gap-2 font-bold" onClick={() => setMobileNavOpen(false)}>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                      SR
                    </div>
                    StudyReward
                  </Link>
                  <div className="flex flex-col gap-1">
                    <div className="space-y-1">
                      <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Study Types</p>
                      {["Focus Groups", "Clinical Trials", "Medical Studies", "Product Testing", "Mock Juries"].map((label) => {
                        const slug = label.toLowerCase().replace(/\s+/g, "-")
                        return (
                          <Link key={slug} href={`/${slug}`} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground" onClick={() => setMobileNavOpen(false)}>
                            {label}
                          </Link>
                        )
                      })}
                    </div>
                    <div className="mt-3 space-y-1">
                      <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Browse</p>
                      {[
                        { label: "All Categories", href: "/categories" },
                        { label: "All States", href: "/states" },
                        { label: "All Cities", href: "/cities" },
                        { label: "All Companies", href: "/companies" },
                        { label: "Guides", href: "/guides" },
                      ].map((item) => (
                        <Link key={item.href} href={item.href} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground" onClick={() => setMobileNavOpen(false)}>
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  )
}
