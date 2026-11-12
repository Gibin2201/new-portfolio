/* ==========================================================================
   GIBIN THOMAS — PORTFOLIO CONFIGURATION, INTERACTIONS & VALIDATION
   ========================================================================== */

(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Helper: Detect Unconfigured Placeholders ---------- */
  function isConfiguredValue(value) {
    if (typeof value !== "string") return false;
    const trimmed = value.trim();
    return Boolean(trimmed) && !trimmed.startsWith("REPLACE_WITH_");
  }

  /* ---------- Project Links & Genuine Screenshots Configuration ----------
   * Update each project below when repository URLs, live demos, or clean
   * dummy-free screenshots are ready:
   * - repoUrl: Full GitHub repository URL (e.g. "https://github.com/Gibin2201/your-repo").
   *            While left as a REPLACE_WITH_* placeholder, cards show "Repository Link Pending"
   *            instead of linking to the general profile.
   * - demoUrl: Full live demo URL (leave "" to keep Live Demo button hidden).
   * - screenshotSrc: Relative path to a genuine screenshot (e.g. "assets/clinic-app.png")
   *                  and also add it to scripts/prepare-dist.mjs PRODUCTION_ASSETS.
   */
  const PROJECTS_CONFIG = {
    "clinic-management": {
      title: "Clinic Management System",
      repoUrl: "REPLACE_WITH_CLINIC_MANAGEMENT_REPO_URL",
      demoUrl: "",
      screenshotSrc: "",
      screenshotAlt: "Clinic Management System application screenshot"
    },
    "sunglasses-ecommerce": {
      title: "Sunglasses E-commerce Website",
      repoUrl: "REPLACE_WITH_SUNGLASSES_ECOMMERCE_REPO_URL",
      demoUrl: "",
      screenshotSrc: "",
      screenshotAlt: "Sunglasses E-commerce Website storefront screenshot"
    },
    "blood-bank": {
      title: "Blood Bank & Donation Management",
      repoUrl: "REPLACE_WITH_BLOOD_BANK_REPO_URL",
      demoUrl: "",
      screenshotSrc: "",
      screenshotAlt: "Blood Bank and Donation Management interface screenshot"
    }
  };

  /* ---------- EmailJS Configuration ----------
   * To enable direct browser form submissions without a backend:
   * 1. Sign up at https://www.emailjs.com/ and create an Email Service & Template
   *    matching form field names: name, email, subject, message.
   * 2. Replace the three REPLACE_WITH_* placeholders below with your real credentials.
   *    The EmailJS v4 browser SDK loads automatically only once valid credentials exist.
   */
  const EMAILJS_CONFIG = {
    publicKey: "REPLACE_WITH_EMAILJS_PUBLIC_KEY",
    serviceId: "REPLACE_WITH_EMAILJS_SERVICE_ID",
    templateId: "REPLACE_WITH_EMAILJS_TEMPLATE_ID"
  };

  const EMAILJS_SDK_URL =
    "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";

  /* ---------- 1. Hydrate Project Links & Screenshots ---------- */
  function createSvgIcon(pathD, viewBox = "0 0 24 24", isStroke = false) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "15");
    svg.setAttribute("height", "15");
    svg.setAttribute("viewBox", viewBox);
    svg.setAttribute("aria-hidden", "true");

    if (isStroke) {
      svg.setAttribute("fill", "none");
      svg.setAttribute("stroke", "currentColor");
      svg.setAttribute("stroke-width", "2");
      svg.setAttribute("stroke-linecap", "round");
      svg.setAttribute("stroke-linejoin", "round");
    } else {
      svg.setAttribute("fill", "currentColor");
    }

    pathD.forEach((d) => {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", d);
      svg.appendChild(path);
    });
    return svg;
  }

  function hydrateProjects() {
    const githubIconPath = [
      "M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"
    ];
    const externalIconPaths = [
      "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
      "M15 3h6v6",
      "M10 14L21 3"
    ];

    document.querySelectorAll("[data-project-id]").forEach((card) => {
      const id = card.getAttribute("data-project-id");
      const cfg = PROJECTS_CONFIG[id];
      if (!cfg) return;

      // Replace architectural preview with genuine screenshot when configured
      const previewContainer = card.querySelector("[data-project-preview]");
      if (previewContainer && isConfiguredValue(cfg.screenshotSrc)) {
        const img = document.createElement("img");
        img.src = cfg.screenshotSrc;
        img.alt = cfg.screenshotAlt || `${cfg.title} screenshot`;
        img.className = "project-screenshot-img";
        img.loading = "lazy";
        img.decoding = "async";
        previewContainer.classList.add("has-screenshot");
        previewContainer.removeAttribute("aria-hidden");
        previewContainer.replaceChildren(img);
      }

      // Render project repository link (or explicit placeholder) + optional live demo
      const linksRow = card.querySelector("[data-project-links]");
      if (!linksRow) return;
      let actionsGroup = linksRow.querySelector(".project-links-actions");
      if (!actionsGroup) {
        actionsGroup = document.createElement("div");
        actionsGroup.className = "project-links-actions";
        linksRow.prepend(actionsGroup);
      }
      actionsGroup.replaceChildren();

      if (isConfiguredValue(cfg.repoUrl)) {
        const repoLink = document.createElement("a");
        repoLink.href = cfg.repoUrl;
        repoLink.target = "_blank";
        repoLink.rel = "noopener noreferrer";
        repoLink.className = "btn btn-secondary btn-sm";
        repoLink.setAttribute("aria-label", `View ${cfg.title} GitHub repository`);
        repoLink.appendChild(createSvgIcon(githubIconPath));
        repoLink.appendChild(document.createTextNode(" GitHub Repo"));
        actionsGroup.appendChild(repoLink);
      } else {
        const placeholderBtn = document.createElement("button");
        placeholderBtn.type = "button";
        placeholderBtn.disabled = true;
        placeholderBtn.className = "btn btn-secondary btn-sm btn-placeholder";
        placeholderBtn.title = `Configure repoUrl for "${id}" in main.js -> PROJECTS_CONFIG`;
        placeholderBtn.appendChild(createSvgIcon(githubIconPath));
        placeholderBtn.appendChild(document.createTextNode(" Repository Link Pending"));
        actionsGroup.appendChild(placeholderBtn);
      }

      if (isConfiguredValue(cfg.demoUrl)) {
        const demoLink = document.createElement("a");
        demoLink.href = cfg.demoUrl;
        demoLink.target = "_blank";
        demoLink.rel = "noopener noreferrer";
        demoLink.className = "btn btn-primary btn-sm";
        demoLink.setAttribute("aria-label", `Open ${cfg.title} live demo`);
        demoLink.appendChild(document.createTextNode("Live Demo "));
        demoLink.appendChild(createSvgIcon(externalIconPaths, "0 0 24 24", true));
        actionsGroup.appendChild(demoLink);
      }
    });
  }

  hydrateProjects();

  /* ---------- 2. Sticky Header & Mobile Navigation ---------- */
  const siteHeader = document.getElementById("site-header");
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));

  function setMenuOpen(isOpen) {
    if (!navMenu || !navToggle) return;
    navMenu.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const nextState = !navMenu.classList.contains("is-open");
      setMenuOpen(nextState);
    });

    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenuOpen(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navMenu.classList.contains("is-open")) {
        setMenuOpen(false);
        navToggle.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (
        navMenu.classList.contains("is-open") &&
        !navMenu.contains(event.target) &&
        !navToggle.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    });
  }

  /* ---------- 3. Header Shadow & Null-Safe Scroll Spy ---------- */
  const sections = Array.from(document.querySelectorAll("main section[id]"));

  function updateHeaderAndActiveLink() {
    const scrollY = window.scrollY;

    if (siteHeader) {
      siteHeader.classList.toggle("scrolled", scrollY > 16);
    }

    if (sections.length === 0 || navLinks.length === 0) return;

    const headerOffset = siteHeader ? siteHeader.offsetHeight + 48 : 120;
    const atPageBottom =
      window.innerHeight + scrollY >= document.documentElement.scrollHeight - 24;

    let currentSectionId = sections[0].getAttribute("id");

    if (atPageBottom) {
      currentSectionId = sections[sections.length - 1].getAttribute("id");
    } else {
      for (const section of sections) {
        const top = section.offsetTop - headerOffset;
        const bottom = top + section.offsetHeight;
        if (scrollY >= top && scrollY < bottom) {
          currentSectionId = section.getAttribute("id");
          break;
        }
      }
    }

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      const isActive = href === `#${currentSectionId}`;
      link.classList.toggle("active-link", isActive);
    });
  }

  window.addEventListener("scroll", updateHeaderAndActiveLink, { passive: true });
  updateHeaderAndActiveLink();

  /* ---------- 4. Lightweight Typing Subtitle ---------- */
  const typedTarget = document.getElementById("typed-subtitle");
  const roles = [
    "MCA Student",
    "Python & Django Developer",
    "PHP & MySQL Builder",
    "Problem Solver"
  ];

  if (typedTarget) {
    if (prefersReducedMotion) {
      typedTarget.textContent = roles[0];
    } else {
      let roleIndex = 0;
      let charIndex = roles[0].length;
      let isDeleting = false;

      const tick = () => {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
          charIndex -= 1;
          typedTarget.textContent = currentRole.slice(0, charIndex);

          if (charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(tick, 400);
            return;
          }
          setTimeout(tick, 45);
        } else {
          charIndex += 1;
          typedTarget.textContent = currentRole.slice(0, charIndex);

          if (charIndex === currentRole.length) {
            isDeleting = true;
            setTimeout(tick, 2000);
            return;
          }
          setTimeout(tick, 85);
        }
      };

      setTimeout(() => {
        isDeleting = true;
        tick();
      }, 2200);
    }
  }

  /* ---------- 5. Moderate Scroll Reveal (IntersectionObserver) ---------- */
  const revealElements = Array.from(document.querySelectorAll(".reveal"));

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((el) => el.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -32px 0px"
      }
    );

    revealElements.forEach((el) => observer.observe(el));
  }

  /* ---------- 6. Contact Form Validation & EmailJS Integration ---------- */
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  const submitBtn = document.getElementById("submit-btn");

  const fields = {
    name: {
      input: document.getElementById("contact-name"),
      error: document.getElementById("error-name"),
      validate: (val) => (val.trim().length >= 2 ? "" : "Please enter your name (at least 2 characters).")
    },
    email: {
      input: document.getElementById("contact-email"),
      error: document.getElementById("error-email"),
      validate: (val) => {
        const trimmed = val.trim();
        if (!trimmed) return "Please enter your email address.";
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)
          ? ""
          : "Please enter a valid email address.";
      }
    },
    subject: {
      input: document.getElementById("contact-subject"),
      error: document.getElementById("error-subject"),
      validate: (val) => (val.trim().length >= 3 ? "" : "Please enter a subject (at least 3 characters).")
    },
    message: {
      input: document.getElementById("contact-message"),
      error: document.getElementById("error-message"),
      validate: (val) => (val.trim().length >= 10 ? "" : "Please enter a message (at least 10 characters).")
    }
  };

  function validateField(key) {
    const field = fields[key];
    if (!field || !field.input || !field.error) return true;
    const errorMsg = field.validate(field.input.value);
    field.error.textContent = errorMsg;
    field.input.classList.toggle("is-invalid", Boolean(errorMsg));
    field.input.setAttribute("aria-invalid", String(Boolean(errorMsg)));
    return !errorMsg;
  }

  function isEmailJsConfigured() {
    return (
      isConfiguredValue(EMAILJS_CONFIG.publicKey) &&
      isConfiguredValue(EMAILJS_CONFIG.serviceId) &&
      isConfiguredValue(EMAILJS_CONFIG.templateId)
    );
  }

  function loadEmailJsSdk() {
    if (typeof window.emailjs !== "undefined") {
      return Promise.resolve(window.emailjs);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = EMAILJS_SDK_URL;
      script.async = true;
      script.onload = () => {
        if (typeof window.emailjs !== "undefined") {
          resolve(window.emailjs);
        } else {
          reject(new Error("EmailJS SDK loaded without global object."));
        }
      };
      script.onerror = () => reject(new Error("Failed to load EmailJS SDK."));
      document.head.appendChild(script);
    });
  }

  function showFormStatus(type, text, mailtoHref) {
    if (!formStatus) return;
    formStatus.hidden = false;
    formStatus.className = `form-status is-${type}`;
    formStatus.textContent = text;

    if (mailtoHref) {
      const br = document.createElement("br");
      const link = document.createElement("a");
      link.href = mailtoHref;
      link.className = "form-status-link";
      link.textContent = "Open your email client with this message";
      formStatus.appendChild(br);
      formStatus.appendChild(link);
    }
  }

  if (contactForm) {
    Object.keys(fields).forEach((key) => {
      const field = fields[key];
      if (!field.input) return;
      field.input.addEventListener("input", () => {
        if (field.input.classList.contains("is-invalid")) {
          validateField(key);
        }
      });
    });

    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const results = Object.keys(fields).map((key) => validateField(key));
      if (results.includes(false)) {
        const firstInvalid = Object.values(fields).find(
          (f) => f.input && f.input.classList.contains("is-invalid")
        );
        if (firstInvalid && firstInvalid.input) {
          firstInvalid.input.focus();
        }
        showFormStatus("error", "Please fix the highlighted fields before sending.");
        return;
      }

      const nameVal = fields.name.input.value.trim();
      const emailVal = fields.email.input.value.trim();
      const subjectVal = fields.subject.input.value.trim();
      const messageVal = fields.message.input.value.trim();

      const mailtoBody = `From: ${nameVal} (${emailVal})\n\n${messageVal}`;
      const mailtoUrl =
        `mailto:gibinthomas2201@gmail.com?subject=${encodeURIComponent(subjectVal)}` +
        `&body=${encodeURIComponent(mailtoBody)}`;

      if (!isEmailJsConfigured()) {
        showFormStatus(
          "info",
          "Form validated! Direct browser submission requires configuring EmailJS credentials (publicKey, serviceId, templateId) in main.js.",
          mailtoUrl
        );
        return;
      }

      try {
        if (submitBtn) submitBtn.disabled = true;
        const emailjsClient = await loadEmailJsSdk();
        emailjsClient.init({ publicKey: EMAILJS_CONFIG.publicKey });
        await emailjsClient.sendForm(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.templateId,
          contactForm
        );
        showFormStatus("success", "Thank you! Your message has been sent successfully.");
        contactForm.reset();
      } catch (_err) {
        showFormStatus(
          "error",
          "Could not send via EmailJS right now. You can send your message directly using your email app below.",
          mailtoUrl
        );
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  /* ---------- 7. Footer Year ---------- */
  const yearEl = document.getElementById("footer-year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
