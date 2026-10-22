// Progressive enhancements only: the page is fully readable and navigable without this script.
(function () {
  var root = document.documentElement;

  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }

  // Controls that only work with JS stay hidden until now
  document.querySelectorAll("[data-js-only]").forEach(function (el) { el.hidden = false; });

  // Color theme swatches
  var swatches = document.querySelectorAll("[data-theme-id]");
  function applyTheme(id) {
    root.dataset.theme = id;
    swatches.forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.themeId === id));
    });
  }
  applyTheme(root.dataset.theme);
  swatches.forEach(function (b) {
    b.addEventListener("click", function () {
      applyTheme(b.dataset.themeId);
      store("theme", b.dataset.themeId);
    });
  });

  // Light/dark mode: follows the system until the visitor picks one
  var modeToggle = document.querySelector("[data-mode-toggle]");
  var systemDark = window.matchMedia("(prefers-color-scheme: dark)");
  function isDark() {
    return root.dataset.mode ? root.dataset.mode === "dark" : systemDark.matches;
  }
  function syncMode() {
    if (modeToggle) modeToggle.setAttribute("aria-pressed", String(isDark()));
  }
  syncMode();
  systemDark.addEventListener("change", syncMode);
  if (modeToggle) {
    modeToggle.addEventListener("click", function () {
      var mode = isDark() ? "light" : "dark";
      root.dataset.mode = mode;
      store("mode", mode);
      syncMode();
    });
  }

  // Mobile menu
  var menuToggle = document.querySelector("[data-menu-toggle]");
  var nav = document.getElementById("site-nav");
  if (menuToggle && nav) {
    menuToggle.hidden = false;
    var setMenu = function (open) {
      menuToggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
    };
    menuToggle.addEventListener("click", function () {
      setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest(".nav-links a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setMenu(false);
        menuToggle.focus();
      }
    });
  }

  // Keep the copyright year current even if the site has not been rebuilt this year
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
