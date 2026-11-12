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
    │   └── main.js             # Navigation drawer, scroll spy, reveal, copy email & form handler
    ├── icons/
    │   ├── favicon.svg         # Browser SVG favicon
    │   ├── logo.svg            # Vector Gibin.dev brand icon
    │   └── logo.png            # 512x512 PNG brand/app & social preview icon
    ├── images/
    │   ├── profile/
    │   │   ├── Gibin.jpg       # Active hero profile photograph
    │   │   └── 20240229_151035.jpg # Original photo (excluded from dist/)
    │   └── archive/            # Archived legacy screenshots (excluded from dist/)
    └── documents/
        └── Gibin Thomas.pdf    # Active downloadable CV
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

