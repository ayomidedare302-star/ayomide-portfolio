
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const progressBar = document.getElementById("page-progress");
const backToTop = document.getElementById("back-to-top");
const typedRole = document.getElementById("typed-role");

// Mobile navigation
function closeMenu() {
  if (!navLinks || !menuToggle) return;

  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
}

if (menuToggle && navLinks) {
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
}

// Current year
const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// Scroll progress and back-to-top
function updateScrollUI() {
  if (progressBar) {
    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress = scrollableHeight > 0
      ? (window.scrollY / scrollableHeight) * 100
      : 0;

    progressBar.style.width = `${progress}%`;
  }

  if (backToTop) {
    backToTop.classList.toggle("show", window.scrollY > 450);
  }
}

window.addEventListener("scroll", updateScrollUI, { passive: true });
updateScrollUI();

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

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

// Animate the role text
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

// CONTACT FORM - FORMSPREE
const contactForm = document.getElementById("contact-form");
const contactStatus = document.getElementById("contact-status");
const contactSubmit = document.getElementById("contact-submit");

if (contactForm && contactStatus && contactSubmit) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const endpoint = contactForm.getAttribute("action");

    // Check whether the real Formspree endpoint has been added
    if (
      !endpoint ||
      endpoint.includes("YOUR_FORM_ID") ||
      !endpoint.startsWith("https://formspree.io/f/")
    ) {
      contactStatus.textContent =
        "Please configure your Formspree endpoint before sending.";
      contactStatus.className = "contact-status error";
      return;
    }

    const originalButtonText = contactSubmit.textContent;

    contactSubmit.disabled = true;
    contactSubmit.textContent = "Sending...";
    contactStatus.textContent = "";
    contactStatus.className = "contact-status";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: new FormData(contactForm),
        headers: {
          Accept: "application/json"
        }
      });

      const result = await response.json();

      if (response.ok) {
        contactStatus.textContent =
          "Thank you! Your message has been sent successfully.";
        contactStatus.className = "contact-status success";
        contactForm.reset();
      } else {
        const errorMessage = result.errors
          ? result.errors.map((error) => error.message).join(" ")
          : "Your message could not be sent. Please try again.";

        contactStatus.textContent = errorMessage;
        contactStatus.className = "contact-status error";
      }
    } catch (error) {
      contactStatus.textContent =
        "A connection error occurred. Please check your internet and try again.";
      contactStatus.className = "contact-status error";
    } finally {
      contactSubmit.disabled = false;
      contactSubmit.textContent = originalButtonText;
    }
  });
}
