const root = document.documentElement;
const themeToggle = document.querySelector("[data-theme-toggle]");
const year = document.querySelector("[data-year]");
const tabButtons = [...document.querySelectorAll("[data-tab]")];
const tabPanels = [...document.querySelectorAll("[data-panel]")];
const tabLinks = [...document.querySelectorAll("[data-tab-link]")];

const validTabs = new Set(tabPanels.map((panel) => panel.dataset.panel));

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  root.dataset.theme = savedTheme;
}

if (year) {
  year.textContent = new Date().getFullYear();
}

const activateTab = (tab, updateHash = true) => {
  if (!validTabs.has(tab)) return;

  tabButtons.forEach((button) => {
    const active = button.dataset.tab === tab;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });

  tabPanels.forEach((panel) => {
    const active = panel.dataset.panel === tab;
    panel.classList.toggle("is-active", active);
    panel.hidden = !active;
  });

  if (updateHash) {
    history.replaceState(null, "", `#${tab}`);
  }
};

const initialTab = location.hash.replace("#", "");
activateTab(validTabs.has(initialTab) ? initialTab : "info", false);

tabButtons.forEach((button) => {
  button.addEventListener("click", () => activateTab(button.dataset.tab));
});

tabLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const tab = link.dataset.tabLink;
    if (!validTabs.has(tab)) return;
    event.preventDefault();
    activateTab(tab);
  });
});

window.addEventListener("hashchange", () => {
  const tab = location.hash.replace("#", "");
  if (validTabs.has(tab)) {
    activateTab(tab, false);
  }
});

themeToggle?.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "" : "dark";
  if (nextTheme) {
    root.dataset.theme = nextTheme;
    localStorage.setItem("theme", nextTheme);
  } else {
    delete root.dataset.theme;
    localStorage.removeItem("theme");
  }
});
