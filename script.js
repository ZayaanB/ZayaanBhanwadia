/*
===========================================================
File: script.js
Author: Zayaan Bhanwadia
Created: 2026
Description:
  - Fluid drop animation on mouse clicks.
  - Page fade-in/fade-out transitions for internal links.
  - Misty purple cursor trail following the mouse.
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
  drop.style.background = `rgba(79,140,255,${0.2 + Math.random() * 0.2})`;

  document.body.appendChild(drop);
  drop.addEventListener("animationend", () => drop.remove());
});

/* ============================
   Page fade transitions
============================ */
document.addEventListener("DOMContentLoaded", () => {
  document.body.style.opacity = 0;
  requestAnimationFrame(() => {
    document.body.style.transition = "opacity 0.6s ease";
    document.body.style.opacity = 1;
  });

  document.querySelectorAll("nav a").forEach(link => {
    const href = link.getAttribute("href");
    if (!href.startsWith("http")) {
      link.addEventListener("click", e => {
        e.preventDefault();
        document.body.style.opacity = 0;
        setTimeout(() => (window.location.href = href), 600);
      });
    }
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
    speed: 0.2 + Math.random() * 0.25
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
    trail.element.style.opacity = 0.1 * ((mistCount - index) / mistCount);

    const scale = 0.8 + Math.random() * 0.4;
    trail.element.style.width = `${trail.baseSize * scale}px`;
    trail.element.style.height = `${trail.baseSize * scale}px`;

    x = trail.x;
    y = trail.y;
  });

  requestAnimationFrame(animateTrail);
}

animateTrail();
