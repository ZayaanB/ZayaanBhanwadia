/* Theme, nav, page transitions, effects */
const PAGE_TRANSITION_MS = 400;
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
  const pointer = { x: 0, y: 0, active: false };

  for (let i = 0; i < mistCount; i += 1) {
    const dot = document.createElement("span");
    dot.className = "mist-dot";
    const size = 16 + Math.random() * 20;
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.opacity = "0";
    mistLayer.appendChild(dot);
    trail.push({ dot, x: 0, y: 0, size, speed: 0.2 - i * 0.012 });
  }

  document.addEventListener("pointermove", (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.active = true;
  });
  document.addEventListener("mouseleave", () => { pointer.active = false; });
  document.addEventListener("mouseenter", () => { pointer.active = true; });
  window.addEventListener("blur", () => { pointer.active = false; });

  const render = () => {
    let targetX = pointer.x;
    let targetY = pointer.y;

    trail.forEach((item, index) => {
      const speed = Math.max(0.05, item.speed);
      item.x += (targetX - item.x) * speed;
      item.y += (targetY - item.y) * speed;

      const cx = item.x - item.size / 2;
      const cy = item.y - item.size / 2;
      item.dot.style.left = `${cx}px`;
      item.dot.style.top = `${cy}px`;
      item.dot.style.opacity = pointer.active ? String(((mistCount - index) / mistCount) * 0.7) : "0";

      targetX = item.x;
      targetY = item.y;
    });

    requestAnimationFrame(render);
  };

  render();
}

function initScrollAnimations() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const elements = document.querySelectorAll("[data-animate]");
  if (!elements.length) return;

  const isExperiencePage = document.querySelector(".timeline") !== null;
  const isInView = (el) => {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  };

  const reveal = (el) => el.classList.add("animate-in");

  if (isExperiencePage) {
    elements.forEach(reveal);
    return;
  }

  const observe = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && reveal(e.target)),
    { threshold: 0, rootMargin: "100px 0px 100px 0px" }
  );

  elements.forEach((el) => {
    observe.observe(el);
    if (isInView(el)) reveal(el);
  });
}

function initNavScroll() {
  const nav = document.querySelector(".site-nav");
  if (!nav) return;

  window.addEventListener(
    "scroll",
    () => nav.classList.toggle("scrolled", window.scrollY > 50),
    { passive: true }
  );
}

function initPhotoFlip() {
  const wrap = document.querySelector(".hero-photo-wrap");
  if (!wrap) return;

  wrap.addEventListener("click", (e) => {
    const photo = wrap.querySelector(".hero-photo");
    if (!photo) return;
    photo.classList.remove("flip-tap");
    void photo.offsetWidth;
    photo.classList.add("flip-tap");
    photo.addEventListener(
      "animationend",
      () => photo.classList.remove("flip-tap"),
      { once: true }
    );
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMobileNav();
  initPageTransitions();
  initClickAnimation();
  initMistTrail();
  initScrollAnimations();
  initNavScroll();
  initPhotoFlip();
});