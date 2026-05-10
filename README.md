# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

---

## SEO

The app includes SEO improvements to help search engines and social shares:

- **Per-route meta tags**: Title, description, canonical URL, Open Graph, and Twitter Card tags (via `react-helmet-async` and `src/components/seo/Seo.jsx`).
- **Structured data**: JSON-LD for `Organization` and `WebSite` on every page.
- **`robots.txt`** and **`sitemap.xml`** in `public/` for crawlers.

### Before deploy

1. **Install deps**: `npm install` (adds `react-helmet-async`).
2. **Site URL**: Create `.env` and set `VITE_SITE_URL=https://your-production-domain.com` (no trailing slash). Used for canonical URLs, OG, and structured data.
3. **Social image**: Add `public/og-image.png` (1200×630) for link previews. Alternatively, set `ogImage` in `src/lib/seo-config.js` to a full URL.
4. **Sitemap**: Edit `public/sitemap.xml` and replace `https://yoursite.com` with your production URL.
5. **robots.txt**: Edit `public/robots.txt` and update the `Sitemap:` line to your production URL.
