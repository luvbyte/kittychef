const DEFAULT_THEME = "caramellatte";

export const VERSION = "0.0.7"

export function getTheme() {
  return localStorage.getItem("theme") || DEFAULT_THEME;
}

// Apply theme to #main
export const applyTheme = theme => {
  localStorage.setItem("theme", theme);
  document.getElementById("main")?.setAttribute("data-theme", theme);
};
