/**
 * Emits a JSON-LD structured-data block. Server component on purpose — the
 * markup has to be in the HTML the crawler receives, not injected after
 * hydration, or search engines and AI answer engines that don't run JS miss it.
 */
export default function JsonLd({ schema }: { schema: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // Content is built by lib/seo.ts from our own data, never from user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
