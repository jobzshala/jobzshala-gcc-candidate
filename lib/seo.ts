import type { Metadata } from "next";
import { ROUTES } from "./routes";

// Public origin this app is served from. Production is the candidate app at the
// root of the domain (the employer app sits under /hire, admin under /admin —
// see jobzshala-gcc-backend/nginx/nginx.prod.conf), so this is also the origin
// canonicals and the sitemap are built from.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://jobzshala.ae").replace(/\/$/, "");

/**
 * The hosts whose content is meant to be indexed: the apex and its www alias.
 * No other subdomain (dev., staging.) and no other domain qualifies.
 */
export const CANONICAL_HOSTS = ["jobzshala.ae", "www.jobzshala.ae"] as const;

/**
 * True only when this deployment is serving one of the production hosts above.
 *
 * Everything SEO-facing is gated on this: indexability, robots.txt and the
 * sitemap. A staging or preview host must never be indexed or compete with the
 * real site in search results, so non-canonical hosts emit noindex/nofollow and
 * a robots.txt that disallows everything. Set NEXT_PUBLIC_SITE_URL to the
 * deployment's own origin so non-production environments identify themselves.
 *
 * Note: canonical URLs are built from NEXT_PUBLIC_SITE_URL, so whichever of the
 * two production hosts you configure becomes the self-canonical one. Serving
 * both hosts simultaneously without a redirect would split ranking signals
 * between them — point one at the other in nginx and keep this env var set to
 * the survivor.
 */
export const IS_CANONICAL_HOST = (() => {
  try {
    const host = new URL(SITE_URL).host.toLowerCase();
    return (CANONICAL_HOSTS as readonly string[]).includes(host);
  } catch {
    return false;
  }
})();

export const SITE_NAME = "Jobzshala";

export const SITE_TAGLINE = "Building Careers. Powering GCC";

export const SITE_DESCRIPTION =
  "Jobzshala is AI-native workforce infrastructure for the GCC — helping employers across the UAE, Saudi Arabia, Qatar, Oman, Kuwait and Bahrain source, verify, hire, deploy and manage trusted blue-collar workforce, and helping candidates reach genuine GCC opportunities.";

export const GCC_COUNTRIES = [
  "United Arab Emirates",
  "Saudi Arabia",
  "Qatar",
  "Oman",
  "Kuwait",
  "Bahrain",
] as const;

export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Every indexable public route, in one place — consumed by both sitemap.xml
 * (app/sitemap.ts) and the human-readable sitemap page (app/sitemap/page.tsx)
 * so the two can't drift apart. Blog posts are appended dynamically.
 */
