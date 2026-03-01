import http from "node:http";
import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";

const rootDir = path.resolve(process.cwd(), "build/client");
const port = Number(process.env.PORT || 4173);

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function safeJoin(base, target) {
  const targetPath = path.resolve(base, `.${target}`);
  const relativePath = path.relative(base, targetPath);
  if (
    relativePath.startsWith("..") ||
    path.isAbsolute(relativePath)
  ) {
    return null;
  }
  return targetPath;
}

async function resolvePath(urlPathname) {
  const decoded = decodeURIComponent(urlPathname);
  const candidate = safeJoin(rootDir, decoded);
  if (!candidate) return null;

  try {
    const stat = await fs.stat(candidate);
    if (stat.isDirectory()) {
      return path.join(candidate, "index.html");
    }
    return candidate;
  } catch {
    if (decoded.endsWith("/")) {
      return path.join(candidate, "index.html");
    }
    return candidate;
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const reqUrl = new URL(req.url || "/", `http://${req.headers.host}`);
    const filePath = await resolvePath(reqUrl.pathname);

    if (!filePath) {
      res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Forbidden");
      return;
    }

    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not Found");
  }
});

server.listen(port, () => {
  console.log(`Preview server running at http://localhost:${port}`);
  console.log(`Serving static files from: ${rootDir}`);
});
