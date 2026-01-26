/*
===========================================================
File: script.js
Author: Zayaan Bhanwadia
Created: 2026
Description:
  - Fluid drop animation on mouse clicks.
  - Page fade-in/fade-out transitions for internal links.
  - Misty purple cursor trail following the mouse.
  - Reactive cursor states for interactive elements.
  - REFINED: Added Light/Dark Mode Toggle Logic.
===========================================================
*/


/* ============================
   Fluid drop on click
============================ */
document.addEventListener("click", e => {
  const drop = document.createElement("div");
  drop.classList.add("fluid-drop");

  drop.style.left = `${e.clientX}px`;
  drop.style.top = `${e.clientY}px`;

  const size = 20 + Math.random() * 20;
  drop.style.width = `${size}px`;
  drop.style.height = `${size}px`;
  
  // Updated to match new Indigo accent palette
  drop.style.background = `rgba(99, 102, 241, ${0.2 + Math.random() * 0.2})`;

  document.body.appendChild(drop);
  drop.addEventListener("animationend", () => drop.remove());
});

/* ============================
   DOM Load Events (Theme & Transitions)
============================ */
document.addEventListener("DOMContentLoaded", () => {
  
  /* --- 1. THEME SWITCHER LOGIC (Added) --- */
  const themeToggle = document.getElementById("theme-toggle");
  const currentTheme = localStorage.getItem("theme");

  // Check saved preference on load
  if (currentTheme === "light") {
    document.documentElement.classList.add("light-mode");
  }

  // Toggle button listener
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.documentElement.classList.toggle("light-mode");
      
      // Save preference
      const newTheme = document.documentElement.classList.contains("light-mode") ? "light" : "dark";
      localStorage.setItem("theme", newTheme);
    });
  }

  /* --- 2. PAGE FADE TRANSITIONS --- */
  document.body.style.opacity = 0;
  requestAnimationFrame(() => {
    document.body.style.transition = "opacity 0.6s ease";
    document.body.style.opacity = 1;
  });

  document.querySelectorAll("nav a").forEach(link => {
    const href = link.getAttribute("href");
    if (href && !href.startsWith("http") && !href.startsWith("#")) {
      link.addEventListener("click", e => {
        e.preventDefault();
        document.body.style.opacity = 0;
        setTimeout(() => (window.location.href = href), 600);
      });
    }
  });

  /* --- 3. REACTIVE CURSOR STATE --- */
  const interactiveElements = document.querySelectorAll('a, .card, button, .btn, .gallery img');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      trails.forEach(trail => {
        // Expand mist and change to indigo accent on hover
        trail.isHovering = true;
        trail.element.style.background = 'rgba(99, 102, 241, 0.45)';
      });
    });

    el.addEventListener('mouseleave', () => {
      trails.forEach(trail => {
        // Shrink mist and return to purple
        trail.isHovering = false;
        trail.element.style.background = 'rgba(180, 120, 255, 0.25)';
      });
    });
  });
});

/* ============================
   Misty cursor trail (advanced)
============================ */
const mistCount = 30;
const trails = [];
const mouse = { x: 0, y: 0 };

for (let i = 0; i < mistCount; i++) {
  const element = document.createElement("div");
  element.classList.add("cursor-mist");

  const size = 15 + Math.random() * 25;
  element.style.width = `${size}px`;
  element.style.height = `${size}px`;
  element.style.opacity = 0.05 + Math.random() * 0.15;

  document.body.appendChild(element);

  trails.push({
    element,
    x: 0,
    y: 0,
    baseSize: size,
    speed: 0.2 + Math.random() * 0.25,
    isHovering: false
  });
}

document.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function animateTrail() {
  let x = mouse.x;
  let y = mouse.y;

  trails.forEach((trail, index) => {
    trail.x += (x - trail.x) * trail.speed;
    trail.y += (y - trail.y) * trail.speed;

    trail.element.style.transform = `translate(${trail.x}px,${trail.y}px)`;
    
    // Smooth opacity falloff
    const baseOpacity = 0.1 * ((mistCount - index) / mistCount);
    trail.element.style.opacity = trail.isHovering ? baseOpacity * 2 : baseOpacity;

    // Scale logic: base jitter + hover expansion
    const jitter = 0.8 + Math.random() * 0.4;
    const hoverScale = trail.isHovering ? 2.5 : 1.0;
    
    const finalWidth = trail.baseSize * jitter * hoverScale;
    const finalHeight = trail.baseSize * jitter * hoverScale;
    
    trail.element.style.width = `${finalWidth}px`;
    trail.element.style.height = `${finalHeight}px`;

    // Trail physics (the "snaking" effect)
    x = trail.x;
    y = trail.y;
  });

  requestAnimationFrame(animateTrail);
}

animateTrail();