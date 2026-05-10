import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { SEO_CONFIG, getSeoForPath } from "@/lib/seo-config";

function getOgImageUrl() {
  const base = SEO_CONFIG.siteUrl.replace(/\/$/, "");
  return SEO_CONFIG.ogImage.startsWith("http")
    ? SEO_CONFIG.ogImage
    : base + SEO_CONFIG.ogImage;
}

/**
 * Injects per-route SEO: title, meta description, canonical, Open Graph, Twitter Card,
 * and JSON-LD (Organization + WebSite). Use once inside your app (e.g. App.jsx).
 */
export default function Seo() {
  const { pathname } = useLocation();
  const seo = getSeoForPath(pathname);
  const base = SEO_CONFIG.siteUrl.replace(/\/$/, "");
  const canonical = `${base}${pathname === "/" ? "" : pathname}`;
  const ogImage = getOgImageUrl();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${base}/#organization`,
        name: SEO_CONFIG.siteName,
        url: base,
      },
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        url: base,
        name: SEO_CONFIG.siteName,
        description: SEO_CONFIG.defaultDescription,
        publisher: { "@id": `${base}/#organization` },
        inLanguage: SEO_CONFIG.locale,
      },
    ],
  };

  return (
    <Helmet prioritizeSeoTags>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <link rel="canonical" href={canonical} />
      {seo.noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SEO_CONFIG.siteName} />
      <meta property="og:locale" content={SEO_CONFIG.locale} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={ogImage} />
      {SEO_CONFIG.twitterHandle && (
        <meta name="twitter:site" content={SEO_CONFIG.twitterHandle} />
      )}

      {/* JSON-LD structured data */}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}
