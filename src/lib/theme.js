const DARK_MODE_STORAGE_KEY = "market-dark-mode";

export const getDarkModePreference = () =>
  localStorage.getItem(DARK_MODE_STORAGE_KEY) === "true";

export const setDarkModePreference = (isDarkModeEnabled) => {
  localStorage.setItem(DARK_MODE_STORAGE_KEY, String(isDarkModeEnabled));
};

export const applyDarkMode = (isDarkModeEnabled) => {
  document.documentElement.classList.toggle("dark", isDarkModeEnabled);
};

export const initTheme = () => {
  const saved = localStorage.getItem(DARK_MODE_STORAGE_KEY);
  const isDark =
    saved === "true" ||
    (saved === null &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  applyDarkMode(isDark);
  return isDark;
};

export const toggleDarkMode = () => {
  const nextMode = !document.documentElement.classList.contains("dark");
  setDarkModePreference(nextMode);
  applyDarkMode(nextMode);
  return nextMode;
};
