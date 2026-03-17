(function () {
  const Z_PATTERN = [
    "01111110",
    "00000110",
    "00001100",
    "00011000",
    "00110000",
    "01100000",
    "01111110",
  ];

  function renderBinaryZ() {
    const el = document.getElementById("binary-z");
    if (!el) return;

    el.innerHTML = "";

    for (let row = 0; row < Z_PATTERN.length; row++) {
      for (let col = 0; col < Z_PATTERN[row].length; col++) {
        const bit = Z_PATTERN[row][col];
        const span = document.createElement("span");
        span.className = `bin-${bit}`;
        span.setAttribute("data-bit", bit);
        span.setAttribute("data-original", bit);
        span.setAttribute("tabindex", "0");
        span.textContent = bit;
        span.addEventListener("mouseenter", () => flipBit(span));
        span.addEventListener("mouseleave", () => restoreBit(span));
        span.addEventListener("focus", () => flipBit(span));
        span.addEventListener("blur", () => restoreBit(span));
        el.appendChild(span);
      }
    }
  }

  function flipBit(el) {
    if (el.classList.contains("flipping")) return;

    const current = el.textContent;
    const next = current === "1" ? "0" : "1";
    runFlipAnimation(el, next);
  }

  function restoreBit(el) {
    const original = el.getAttribute("data-original");
    if (el.classList.contains("flipping")) {
      el.setAttribute("data-pending-restore", "true");
      return;
    }
    runFlipAnimation(el, original);
  }

  function runFlipAnimation(el, nextValue) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = nextValue;
      el.className = `bin-${nextValue}`;
      el.setAttribute("data-bit", nextValue);
      return;
    }

    el.classList.add("flipping", "flip-out");
    el.classList.remove("flip-in");

    const onFlipOutEnd = () => {
      el.classList.remove("flip-out");
      el.textContent = nextValue;
      el.className = `bin-${nextValue} flipping flip-in`;
      el.setAttribute("data-bit", nextValue);

      el.addEventListener(
        "animationend",
        function onFlipInEnd(e) {
          if (e.animationName !== "flipIn") return;
          el.removeEventListener("animationend", onFlipInEnd);
          el.classList.remove("flipping", "flip-in");
          if (el.getAttribute("data-pending-restore") === "true") {
            el.removeAttribute("data-pending-restore");
            restoreBit(el);
          }
        },
        { once: true }
      );
    };

    el.addEventListener(
      "animationend",
      function onFlipOutEndHandler(e) {
        if (e.animationName !== "flipOut") return;
        el.removeEventListener("animationend", onFlipOutEndHandler);
        onFlipOutEnd();
      },
      { once: true }
    );
  }

  document.addEventListener("DOMContentLoaded", renderBinaryZ);
})();
