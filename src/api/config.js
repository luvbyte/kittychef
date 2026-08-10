// Default Theme
const DEFAULT_THEME = "light";

// Version
export const VERSION = "0.1.2";

export function getTheme() {
  return localStorage.getItem("kittychef-theme_v0_1_2") || DEFAULT_THEME;
}

// Apply theme to #main element
export const applyTheme = theme => {
  localStorage.setItem("kittychef-theme_v0_1_2", theme);
  document.getElementById("kittychef-main")?.setAttribute("data-theme", theme);
  
  return theme
};
