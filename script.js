const root = document.documentElement;
const header = document.querySelector(".site-header");
const themeToggle = document.querySelector("[data-theme-toggle]");
const year = document.querySelector("[data-year]");
const commands = {
  design: "prompt -> wireframe -> interface -> feedback",
  code: "branch -> patch -> review -> refactor",
  ship: "test -> commit -> push -> iterate",
};

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  root.dataset.theme = savedTheme;
}

if (year) {
  year.textContent = new Date().getFullYear();
}

const setHeaderState = () => {
  if (!header) return;
  header.dataset.elevated = String(window.scrollY > 10);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

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

document.querySelectorAll("[data-command]").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.command;
    const output = document.querySelector("[data-command-output]");

    document
      .querySelectorAll("[data-command]")
      .forEach((item) => item.classList.toggle("is-active", item === button));

    if (output && key && commands[key]) {
      output.textContent = commands[key];
    }
  });
});
