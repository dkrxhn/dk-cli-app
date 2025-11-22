import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertResumeSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/resume", async (_req, res) => {
    try {
      const resume = await storage.getResume();
      if (!resume) {
        return res.status(404).json({ error: "Resume not found" });
      }
      res.json(resume);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch resume" });
    }
  });

  app.post("/api/resume", async (req, res) => {
    try {
      const validatedData = insertResumeSchema.parse(req.body);
      const resume = await storage.upsertResume(validatedData);
      res.json(resume);
    } catch (error) {
      res.status(400).json({ error: "Invalid resume data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
