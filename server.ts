import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const OTX_API_KEY = process.env.OTX_API_KEY;
const OTX_BASE_URL = "https://otx.alienvault.com/api/v1";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Proxy for OTX General Indicators (IPv4, CVE, Domain, etc)
  app.get("/api/otx/indicators/:type/:value/:section?", async (req, res) => {
    const { type, value, section } = req.params;
    let url = `${OTX_BASE_URL}/indicators/${type}/${value}`;
    if (section) url += `/${section}`;

    try {
      const response = await axios.get(url, {
        headers: { "X-OTX-API-KEY": OTX_API_KEY },
      });
      res.json(response.data);
    } catch (error: any) {
      console.error(`OTX Indicator error (${type}/${value}):`, error.message);
      res.status(error.response?.status || 500).json({ error: "Failed to fetch indicators" });
    }
  });

  // Pulse Search (Dynamic Stats/Charts)
  app.get("/api/otx/search/pulses", async (req, res) => {
    try {
      const response = await axios.get(`${OTX_BASE_URL}/search/pulses`, {
        headers: { "X-OTX-API-KEY": OTX_API_KEY },
        params: req.query // q, page, sort, etc
      });
      res.json(response.data);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to search pulses" });
    }
  });

  // Recent Activity (Dashboard Stats)
  app.get("/api/otx/pulses/activity", async (req, res) => {
    try {
      const response = await axios.get(`${OTX_BASE_URL}/pulses/activity`, {
        headers: { "X-OTX-API-KEY": OTX_API_KEY },
        params: { limit: 20 }
      });
      res.json(response.data);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch pulse activity" });
    }
  });

  // Proxy for OTX Pulses
  app.get("/api/otx/pulses/:id?", async (req, res) => {
    const { id } = req.params;
    let url = `${OTX_BASE_URL}/pulses`;
    if (id) url += `/${id}`;

    try {
      const response = await axios.get(url, {
        headers: {
          "X-OTX-API-KEY": OTX_API_KEY,
        },
        params: req.query
      });
      res.json(response.data);
    } catch (error: any) {
      res.status(error.response?.status || 500).json({ error: "Failed to fetch pulses" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
