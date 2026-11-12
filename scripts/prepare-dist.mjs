import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");
const DEFAULT_SITE_URL = "https://gibinthomas.netlify.app";

const CORE_PRODUCTION_FILES = [
  "index.html",
  "404.html",
  "assets/css/style.css",
  "assets/js/main.js",
  "robots.txt",
  "sitemap.xml",
  "assets/documents/Gibin Thomas.pdf",
  "assets/images/profile/Gibin.jpg",
  "assets/images/social/og-image.png",
  "assets/icons/favicon.svg",
  "assets/icons/logo.svg",
  "assets/icons/logo.png"
];

const TEXT_FILES_WITH_SITE_URL = new Set([
  "index.html",
  "robots.txt",
  "sitemap.xml"
]);

const TEXT_FILES_TO_CHECK = [
  "index.html",
  "404.html",
  "assets/css/style.css",
  "assets/js/main.js",
  "robots.txt",
  "sitemap.xml"
];

const EXCLUDED_ASSETS = new Set([
  "assets/images/archive/image.png",
  "assets/images/archive/main.png",
  "assets/images/profile/20240229_151035.jpg"
]);

const EXCLUDED_DIR_PREFIXES = ["backup/", ".vscode/", ".git/", ".netlify/"];

function parseValidHttpsOrigin(rawUrl) {
  if (typeof rawUrl !== "string") return "";
  const trimmed = rawUrl.trim();
  if (!trimmed || trimmed.includes("REPLACE_WITH_")) return "";
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:") {
      throw new Error(`Site URL must use https:// (received: ${trimmed})`);
    }
    return parsed.origin + parsed.pathname.replace(/\/+$/, "");
  } catch (err) {
    throw new Error(`Invalid site URL "${trimmed}": ${err.message}`);
  }
}

function resolveSiteUrl() {
  const configPath = path.join(rootDir, "site.config.json");
  if (fs.existsSync(configPath)) {
    const raw = fs.readFileSync(configPath, "utf8");
    const parsed = JSON.parse(raw);
    const configured = parseValidHttpsOrigin(parsed.siteUrl);
    if (configured) {
      return configured;
    }
  }

  if (process.env.NETLIFY === "true" && process.env.URL) {
    try {
      const netlifyEnvUrl = parseValidHttpsOrigin(process.env.URL);
      if (netlifyEnvUrl) {
        return netlifyEnvUrl;
      }
    } catch (_err) {
      // Ignore invalid Netlify env URL and fall back to default domain
    }
  }

  return DEFAULT_SITE_URL;
}

function resolveAndValidateAssetRef(sourceLabel, rawRef, baseSubdir = "") {
  const trimmed = rawRef.trim();
  if (
    !trimmed ||
    trimmed.startsWith("#") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("//") ||
    /^(?:mailto|tel|javascript|data):/i.test(trimmed)
  ) {
    return null;
  }

  const withoutQueryOrHash = trimmed.split("#")[0].split("?")[0];
  if (!withoutQueryOrHash || withoutQueryOrHash === "/") return null;

  const decoded = decodeURIComponent(withoutQueryOrHash).replace(/\\/g, "/");
  const isRootRelative = decoded.startsWith("/");
  const candidate = isRootRelative
    ? decoded.slice(1)
    : baseSubdir
      ? path.posix.join(baseSubdir, decoded)
      : decoded;
  const rel = path.posix.normalize(candidate);

  if (path.isAbsolute(rel) || rel.startsWith("..")) {
    throw new Error(`Asset reference escapes workspace (${sourceLabel}): ${rawRef}`);
  }

  if (EXCLUDED_DIR_PREFIXES.some((prefix) => rel.startsWith(prefix))) {
    throw new Error(`Refusing to publish excluded directory asset (${sourceLabel}): ${rel}`);
  }

  if (EXCLUDED_ASSETS.has(rel)) {
    throw new Error(`Refusing to publish excluded legacy/unused asset (${sourceLabel}): ${rel}`);
  }

  const diskPath = path.join(rootDir, rel);
  if (!fs.existsSync(diskPath)) {
    throw new Error(`Referenced asset missing on disk (${sourceLabel}): ${rel}`);
  }

  return rel;
}

function collectReferencedHtmlAssets() {
  const htmlFiles = ["index.html", "404.html"];
  const collected = [];

  for (const htmlFile of htmlFiles) {
    const fullPath = path.join(rootDir, htmlFile);
    if (!fs.existsSync(fullPath)) continue;
    const html = fs.readFileSync(fullPath, "utf8");
    const matches = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/gi)];

    for (const match of matches) {
      const rel = resolveAndValidateAssetRef(htmlFile, match[1]);
      if (rel) collected.push(rel);
    }
  }

  const cssPath = "assets/css/style.css";
  const cssFullPath = path.join(rootDir, cssPath);
  if (fs.existsSync(cssFullPath)) {
    const css = fs.readFileSync(cssFullPath, "utf8");
    const urlMatches = [...css.matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi)];
    for (const match of urlMatches) {
      const rel = resolveAndValidateAssetRef(cssPath, match[2], path.posix.dirname(cssPath));
      if (rel) collected.push(rel);
    }
  }

  return collected;
}

const indexFullPath = path.join(rootDir, "index.html");
if (fs.existsSync(indexFullPath)) {
  const indexHtml = fs.readFileSync(indexFullPath, "utf8");
  if (!indexHtml.includes('data-netlify="true"') || !indexHtml.includes('name="contact"')) {
    throw new Error('Netlify Forms attributes (data-netlify="true" name="contact") missing from index.html');
  }
}

const resolvedSiteUrl = resolveSiteUrl();

for (const relPath of TEXT_FILES_TO_CHECK) {
  const fullPath = path.join(rootDir, relPath);
  if (!fs.existsSync(fullPath)) continue;
  const content = fs.readFileSync(fullPath, "utf8");
  if (content.includes("REPLACE_WITH_")) {
    throw new Error(`Unresolved placeholder token (REPLACE_WITH_) found in ${relPath}`);
  }
}

const filesToPublish = Array.from(
  new Set([...CORE_PRODUCTION_FILES, ...collectReferencedHtmlAssets()])
);

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

for (const relPath of filesToPublish) {
  const src = path.join(rootDir, relPath);
  const dest = path.join(distDir, relPath);
  if (!fs.existsSync(src)) {
    throw new Error(`Missing required production file: ${relPath}`);
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });

  if (TEXT_FILES_WITH_SITE_URL.has(relPath)) {
    const content = fs.readFileSync(src, "utf8").split(DEFAULT_SITE_URL).join(resolvedSiteUrl);
    fs.writeFileSync(dest, content, "utf8");
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log(`Prepared dist/ with ${filesToPublish.length} production files:`);
for (const f of filesToPublish) {
  console.log(` - ${f}`);
}
console.log(`Configured canonical/SEO site URL: ${resolvedSiteUrl}`);
