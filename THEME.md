# Theme & styles

The app uses a **single source of truth** for look and feel, tuned for a **handmade products** store. All theme changes happen in one place so updates are straightforward.

---

## Where to change things

| What to change | File | Notes |
|----------------|------|--------|
| **Colors, radii, fonts** | `src/styles/theme.css` | CSS variables for light and dark |
| **Tailwind theme (colors, fonts)** | `tailwind.config.js` | Wires theme vars to Tailwind |
| **Font files** | `index.html` | Google Fonts `<link>`; match `--font-heading` / `--font-body` in `theme.css` |
| **Base styles (body, headings)** | `src/index.css` | Imports theme, applies fonts |
| **Browser theme color** (e.g. mobile tab bar) | `index.html` | `<meta name="theme-color" content="...">`; use a hex that matches your primary or foreground |

---

## `theme.css` quick reference

Colors use **HSL**: `H S% L%` (hue 0–360, saturation %, lightness %).

- **`--background`** / **`--foreground`**: Page and default text
- **`--primary`** / **`--primary-foreground`**: Buttons, main CTAs, header accent
- **`--secondary`** / **`--muted`**: Secondary backgrounds, subtle UI
- **`--accent`**: Highlights, sale badges, ratings
- **`--destructive`**: Errors, remove actions, “out of stock”
- **`--success`**: Active status, confirmed orders
- **`--sale`**: Sale badges, sale price
- **`--border`** / **`--input`** / **`--ring`**: Borders, inputs, focus rings

**Typography**

- **`--font-heading`**: Headings (e.g. Cormorant Garamond)
- **`--font-body`**: Body text (e.g. DM Sans)

**Shape**

- **`--radius`**, **`--radius-sm`**, **`--radius-lg`**: Border radius for components.

Edit the `:root` block for **light** theme and the **`.dark`** block for dark mode.

---

## Changing fonts

1. In **`theme.css`**, set `--font-heading` and `--font-body` (e.g. `"Your Font", fallback, serif`).
2. In **`index.html`**, add or update the Google Fonts `<link>` (or your font provider) to load those families.
3. Restart dev server so `index.css` and Tailwind pick up changes.

---

## Switching to another palette

1. Open **`src/styles/theme.css`**.
2. Replace the HSL values in `:root` (and `.dark` if you use it) with your palette.
3. Use [HSL picker](https://hslpicker.com/) or design tool exports to get `H S% L%` values.
4. Avoid hardcoded colors in components; use `bg-primary`, `text-muted-foreground`, etc., so they follow the theme.

---

## Handmade preset

The default theme is tuned for a **handmade products** store:

- **Primary**: Terracotta / clay (`22 52% 40%`).
- **Background**: Warm cream; **foreground**: Warm brown.
- **Accent**: Amber/tan for highlights and sale.
- **Fonts**: Cormorant Garamond (headings), DM Sans (body).

To adapt for another niche (e.g. tech, luxury), change only the variables in `theme.css` and optionally the fonts; no need to edit components.
