
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const progressBar = document.getElementById("page-progress");
const backToTop = document.getElementById("back-to-top");
const typedRole = document.getElementById("typed-role");

// Mobile navigation
function closeMenu() {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
}

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation"
  );
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

// Current year
document.getElementById("year").textContent = new Date().getFullYear();

// Scroll progress and back-to-top
function updateScrollUI() {
  const scrollableHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  const progress = scrollableHeight > 0
    ? (window.scrollY / scrollableHeight) * 100
    : 0;

  progressBar.style.width = `${progress}%`;
  backToTop.classList.toggle("show", window.scrollY > 450);
}

window.addEventListener("scroll", updateScrollUI, { passive: true });
updateScrollUI();

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Reveal elements when they enter the viewport
const revealElements = document.querySelectorAll(".reveal");
const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if ("IntersectionObserver" in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

// Animate the role text without requiring an external library
const roles = [
  "Aspiring Frontend Developer",
  "Computer Science Student",
  "Creative Problem Solver"
];

if (typedRole && !reducedMotion) {
  let roleIndex = 0;
  let charIndex = roles[0].length;
  let deleting = true;

  function typeRole() {
    const currentRole = roles[roleIndex];

    if (deleting) {
      charIndex--;
      typedRole.textContent = currentRole.slice(0, charIndex);

      if (charIndex <= 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeRole, 350);
        return;
      }

      setTimeout(typeRole, 35);
    } else {
      const nextRole = roles[roleIndex];
      charIndex++;
      typedRole.textContent = nextRole.slice(0, charIndex);

      if (charIndex >= nextRole.length) {
        deleting = true;
        setTimeout(typeRole, 1800);
        return;
      }

      setTimeout(typeRole, 65);
    }
  }

  setTimeout(typeRole, 1800);
}
