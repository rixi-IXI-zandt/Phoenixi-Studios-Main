import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON parsing middleware
  app.use(express.json());

  // Static route helpers
  const rootDir = process.cwd();

  // API / Contact PHP simulation endpoint
  app.post("/php/contact.php", (req, res) => {
    res.json({
      status: "success",
      message: "Phoenixi Studios contact endpoint active."
    });
  });

  // Serve static assets directly
  app.use("/css", express.static(path.join(rootDir, "css")));
  app.use("/js", express.static(path.join(rootDir, "js")));
  app.use("/data", express.static(path.join(rootDir, "data")));
  app.use("/assets", express.static(path.join(rootDir, "assets")));

  // HTML page routes
  app.get(["/", "/index", "/index.html"], (req, res) => {
    res.sendFile(path.join(rootDir, "index.html"));
  });

  app.get(["/about", "/about.html"], (req, res) => {
    res.sendFile(path.join(rootDir, "about.html"));
  });

  app.get(["/contact", "/contact.html"], (req, res) => {
    res.sendFile(path.join(rootDir, "contact.html"));
  });

  app.get(["/worlds", "/worlds.html"], (req, res) => {
    res.sendFile(path.join(rootDir, "worlds.html"));
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(rootDir, "dist");
    app.use(express.static(distPath));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Phoenixi Studios server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
