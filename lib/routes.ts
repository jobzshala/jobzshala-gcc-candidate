/**
 * Every internal route/anchor target this app links to, in one place — the
 * `lib/api/` pattern (one file per concern, nothing calls a raw literal)
 * applied to navigation instead of API calls. A path typo here is a type
 * error at every call site instead of a silent dead link at one of them.
 *
 * `PUBLIC_ROUTES` in `lib/seo.ts` (sitemap.xml + the human-readable sitemap
 * page) reads its `path` values from here too, so the two can't drift apart.
 */
export const ROUTES = {
  home: "/",
  aboutUs: "/about-us",
  contactUs: "/contact-us",
  pricing: "/pricing",
  faq: "/faq",
  solutions: "/solutions",
  sitemap: "/sitemap",
  sitemapXml: "/sitemap.xml",
  successStories: "/success-stories",
  status: "/status",
  blog: "/blog",
  blogPost: (slug: string) => `/blog/${slug}`,

  login: "/login",
  register: "/register",
  /** `role` pre-selects the RoleToggle on the register page. */
  registerAs: (role: "candidate" | "employer") => `/register?role=${role}`,
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  changePassword: "/change-password",

  // Flat top-level paths (no shared /dashboard prefix) — all share the
  // (app) route group's layout/shell, see app/(app)/layout.tsx.
  journey: "/journey",
  profile: "/profile",
  // #hash anchors into My Profile's sections — every one of DetailCard's
  // section `id`s (PersonalInfoCard.tsx, CareerProfileCard.tsx, etc.) has a
  // matching entry here so nothing links to a hash with no matching id.
  profilePersonalDetails: "/profile#personal-details",
  profileSummary: "/profile#profile-summary",
  profileCareerPreference: "/profile#career-preference",
  profileEmployment: "/profile#employment",
  profileEducation: "/profile#education",
  profileLanguages: "/profile#languages",
  profileResume: "/profile#resume",
  profileVideo: "/profile#video",
  profileDocuments: "/profile#documents",
  matches: "/matches",
  applications: "/applications",
  interviews: "/interviews",
  subscription: "/subscription",
  documents: "/documents",

  privacyPolicy: "/privacy-policy",
  termsConditions: "/terms-conditions",
  refundPolicy: "/refund-policy",
  cookiePolicy: "/cookie-policy",

  solutionsRecruitment: "/solutions/recruitment-solutions",
  solutionsWorkforceInfrastructure: "/solutions/workforce-infrastructure",
  solutionsAiMatching: "/solutions/ai-matching",
  solutionsCandidateVerification: "/solutions/candidate-verification",
  solutionsVisaAssistance: "/solutions/visa-assistance",

  // Sibling employer app (jobzshala-gcc-employer), served under /hire on the
  // same domain — see that repo's next.config.ts `basePath`.
  employerHome: "/hire",
  employerLogin: "/hire/login",
  employerRegister: "/hire/register",
} as const;

/** mailto: links used in footers/legal pages — same "one place" reasoning as
 *  ROUTES, kept separate since these aren't in-app navigation. */
export const MAILTO = {
  support: "mailto:support@jobzshala.com",
  legal: "mailto:legal@jobzshala.com",
  privacy: "mailto:privacy@jobzshala.com",
} as const;
