import { writable } from "svelte/store";

export const nightMode = createNightMode();

function createNightMode() {
  let enabled = false;
  const on = localStorage.getItem("dark-mode") || "false";
  enabled = on === "true";
  if (enabled) {
    enableStyles();
  }
  const { subscribe, set } = writable(enabled);
  return {
    subscribe,
    toggle: () => {
      const on = localStorage.getItem("dark-mode") || "false";
      if (on == "true") {
        localStorage.setItem("dark-mode", "false");
        disableStyles();
        set(false);
      } else {
        localStorage.setItem("dark-mode", "true");
        enableStyles();
        set(true);
      }
    },
  };
}

function disableStyles() {
  const darkLink = document.getElementById("dark-theme");
  if (darkLink) {
    darkLink.remove();
  }
}

function enableStyles() {
  let darkLink = document.getElementById("dark-theme");
  darkLink = document.createElement("link");
  darkLink.setAttribute("rel", "stylesheet");
  darkLink.id = "dark-theme";
  darkLink.setAttribute("href", "https://unpkg.com/bulma-prefers-dark");
  document.head.appendChild(darkLink);
}
