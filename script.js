const PAGE_TRANSITION_MS = 0.075;
const MOBILE_NAV_BREAKPOINT = 760;
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

function initMobileNav() {
  const nav = document.querySelector(".site-nav");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  if (!nav || !navToggle || !navMenu) {
    return;
  }

  const closeMenu = () => {
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  const openMenu = () => {
    navMenu.classList.add("open");
    navToggle.setAttribute("aria-expanded", "true");
  };

  navToggle.addEventListener("click", () => {
    if (navMenu.classList.contains("open")) {
      closeMenu();
      return;
    }

    openMenu();
  });

  navMenu.querySelectorAll("a[href]").forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  document.addEventListener("click", (event) => {
    if (!navMenu.classList.contains("open")) {
      return;
    }

    if (!nav.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > MOBILE_NAV_BREAKPOINT) {
      closeMenu();
    }
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

  document.addEventListener("pointerdown", (event) => {
    const burst = document.createElement("span");
    burst.className = "click-burst";
    burst.style.left = `${event.clientX}px`;
    burst.style.top = `${event.clientY}px`;
    document.body.appendChild(burst);
    burst.addEventListener("animationend", () => burst.remove(), { once: true });
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

  const mistCount = 10;
  const trail = [];
  const pointer = {
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.5,
    active: false
  };

  for (let i = 0; i < mistCount; i += 1) {
    const dot = document.createElement("span");
    dot.className = "mist-dot";
    const size = 12 + Math.random() * 16;

    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.opacity = "0";
    mistLayer.appendChild(dot);

    trail.push({
      dot,
      x: pointer.x,
      y: pointer.y,
      size,
      speed: 0.2 - i * 0.012
    });
  }

  document.addEventListener("pointermove", (event) => {
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

  window.addEventListener("blur", () => {
    pointer.active = false;
  });

  const render = () => {
    let targetX = pointer.x;
    let targetY = pointer.y;

    trail.forEach((item, index) => {
      const smoothSpeed = Math.max(0.05, item.speed);
      item.x += (targetX - item.x) * smoothSpeed;
      item.y += (targetY - item.y) * smoothSpeed;

      const baseOpacity = (mistCount - index) / mistCount;
      item.dot.style.opacity = pointer.active ? String(baseOpacity * 0.42) : "0";
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
  initMobileNav();
  initPageTransitions();
  initClickAnimation();
  initMistTrail();
});