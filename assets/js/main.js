/* ==========================================================================
   GIBIN.DEV — PORTFOLIO INTERACTIONS & NETLIFY FORM VALIDATION
   ========================================================================== */

(() => {
  "use strict";

  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let prefersReducedMotion = reducedMotionQuery.matches;

  /* ---------- 1. Sticky Header & Mobile Navigation ---------- */
  const siteHeader = document.getElementById("site-header");
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const mainContent = document.getElementById("main-content");
  const siteFooter = document.querySelector(".site-footer");
  const desktopNavMedia = window.matchMedia("(min-width: 1041px)");

  function getDrawerFocusableElements() {
    if (!navMenu || !navToggle) return [];
    const menuItems = Array.from(
      navMenu.querySelectorAll("a[href], button:not([disabled])")
    );
    return [navToggle, ...menuItems];
  }

  function setMenuOpen(isOpen) {
    if (!navMenu || !navToggle) return;
    const openState = Boolean(isOpen) && !desktopNavMedia.matches;
    navMenu.classList.toggle("is-open", openState);
    navToggle.setAttribute("aria-expanded", String(openState));

    if ("inert" in HTMLElement.prototype) {
      if (mainContent) mainContent.inert = openState;
      if (siteFooter) siteFooter.inert = openState;
    }
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const nextState = !navMenu.classList.contains("is-open");
      setMenuOpen(nextState);
      if (nextState) {
        const firstLink = navMenu.querySelector("a[href]");
        if (firstLink) firstLink.focus();
      }
    });

    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenuOpen(false));
    });

    document.addEventListener("keydown", (event) => {
      if (!navMenu.classList.contains("is-open")) return;

      if (event.key === "Escape") {
        setMenuOpen(false);
        navToggle.focus();
        return;
      }

      if (event.key === "Tab") {
        const focusables = getDrawerFocusableElements();
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
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

    const handleViewportChange = (event) => {
      if (event.matches && navMenu.classList.contains("is-open")) {
        setMenuOpen(false);
      }
    };
    if (typeof desktopNavMedia.addEventListener === "function") {
      desktopNavMedia.addEventListener("change", handleViewportChange);
    } else if (typeof desktopNavMedia.addListener === "function") {
      desktopNavMedia.addListener(handleViewportChange);
    }
    window.addEventListener("resize", () => {
      if (window.innerWidth > 1040 && navMenu.classList.contains("is-open")) {
        setMenuOpen(false);
      }
    }, { passive: true });
  }

  /* ---------- 2. Header Shadow & Null-Safe Scroll Spy (rAF Throttled) ---------- */
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  let scrollTicking = false;

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
        if (scrollY + headerOffset >= section.offsetTop) {
          currentSectionId = section.getAttribute("id");
        }
      }
    }

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      const isActive = href === `#${currentSectionId}`;
      link.classList.toggle("active-link", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function scheduleScrollUpdate() {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(() => {
      updateHeaderAndActiveLink();
      scrollTicking = false;
    });
  }

  window.addEventListener("scroll", scheduleScrollUpdate, { passive: true });
  window.addEventListener("resize", scheduleScrollUpdate, { passive: true });
  updateHeaderAndActiveLink();

  /* ---------- 3. Progressive Scroll Reveal (Lower Sections Only) ---------- */
  const revealElements = Array.from(document.querySelectorAll(".reveal"));
  let revealObserver = null;

  function revealAllSections() {
    document.documentElement.classList.remove("js-animations");
    revealElements.forEach((el) => {
      el.classList.add("is-visible");
      if (revealObserver) revealObserver.unobserve(el);
    });
  }

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealAllSections();
  } else {
    revealElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.94) {
        el.classList.add("is-visible");
      }
    });

    document.documentElement.classList.add("js-animations");

    revealObserver = new IntersectionObserver(
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

    revealElements.forEach((el) => {
      if (!el.classList.contains("is-visible")) {
        revealObserver.observe(el);
      }
    });
  }

  const handleReducedMotionChange = (event) => {
    prefersReducedMotion = event.matches;
    if (prefersReducedMotion) {
      revealAllSections();
    }
  };
  if (typeof reducedMotionQuery.addEventListener === "function") {
    reducedMotionQuery.addEventListener("change", handleReducedMotionChange);
  } else if (typeof reducedMotionQuery.addListener === "function") {
    reducedMotionQuery.addListener(handleReducedMotionChange);
  }

  /* ---------- 4. Copy Email Action ---------- */
  const copyEmailBtn = document.getElementById("copy-email-btn");
  const copyEmailStatus = document.getElementById("copy-email-status");
  let copyResetTimerId = null;

  function copyTextFallback(text) {
    const prevFocus = document.activeElement;
    const helper = document.createElement("textarea");
    helper.value = text;
    helper.setAttribute("readonly", "");
    helper.style.position = "fixed";
    helper.style.top = "-9999px";
    helper.style.left = "-9999px";
    document.body.appendChild(helper);
    helper.focus({ preventScroll: true });
    helper.select();
    helper.setSelectionRange(0, text.length);
    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch (_err) {
      copied = false;
    } finally {
      document.body.removeChild(helper);
      if (prevFocus && typeof prevFocus.focus === "function") {
        prevFocus.focus({ preventScroll: true });
      }
    }
    return copied;
  }

  if (copyEmailBtn) {
    const labelSpan = copyEmailBtn.querySelector("span");
    const defaultLabel = labelSpan ? labelSpan.textContent : "Copy Email";

    copyEmailBtn.addEventListener("click", async () => {
      const emailToCopy =
        copyEmailBtn.getAttribute("data-email") || "gibinthomas2201@gmail.com";
      let succeeded = false;

      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(emailToCopy);
          succeeded = true;
        } catch (_err) {
          succeeded = copyTextFallback(emailToCopy);
        }
      } else {
        succeeded = copyTextFallback(emailToCopy);
      }

      if (copyResetTimerId) {
        window.clearTimeout(copyResetTimerId);
      }

      if (succeeded) {
        copyEmailBtn.classList.add("is-copied");
        if (labelSpan) labelSpan.textContent = "Copied";
        if (copyEmailStatus) {
          copyEmailStatus.classList.remove("is-error");
          copyEmailStatus.textContent = "Email copied!";
        }
      } else if (copyEmailStatus) {
        copyEmailStatus.classList.add("is-error");
        copyEmailStatus.textContent = `Copy unavailable — email ${emailToCopy}`;
      }

      copyResetTimerId = window.setTimeout(() => {
        copyEmailBtn.classList.remove("is-copied");
        if (labelSpan) labelSpan.textContent = defaultLabel;
        if (copyEmailStatus) {
          copyEmailStatus.classList.remove("is-error");
          copyEmailStatus.textContent = "";
        }
      }, 2800);
    });
  }

  /* ---------- 5. Contact Form Validation & Netlify Forms Submission ---------- */
  const CONTACT_EMAIL = "gibinthomas2201@gmail.com";
  const MAX_MAILTO_URL_LENGTH = 1850;
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  const submitBtn = document.getElementById("submit-btn");
  const honeypotInput = document.getElementById("bot-field");
  let isSubmitting = false;

  const fields = {
    name: {
      input: document.getElementById("contact-name"),
      error: document.getElementById("error-name"),
      validate: (val) => {
        const trimmed = val.trim();
        if (trimmed.length < 2) return "Please enter your name (at least 2 characters).";
        if (trimmed.length > 80) return "Name must be 80 characters or fewer.";
        return "";
      }
    },
    email: {
      input: document.getElementById("contact-email"),
      error: document.getElementById("error-email"),
      validate: (val) => {
        const trimmed = val.trim();
        if (!trimmed) return "Please enter your email address.";
        if (trimmed.length > 120) return "Email address must be 120 characters or fewer.";
        if (trimmed.includes("..")) return "Please enter a valid email address.";
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)
          ? ""
          : "Please enter a valid email address.";
      }
    },
    subject: {
      input: document.getElementById("contact-subject"),
      error: document.getElementById("error-subject"),
      validate: (val) => {
        const trimmed = val.trim();
        if (trimmed.length < 3) return "Please enter a subject (at least 3 characters).";
        if (trimmed.length > 140) return "Subject must be 140 characters or fewer.";
        return "";
      }
    },
    message: {
      input: document.getElementById("contact-message"),
      error: document.getElementById("error-message"),
      validate: (val) => {
        const trimmed = val.trim();
        if (trimmed.length < 10) return "Please enter a message (at least 10 characters).";
        if (trimmed.length > 1500) return "Message must be 1500 characters or fewer.";
        return "";
      }
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

  function buildSafeMailtoUrl(nameVal, emailVal, subjectVal, messageVal) {
    const prefix = `From: ${nameVal} (${emailVal})\n\n`;
    const truncationNote = "\n\n[Message shortened to fit email link limits]";
    const makeUrl = (bodyText) =>
      `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subjectVal)}` +
      `&body=${encodeURIComponent(bodyText)}`;

    const fullUrl = makeUrl(`${prefix}${messageVal}`);
    if (fullUrl.length <= MAX_MAILTO_URL_LENGTH) {
      return { url: fullUrl, truncated: false };
    }

    let low = 0;
    let high = messageVal.length;
    let bestUrl = makeUrl(`${prefix}${truncationNote.trimStart()}`);

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const candidateBody = `${prefix}${messageVal.slice(0, mid).trimEnd()}${truncationNote}`;
      const candidateUrl = makeUrl(candidateBody);
      if (candidateUrl.length <= MAX_MAILTO_URL_LENGTH) {
        bestUrl = candidateUrl;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    return { url: bestUrl, truncated: true };
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
      field.input.addEventListener("blur", () => {
        if (field.input.value.trim().length > 0 || field.input.classList.contains("is-invalid")) {
          validateField(key);
        }
      });
    });

    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (isSubmitting) {
        return;
      }

      // Silently stop automated honeypot submissions
      if (honeypotInput && honeypotInput.value.trim() !== "") {
        return;
      }

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
      const mailtoResult = buildSafeMailtoUrl(nameVal, emailVal, subjectVal, messageVal);

      if (window.location.protocol === "file:") {
        const localNotice = mailtoResult.truncated
          ? "Local file preview cannot reach Netlify Forms. Use the email link below (long text trimmed to fit link limits) or test on the deployed site."
          : "Local file preview cannot reach Netlify Forms. Use the email link below or submit on the deployed site.";
        showFormStatus("info", localNotice, mailtoResult.url);
        return;
      }

      try {
        isSubmitting = true;
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.setAttribute("aria-busy", "true");
        }
        showFormStatus("info", "Sending your message...");

        const formData = new FormData(contactForm);
        formData.set("form-name", contactForm.getAttribute("name") || "contact");

        const response = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(formData).toString()
        });

        if (!response.ok) {
          throw new Error(`Form request failed (${response.status})`);
        }

        showFormStatus("success", "Thank you! Your message has been sent successfully.");
        contactForm.reset();
        Object.keys(fields).forEach((key) => {
          const field = fields[key];
          if (field && field.input) {
            field.input.classList.remove("is-invalid");
            field.input.removeAttribute("aria-invalid");
          }
          if (field && field.error) {
            field.error.textContent = "";
          }
        });
      } catch (_err) {
        const errNotice = mailtoResult.truncated
          ? "Could not send directly right now. Please send via your email app below (long text was trimmed to fit email link limits)."
          : "Could not send directly right now. You can send your message using your email app below.";
        showFormStatus("error", errNotice, mailtoResult.url);
      } finally {
        isSubmitting = false;
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.removeAttribute("aria-busy");
        }
      }
    });
  }

  /* ---------- 6. Back to Top Button ---------- */
  const backToTopBtn = document.getElementById("back-to-top");
  if (backToTopBtn) {
    let btTicking = false;
    const syncBackToTop = () => {
      btTicking = false;
      const shouldShow = window.scrollY > 420;
      if (shouldShow) {
        if (backToTopBtn.hasAttribute("hidden")) {
          backToTopBtn.removeAttribute("hidden");
        }
        backToTopBtn.classList.add("is-visible");
      } else {
        backToTopBtn.classList.remove("is-visible");
        backToTopBtn.setAttribute("hidden", "");
      }
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!btTicking) {
          window.requestAnimationFrame(syncBackToTop);
          btTicking = true;
        }
      },
      { passive: true }
    );

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
    });

    syncBackToTop();
  }

  /* ---------- 7. Footer Year ---------- */
  const yearEl = document.getElementById("footer-year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
