import { defineConfig } from "astro/config";
import fs from "node:fs";
import path from "node:path";

// The dev server doesn't resolve directory indexes or extensionless URLs for
// files in public/ (GitHub Pages does). Mirror that so /shop and /satorin
// work locally. Production output is unaffected.
const publicPageFallback = () => ({
  name: "public-page-fallback",
  apply: "serve",
  configureServer(server) {
    const root = path.resolve("public");
    server.middlewares.use((req, _res, next) => {
      const [pathname, query = ""] = (req.url || "").split("?");
      const rel = decodeURIComponent(pathname).replace(/^\/+/, "");
      const abs = path.join(root, rel);
      if (!abs.startsWith(root)) return next();
      const isFile = (p) => fs.existsSync(p) && fs.statSync(p).isFile();
      const candidates = pathname.endsWith("/")
        ? [path.join(abs, "index.html")]
        : [abs + ".html", path.join(abs, "index.html")];
      if (!isFile(abs) && candidates.some(isFile)) {
        // a bare directory path needs the trailing slash so relative links resolve
        if (
          !pathname.endsWith("/") &&
          fs.existsSync(abs) &&
          fs.statSync(abs).isDirectory()
        ) {
          _res.statusCode = 301;
          _res.setHeader(
            "Location",
            pathname + "/" + (query ? "?" + query : ""),
          );
          return _res.end();
        }
        const hit = candidates.find(isFile);
        req.url =
          "/" +
          path.relative(root, hit).split(path.sep).join("/") +
          (query ? "?" + query : "");
      }
      next();
    });
  },
});

export default defineConfig({
  site: "https://setsukohata.com",
  redirects: {
    "/hatha-yoga": "/hatha-yoga/ja/",
    // The English pages are unpublished (source kept in src/pages/hatha-yoga/_en;
    // rename the folder back to `en` to restore them and drop these redirects).
    // Old English URLs, including the .html ones from the static export, go to
    // the matching Japanese page.
    "/hatha-yoga/en": "/hatha-yoga/ja/",
    "/hatha-yoga/en/about": "/hatha-yoga/ja/about/",
    "/hatha-yoga/en/offerings": "/hatha-yoga/ja/offerings/",
    "/hatha-yoga/en/membership": "/hatha-yoga/ja/offerings/",
    "/hatha-yoga/en/contact": "/hatha-yoga/ja/contact/",
    "/hatha-yoga/en/about.html": "/hatha-yoga/ja/about/",
    "/hatha-yoga/en/offerings.html": "/hatha-yoga/ja/offerings/",
    "/hatha-yoga/en/membership.html": "/hatha-yoga/ja/offerings/",
    "/hatha-yoga/en/contact.html": "/hatha-yoga/ja/contact/",
  },
  server: { port: Number(process.env.PORT) || 4321 },
});
