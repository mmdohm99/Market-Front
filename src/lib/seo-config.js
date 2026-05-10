/**
 * SEO configuration — set VITE_SITE_URL in .env when you deploy.
 * Used for canonical URLs, Open Graph, sitemap, and structured data.
 */
const getSiteUrl = () => {
  if (import.meta.env.VITE_SITE_URL)
    return import.meta.env.VITE_SITE_URL.replace(/\/$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "https://yoursite.com";
};

export const SEO_CONFIG = {
  defaultTitle: "Nodum Gallary | Online Store for Fashion & Lifestyle",
  defaultDescription:
    "Shop the latest fashion, footwear, and accessories. Free shipping on orders. Browse Men, Women, Kids & more.",
  siteName: "Nodum Gallary",
  get siteUrl() {
    return getSiteUrl();
  },
  locale: "en_US",
  twitterHandle: "",
  ogImage: "/og-image.png", // Add a 1200x630 image to public/ for social shares
};

/** SEO metadata per route. Keys match pathname or path prefix. */
export const ROUTE_SEO = {
  "/": {
    title: "Nodum Gallary | Online Store",
    description: SEO_CONFIG.defaultDescription,
    noindex: false,
  },
  "/auth/login": {
    title: "Sign In | Nodum Gallary",
    description:
      "Sign in to your account. Manage orders, addresses, and wishlist.",
    noindex: true,
  },
  "/auth/register": {
    title: "Create Account | Nodum Gallary",
    description:
      "Create a new account to shop, save addresses, and track orders.",
    noindex: true,
  },
  "/shop/home": {
    title: "Home | Nodum Gallary – Shop by Category & Brand",
    description: SEO_CONFIG.defaultDescription,
    noindex: false,
  },
  "/shop/listing": {
    title: "All Products | Nodum Gallary",
    description:
      "Browse all products. Filter by category and brand. Sort by price.",
    noindex: false,
  },
  "/shop/search": {
    title: "Search Products | Nodum Gallary",
    description: "Search our catalog. Find fashion, footwear, and accessories.",
    noindex: false,
  },
  /* Product detail titles are overridden by ProductPageSeo; this is the pre-hydration fallback. */
  "/shop/product": {
    title: "Product | Nodum Gallary",
    description: SEO_CONFIG.defaultDescription,
    noindex: false,
  },
  "/shop/checkout": {
    title: "Checkout | Nodum Gallary",
    description: "Complete your order. Secure checkout.",
    noindex: true,
  },
  "/shop/account": {
    title: "My Account | Orders & Addresses | Nodum Gallary",
    description: "View orders, manage addresses, and account settings.",
    noindex: true,
  },
  "/shop/payment-success": {
    title: "Payment Successful | Nodum Gallary",
    description: "Your payment was successful. Thank you for your order.",
    noindex: true,
  },
  "/shop/paymob-return": {
    title: "Processing Payment | Nodum Gallary",
    description: "Please wait while we process your payment.",
    noindex: true,
  },
  "/admin": {
    title: "Admin | Nodum Gallary",
    description: "Admin dashboard.",
    noindex: true,
  },
  "/unauth-page": {
    title: "Access Denied | Nodum Gallary",
    description: "You don't have access to this page.",
    noindex: true,
  },
};

/**
 * Find SEO config for current path. Checks exact match first, then prefix.
 */
export function getSeoForPath(pathname) {
  if (ROUTE_SEO[pathname]) return ROUTE_SEO[pathname];
  if (pathname.startsWith("/admin")) return ROUTE_SEO["/admin"];
  if (pathname.startsWith("/auth/login")) return ROUTE_SEO["/auth/login"];
  if (pathname.startsWith("/auth/register")) return ROUTE_SEO["/auth/register"];
  return {
    title: SEO_CONFIG.defaultTitle,
    description: SEO_CONFIG.defaultDescription,
    noindex: pathname.startsWith("/admin") || pathname.startsWith("/auth"),
  };
}
