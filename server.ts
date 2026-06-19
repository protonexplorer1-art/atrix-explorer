import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 5173;

  // Use JSON middleware
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Example Blog API (Atrix Explorer Focused)
  app.get("/api/blogs", (req, res) => {
    res.json([
      {
        id: "rec-01",
        title: "Top 10 Zero-to-Hero Manhwa to Binge This Weekend",
        excerpt: "From weakling to godhood. We dive into the best 'level-up' systems and tower-climbing narratives currently dominating the charts.",
        date: "May 07, 2026",
        author: "Atrix Editorial",
        image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1000&auto=format&fit=crop",
        category: "Action Recommendations"
      },
      {
        id: "rec-02",
        title: "Why You Should Be Reading 'Regression' Series in 2026",
        excerpt: "The regression trope is evolving. Explore how new authors are adding psychological depth to the 'second chance' genre.",
        date: "May 05, 2026",
        author: "Genre Expert",
        image: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000&auto=format&fit=crop",
        category: "Genre Analysis"
      },
       {
        id: "rec-03",
        title: "Hidden Gems: Murim Series You Probably Missed",
        excerpt: "Beyond the big names exists a world of high-quality martial arts stories. Here are 5 titles with unique art and tight pacing.",
        date: "May 02, 2026",
        author: "Murim Master",
        image: "https://images.unsplash.com/photo-1578632738908-4521c626dc48?q=80&w=1000&auto=format&fit=crop",
        category: "Hidden Gems"
      }
    ]);
  });

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
    console.log(`ATRIX Server running on http://localhost:${PORT}`);
  });
}

startServer();
