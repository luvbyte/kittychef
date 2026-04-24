// Default Theme
const DEFAULT_THEME = "catppuccino";

// KittyChef Version
export const VERSION = "0.1.1";

// Get theme from localStorage or Default Theme
export function getTheme() {
  return localStorage.getItem("kittychef-theme") || DEFAULT_THEME;
}

// Apply theme to #main element
export const applyTheme = theme => {
  localStorage.setItem("kittychef-theme", theme);
  document.getElementById("kittychef-main")?.setAttribute("data-theme", theme);
};
