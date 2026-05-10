export const THEME_VARIABLES = [
  "--primary",
  "--primary-foreground",
  "--secondary",
  "--secondary-foreground",
  "--accent",
  "--accent-foreground",
  "--background",
  "--foreground",
  "--card",
  "--card-foreground",
  "--popover",
  "--popover-foreground",
  "--muted",
  "--muted-foreground",
  "--border",
  "--input",
  "--ring",
  "--font-heading",
  "--font-body",
];
const DARK_MODE_STORAGE_KEY = "market-dark-mode";

const hexToRgb = (hexColor) => {
  const cleanedHex = hexColor.replace("#", "");
  const bigint = parseInt(cleanedHex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
};

const rgbToHsl = ({ r, g, b }) => {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;

  let h = 0;
  if (delta) {
    if (max === rn) {
      h = ((gn - bn) / delta) % 6;
    } else if (max === gn) {
      h = (bn - rn) / delta + 2;
    } else {
      h = (rn - gn) / delta + 4;
    }
  }

  h = Math.round(h * 60);
  if (h < 0) h += 360;

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return {
    h,
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

const toHslVariable = (hexColor) => {
  const hsl = rgbToHsl(hexToRgb(hexColor));
  return `${hsl.h} ${hsl.s}% ${hsl.l}%`;
};

const getTextColorHex = (hexColor) => {
  const { r, g, b } = hexToRgb(hexColor);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#1f1f1f" : "#ffffff";
};

const shiftLightness = (hexColor, amount) => {
  const hsl = rgbToHsl(hexToRgb(hexColor));
  const nextLightness = Math.max(4, Math.min(96, hsl.l + amount));
  return `${hsl.h} ${hsl.s}% ${nextLightness}%`;
};

const fgHex = (palette) => palette.foreground || "#1f1f1f";

function applyPaletteLight(root, palette) {
  root.style.setProperty("--primary", toHslVariable(palette.primary));
  root.style.setProperty(
    "--primary-foreground",
    toHslVariable(getTextColorHex(palette.primary))
  );
  root.style.setProperty("--secondary", toHslVariable(palette.secondary));
  root.style.setProperty(
    "--secondary-foreground",
    toHslVariable(getTextColorHex(palette.secondary))
  );
  root.style.setProperty("--accent", toHslVariable(palette.accent));
  root.style.setProperty(
    "--accent-foreground",
    toHslVariable(getTextColorHex(palette.accent))
  );
  root.style.setProperty("--background", toHslVariable(palette.background));
  root.style.setProperty("--foreground", toHslVariable(fgHex(palette)));
  root.style.setProperty(
    "--card",
    shiftLightness(palette.background, 2)
  );
  root.style.setProperty(
    "--card-foreground",
    toHslVariable(fgHex(palette))
  );
  root.style.setProperty(
    "--popover",
    shiftLightness(palette.background, 3)
  );
  root.style.setProperty(
    "--popover-foreground",
    toHslVariable(fgHex(palette))
  );
  root.style.setProperty("--muted", shiftLightness(palette.secondary, 5));
  root.style.setProperty(
    "--muted-foreground",
    shiftLightness(fgHex(palette), 18)
  );
  root.style.setProperty("--border", shiftLightness(palette.secondary, -8));
  root.style.setProperty("--input", shiftLightness(palette.secondary, -4));
  root.style.setProperty("--ring", toHslVariable(palette.primary));
}

/** Dark UI derived from same admin picks (hue family), not fixed theme.css `.dark`. */
function applyPaletteDark(root, palette) {
  const p = palette.primary;
  const sCol = palette.secondary;
  const aCol = palette.accent;
  const bg = palette.background;
  const foreground = fgHex(palette);

  root.style.setProperty(
    "--background",
    shiftLightness(bg, -Math.min(rgbToHsl(hexToRgb(bg)).l + 5, 86))
  );
  root.style.setProperty(
    "--foreground",
    shiftLightness(foreground, Math.max(72, 90 - rgbToHsl(hexToRgb(foreground)).l))
  );
  root.style.setProperty("--card", shiftLightness(bg, -78));
  root.style.setProperty(
    "--card-foreground",
    shiftLightness(foreground, Math.max(70, 88 - rgbToHsl(hexToRgb(foreground)).l))
  );
  root.style.setProperty("--popover", shiftLightness(bg, -76));
  root.style.setProperty(
    "--popover-foreground",
    shiftLightness(foreground, Math.max(70, 88 - rgbToHsl(hexToRgb(foreground)).l))
  );

  const primaryHsl = rgbToHsl(hexToRgb(p));
  const primaryL = Math.min(64, Math.max(44, primaryHsl.l + 14));
  const primaryResolved = `${primaryHsl.h} ${primaryHsl.s}% ${primaryL}%`;
  root.style.setProperty("--primary", primaryResolved);
  root.style.setProperty(
    "--primary-foreground",
    primaryL > 52 ? toHslVariable("#1a1a1a") : toHslVariable("#fafafa")
  );

  root.style.setProperty("--secondary", shiftLightness(sCol, -42));
  root.style.setProperty(
    "--secondary-foreground",
    shiftLightness(foreground, Math.max(65, 86 - rgbToHsl(hexToRgb(foreground)).l))
  );
  root.style.setProperty("--accent", shiftLightness(aCol, -8));
  root.style.setProperty(
    "--accent-foreground",
    shiftLightness(foreground, Math.max(62, 85 - rgbToHsl(hexToRgb(foreground)).l))
  );
  root.style.setProperty("--muted", shiftLightness(sCol, -36));
  root.style.setProperty(
    "--muted-foreground",
    shiftLightness(foreground, 36)
  );
  root.style.setProperty("--border", shiftLightness(sCol, -48));
  root.style.setProperty("--input", shiftLightness(sCol, -44));
  root.style.setProperty("--ring", primaryResolved);
}

export const getResolvedDarkMode = (palette) => {
  if (!palette) return false;

  if (palette.allowDarkMode === true || palette.darkMode === true) {
    const savedPreference = localStorage.getItem(DARK_MODE_STORAGE_KEY);
    if (savedPreference === "true" || savedPreference === "false") {
      return savedPreference === "true";
    }
  }

  return palette.darkMode === true;
};

export const setDarkModePreference = (isDarkModeEnabled) => {
  localStorage.setItem(DARK_MODE_STORAGE_KEY, String(isDarkModeEnabled));
};

export const applyThemePalette = (palette, resolvedDarkMode) => {
  const root = document.documentElement;

  if (!palette) {
    THEME_VARIABLES.forEach((variableName) => {
      root.style.removeProperty(variableName);
    });
    root.classList.remove("dark");
    return;
  }

  if (resolvedDarkMode === true) {
    applyPaletteDark(root, palette);
  } else {
    applyPaletteLight(root, palette);
  }

  root.style.setProperty(
    "--font-heading",
    palette.fontHeading || '"Cormorant Garamond", "Georgia", serif'
  );
  root.style.setProperty(
    "--font-body",
    palette.fontBody || '"DM Sans", "Segoe UI", system-ui, sans-serif'
  );

  root.classList.toggle("dark", resolvedDarkMode === true);
};