export const PUBLIC_ROUTES: {
  path: string;
  label: string;
  group: "Platform" | "Solutions" | "Legal";
  changeFrequency: "weekly" | "monthly" | "yearly";
  priority: number;
}[] = [
  { path: ROUTES.home, label: "Home", group: "Platform", changeFrequency: "weekly", priority: 1 },
  { path: ROUTES.aboutUs, label: "About Us", group: "Platform", changeFrequency: "monthly", priority: 0.7 },
  { path: ROUTES.contactUs, label: "Contact Us", group: "Platform", changeFrequency: "monthly", priority: 0.6 },
  { path: ROUTES.pricing, label: "Pricing", group: "Platform", changeFrequency: "monthly", priority: 0.9 },
  { path: ROUTES.register, label: "Create a GCC Workforce Profile", group: "Platform", changeFrequency: "monthly", priority: 0.9 },
  { path: ROUTES.successStories, label: "Success Stories", group: "Platform", changeFrequency: "weekly", priority: 0.8 },
  { path: ROUTES.status, label: "System Status", group: "Platform", changeFrequency: "weekly", priority: 0.3 },
  { path: ROUTES.blog, label: "Blog", group: "Platform", changeFrequency: "weekly", priority: 0.8 },
  { path: ROUTES.faq, label: "FAQs", group: "Platform", changeFrequency: "monthly", priority: 0.6 },
  { path: ROUTES.login, label: "Candidate Login", group: "Platform", changeFrequency: "yearly", priority: 0.4 },
  { path: ROUTES.sitemap, label: "Sitemap", group: "Platform", changeFrequency: "monthly", priority: 0.3 },
  { path: ROUTES.solutions, label: "Solutions", group: "Solutions", changeFrequency: "monthly", priority: 0.7 },
  {
    path: ROUTES.solutionsRecruitment,
    label: "Recruitment Solutions",
    group: "Solutions",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    path: ROUTES.solutionsWorkforceInfrastructure,
    label: "Workforce Infrastructure",
    group: "Solutions",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  { path: ROUTES.solutionsAiMatching, label: "AI Matching", group: "Solutions", changeFrequency: "monthly", priority: 0.7 },
  {
    path: ROUTES.solutionsCandidateVerification,
    label: "Candidate Verification",
    group: "Solutions",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    path: ROUTES.solutionsVisaAssistance,
    label: "Visa Assistance",
    group: "Solutions",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  { path: ROUTES.privacyPolicy, label: "Privacy Policy", group: "Legal", changeFrequency: "yearly", priority: 0.3 },
  { path: ROUTES.termsConditions, label: "Terms & Conditions", group: "Legal", changeFrequency: "yearly", priority: 0.3 },
  { path: ROUTES.refundPolicy, label: "Refund Policy", group: "Legal", changeFrequency: "yearly", priority: 0.3 },
  { path: ROUTES.cookiePolicy, label: "Cookie Policy", group: "Legal", changeFrequency: "yearly", priority: 0.3 },
];

type PageMetadataInput = {
  title: string;
  description: string;
  /** Route path, e.g. "/pricing". Used for the canonical URL. */
  path: string;
  /** Absolute or site-relative image URL for the social card. */
  image?: string;
  /** Set for article-style pages so the OG type is right. */
  type?: "website" | "article";
  /** Keep this page out of search indexes (auth-only or transient pages). */
  noIndex?: boolean;
  publishedTime?: string;
  authors?: string[];
};

/**
 * Builds a page's metadata with the canonical URL, Open Graph and Twitter card
 * kept in sync, so individual pages only state what's actually different about
 * them. Titles flow through the root layout's title template.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  noIndex = false,
  publishedTime,
  authors,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const images = image ? [{ url: image }] : undefined;
  // Off the apex domain nothing is indexable, whatever the page asked for.
  const blockIndexing = noIndex || !IS_CANONICAL_HOST;

  return {
    title,
    description,
    alternates: { canonical: url },
    ...(blockIndexing ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      type,
      url,
      siteName: SITE_NAME,
      title,
      description,
      ...(images ? { images } : {}),
      ...(publishedTime ? { publishedTime } : {}),
      ...(authors ? { authors } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(images ? { images } : {}),
    },
  };
}

/* ---------------------------------------------------------------------------
 * JSON-LD builders
 *
 * Structured data is what lets search engines show rich results and lets AI
 * answer engines state facts about the business with a citable source, rather
 * than inferring them from prose. Kept as plain builders so pages stay
 * declarative and the shapes are reviewable in one place.
 * ------------------------------------------------------------------------- */

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: "Jobzshala GCC",
    url: SITE_URL,
    logo: absoluteUrl("/images/Jobshala-logo.png"),
    slogan: SITE_TAGLINE,
    description: SITE_DESCRIPTION,
    areaServed: GCC_COUNTRIES.map((name) => ({ "@type": "Country", name })),
    knowsAbout: [
      "Blue-collar recruitment",
      "GCC workforce mobility",
      "Candidate verification",
      "Visa and deployment operations",
      "AI candidate-job matching",
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: ["en", "hi", "ta", "te", "ml", "kn", "ar"],
  };
}

export function serviceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "GCC Workforce Fulfillment",
    serviceType: "Workforce sourcing, verification, hiring and deployment",
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: GCC_COUNTRIES.map((name) => ({ "@type": "Country", name })),
    description:
      "End-to-end workforce fulfillment for GCC employers: AI-assisted sourcing and matching, recruiter-led candidate verification and screening, interview coordination, offer management, and visa, medical, travel and joining operations through to retention follow-up.",
    audience: [
      { "@type": "Audience", audienceType: "GCC employers hiring blue-collar and technical workforce" },
      { "@type": "Audience", audienceType: "Job seekers seeking verified employment in the GCC" },
    ],
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export function articleSchema(post: {
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  authorName: string | null;
  publishedAt: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    url: absoluteUrl(`/blog/${post.slug}`),
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(`/blog/${post.slug}`) },
    ...(post.excerpt ? { description: post.excerpt } : {}),
    ...(post.coverImage ? { image: post.coverImage } : {}),
    ...(post.publishedAt ? { datePublished: post.publishedAt, dateModified: post.publishedAt } : {}),
    author: post.authorName
      ? { "@type": "Person", name: post.authorName }
      : { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function offerCatalogSchema(
  plans: { name: string; price: number | string; billingCycle: string; audience: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Jobzshala Plans",
    url: absoluteUrl("/pricing"),
    provider: { "@id": `${SITE_URL}/#organization` },
    itemListElement: plans.map((plan) => ({
      "@type": "Offer",
      name: plan.name,
      price: typeof plan.price === "string" ? plan.price : String(plan.price),
      priceCurrency: "INR",
      category: plan.audience,
      url: absoluteUrl("/pricing"),
      eligibleCustomerType: plan.audience,
      description: `${plan.name} — billed per ${plan.billingCycle.toLowerCase().replace(/_/g, " ")}.`,
    })),
  };
}
