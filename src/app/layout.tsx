import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/layout/theme-provider"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://studyreward.com"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "StudyReward - Find Paid Research Opportunities in the US",
    template: "%s | StudyReward",
  },
  description:
    "Discover legitimate paid research opportunities including clinical trials, focus groups, product testing, and medical studies across the United States.",
  keywords: [
    "paid research studies",
    "clinical trials",
    "focus groups",
    "product testing",
    "medical studies",
    "mock jury",
    "paid surveys",
    "research opportunities",
  ],
  authors: [{ name: "StudyReward" }],
  creator: "StudyReward",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "StudyReward",
    title: "StudyReward - Find Paid Research Opportunities in the US",
    description:
      "Discover legitimate paid research opportunities including clinical trials, focus groups, product testing, and medical studies across the United States.",
    },
  twitter: {
    card: "summary_large_image",
    site: "@studyreward",
    creator: "@studyreward",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "StudyReward",
  url: siteUrl,
  logo: `${siteUrl}/favicon.ico`,
  description:
    "Your trusted directory for discovering legitimate paid research opportunities across the United States.",
  foundingDate: "2026",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "support@studyreward.com",
  },
  sameAs: [
    "https://twitter.com/studyreward",
    "https://facebook.com/studyreward",
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Skip to main content
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main id="main-content" className="flex-1 scroll-mt-16">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
