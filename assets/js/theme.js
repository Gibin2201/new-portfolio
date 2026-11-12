(() => {
  "use strict";

  const STORAGE_KEY = "gibin-theme";
  let savedTheme = null;

  try {
    savedTheme = window.localStorage.getItem(STORAGE_KEY);
  } catch (_err) {
    savedTheme = null;
  }

  if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", "#0B1120");
    }
  }
})();

