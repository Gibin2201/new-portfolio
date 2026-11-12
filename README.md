# Gibin.dev — Developer Portfolio

Personal developer portfolio for **Gibin Thomas** (MCA student & Full-Stack Developer). Built with semantic HTML5, modern CSS, vanilla JavaScript, and Netlify Forms, with a clean static build pipeline targeting `dist/`.

Live site: `https://gibinthomas.netlify.app/`

## Key Features

- **Preserved Light Theme + Optional Dark Mode:** Defaults to the clean light theme for first-time visitors, with a navbar sun/moon toggle (`#theme-toggle`) that persists explicit dark/light preferences in `localStorage` (`gibin-theme`) and restores them before first paint via `assets/js/theme.js`.
- **Subtle Micro-Interactions & Accessibility:** Progressive scroll-reveal animations (`IntersectionObserver`), gentle card/thumbnail hover states, tactile button transitions, accessible modals with focus management, and full support for `prefers-reduced-motion`.
- **Projects & Details Modals:** Showcases **SmartSpend AI – Expense Tracker** (featured), **Clinic Management System**, and **Personal Developer Portfolio Website** with interactive View Details modals and full-size screenshot previews.
- **Certifications & Privacy:** Displays `9` verified workshops and certifications with a full-size preview lightbox, using a privacy-redacted public copy of the NPTEL Business English Communication certificate.
- **Netlify Contact Form:** Asynchronous `POST` submission with `bot-field` honeypot spam protection, client-side field validation, one-click Copy Email, and a bounded `mailto:` fallback when offline.

## Project Structure

```text
├── index.html                  # Main portfolio page
├── 404.html                    # Custom 404 page
├── netlify.toml                # Build command, publish dir (dist/), CSP & cache headers
├── robots.txt                  # Search crawler rules & sitemap location
├── sitemap.xml                 # Canonical XML sitemap
├── site.config.json            # Production HTTPS URL for canonical, OG, Twitter, robots & sitemap
├── scripts/
│   └── prepare-dist.mjs        # Validates assets/Netlify Forms and builds dist/
└── assets/
    ├── css/
    │   └── style.css           # Light & optional dark theme tokens, micro-interactions & responsive rules
    ├── js/
    │   ├── theme.js            # Pre-paint theme restoration from localStorage (CSP-safe)
    │   └── main.js             # Theme toggle, navigation drawer, scroll spy, reveal, modals, copy email & form handler
    ├── icons/
    │   ├── favicon.svg         # Browser SVG favicon
    │   ├── logo.svg            # Vector Gibin.dev brand icon
    │   └── logo.png            # 512x512 PNG brand/app icon
    ├── images/
    │   ├── certifications/     # Verified certificate images integrated into #certifications
    │   ├── education/          # Verified campus photographs for Education entries
    │   ├── projects/           # Application screenshots for Projects cards and detail modals
    │   ├── profile/
    │   │   ├── Gibin.jpg       # Active hero profile photograph
    │   │   └── 20240229_151035.jpg # Original photo (excluded from dist/)
    │   ├── social/
    │   │   └── og-image.png    # 1200x630 Open Graph / Twitter social preview card
    │   └── archive/            # Archived legacy screenshots (excluded from dist/)
    └── documents/
        └── Gibin Thomas.pdf    # Active downloadable Resume / CV
```

## Build & Deployment

Netlify builds automatically using `netlify.toml`:

- **Build command:** `node scripts/prepare-dist.mjs`
- **Publish directory:** `dist`

To generate `dist/` locally or verify asset references and Netlify Forms configuration:

```bash
node scripts/prepare-dist.mjs
```

Update `site.config.json` before changing the production domain, then re-run `node scripts/prepare-dist.mjs`.

## Contact Form & Netlify Notifications

The contact form (`name="contact"`) uses Netlify Forms (`data-netlify="true"`, `netlify-honeypot="bot-field"`), paired with client-side validation and a bounded `mailto:` fallback when opened offline (`file://`) or unreachable.

To receive email alerts in your inbox for every form submission on Netlify:
1. Open the site dashboard in **Netlify** → **Project configuration** (or **Forms**) → **Notifications**.
2. Choose **Add notification** → **Email notification**.
3. Select event **New form submission**, select form **`contact`**, and enter `gibinthomas2201@gmail.com`.
4. Save and test with a live submission on `https://gibinthomas.netlify.app/`.

