// ============================
// Fluid drop on click
// ============================
document.addEventListener("click", (e) => {
  const drop = document.createElement("div");
  drop.classList.add("fluid-drop");

  // Position at click
  drop.style.left = `${e.clientX}px`;
  drop.style.top = `${e.clientY}px`;

  // Randomize size and opacity
  const size = 20 + Math.random() * 20;
  drop.style.width = `${size}px`;
  drop.style.height = `${size}px`;
  drop.style.background = `rgba(79, 140, 255, ${0.2 + Math.random() * 0.2})`;

  document.body.appendChild(drop);

  drop.addEventListener("animationend", () => {
    drop.remove();
  });
});

// ============================
// Page fade transitions
// ============================
document.addEventListener("DOMContentLoaded", () => {
  // Fade in on load
  document.body.style.opacity = 0;
  requestAnimationFrame(() => {
    document.body.style.transition = "opacity 0.6s ease";
    document.body.style.opacity = 1;
  });

  // Fade out on internal link click
  const links = document.querySelectorAll("nav a");
  links.forEach(link => {
    const href = link.getAttribute("href");
    if (!href.startsWith("http")) { // internal links only
      link.addEventListener("click", (e) => {
        e.preventDefault();

        // Fade out
        document.body.style.opacity = 0;

        // Navigate after transition
        setTimeout(() => {
          window.location.href = href;
        }, 600); // match CSS duration
      });
    }
  });
});

// ============================
// Misty purple cursor trail
// ============================
const mistCount = 15;
const trails = [];

for (let i = 0; i < mistCount; i++) {
  const div = document.createElement('div');
  div.classList.add('cursor-mist');
  document.body.appendChild(div);
  trails.push({ el: div, x: 0, y: 0 });
}

let mouse = { x: 0, y: 0 };
document.addEventListener('mousemove', e => {
  // Use clientX/clientY for fixed positioning
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function animateTrail() {
  let x = mouse.x;
  let y = mouse.y;

  trails.forEach((trail, index) => {
    // Smooth follow
    trail.x += (x - trail.x) * 0.25;
    trail.y += (y - trail.y) * 0.25;

    // Apply transform
    trail.el.style.transform = `translate(${trail.x}px, ${trail.y}px)`;

    // Opacity trail effect
    trail.el.style.opacity = 0.7 * ((mistCount - index) / mistCount);

    x = trail.x;
    y = trail.y;
  });

  requestAnimationFrame(animateTrail);
}

animateTrail();

