# Gibin.dev — Developer Portfolio

Personal developer portfolio for **Gibin Thomas** (MCA student & Full-Stack Developer). Built with semantic HTML5, modern CSS, vanilla JavaScript, and Netlify Forms, with a clean static build pipeline targeting `dist/`.

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
    │   └── style.css           # Design tokens, components, animations & responsive rules
    ├── js/
    │   └── main.js             # Navigation drawer, scroll spy, reveal, copy email, back-to-top & form handler
    ├── icons/
    │   ├── favicon.svg         # Browser SVG favicon
    │   ├── logo.svg            # Vector Gibin.dev brand icon
    │   └── logo.png            # 512x512 PNG brand/app icon
    ├── images/
    │   ├── certifications/     # Verified certificate images integrated into #certifications
    │   ├── education/          # Verified campus photographs for Education entries
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

