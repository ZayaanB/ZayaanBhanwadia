const PAGE_TRANSITION_MS = 300;
const THEME_STORAGE_KEY = "portfolio-theme";

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);

  const toggle = document.getElementById("theme-toggle");
  if (toggle) {
    const nextMode = theme === "dark" ? "Light mode" : "Dark mode";
    toggle.textContent = nextMode;
    toggle.setAttribute("aria-label", `Switch to ${nextMode.toLowerCase()}`);
  }
}

function initTheme() {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  const initialTheme = storedTheme === "light" || storedTheme === "dark" ? storedTheme : "dark";
  setTheme(initialTheme);

  const toggle = document.getElementById("theme-toggle");
  if (!toggle) {
    return;
  }

  toggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem(THEME_STORAGE_KEY, next);
  });
}

function isInternalTransitionLink(link) {
  const href = link.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }

  const url = new URL(href, window.location.href);
  if (url.origin !== window.location.origin) {
    return false;
  }

  const fileName = url.pathname.split("/").pop() || "";
  const looksLikePage = fileName.endsWith(".html") || !fileName.includes(".");
  return looksLikePage;
}

function initPageTransitions() {
  document.body.classList.add("page-enter");

  document.querySelectorAll("a[href]").forEach((link) => {
    if (!isInternalTransitionLink(link)) {
      return;
    }

    link.addEventListener("click", (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        link.target === "_blank" ||
        link.hasAttribute("download")
      ) {
        return;
      }

      const destination = new URL(link.getAttribute("href"), window.location.href);
      if (destination.href === window.location.href) {
        return;
      }

      event.preventDefault();
      document.body.classList.remove("page-enter");
      document.body.classList.add("page-leaving");

      window.setTimeout(() => {
        window.location.href = destination.href;
      }, PAGE_TRANSITION_MS);
    });
  });
}

function initClickAnimation() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  document.addEventListener("click", (event) => {
    const burst = document.createElement("span");
    burst.className = "click-burst";
    burst.style.left = `${event.clientX}px`;
    burst.style.top = `${event.clientY}px`;

    document.body.appendChild(burst);
    burst.addEventListener("animationend", () => burst.remove());
  });
}

function initMistTrail() {
  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    !window.matchMedia("(pointer: fine)").matches
  ) {
    return;
  }

  const mistLayer = document.createElement("div");
  mistLayer.className = "mist-layer";
  document.body.appendChild(mistLayer);

  const mistCount = 12;
  const trail = [];
  const pointer = {
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.5,
    active: false
  };

  for (let i = 0; i < mistCount; i += 1) {
    const dot = document.createElement("span");
    dot.className = "mist-dot";

    const size = 12 + Math.random() * 18;
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.opacity = "0";
    mistLayer.appendChild(dot);

    trail.push({
      dot,
      x: pointer.x,
      y: pointer.y,
      size,
      speed: 0.2 - i * 0.01
    });
  }

  document.addEventListener("mousemove", (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
  });

  document.addEventListener("mouseleave", () => {
    pointer.active = false;
  });

  document.addEventListener("mouseenter", () => {
    pointer.active = true;
  });

  const render = () => {
    let targetX = pointer.x;
    let targetY = pointer.y;

    trail.forEach((item, index) => {
      item.x += (targetX - item.x) * Math.max(0.06, item.speed);
      item.y += (targetY - item.y) * Math.max(0.06, item.speed);

      const baseOpacity = (mistCount - index) / mistCount;
      item.dot.style.opacity = pointer.active ? String(baseOpacity * 0.45) : "0";
      item.dot.style.transform = `translate3d(${item.x - item.size * 0.5}px, ${item.y - item.size * 0.5}px, 0)`;

      targetX = item.x;
      targetY = item.y;
    });

    window.requestAnimationFrame(render);
  };

  render();
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initPageTransitions();
  initClickAnimation();
  initMistTrail();
});