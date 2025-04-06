import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { transformationTypes } from "@shared/schema";
import { 
  generateFlashcards, 
  generateSummary, 
  generateMindMap, 
  generateQuestions, 
  generateQuiz
} from "./lib/huggingface";

export async function registerRoutes(app: Express): Promise<Server> {
  const router = express.Router();

  // Transform study text endpoint
  router.post("/transform", async (req, res) => {
    try {
      const validationSchema = z.object({
        text: z.string().min(10, "Text must be at least 10 characters long"),
        type: z.enum(['flashcards', 'summary', 'mindmap', 'questions', 'quiz']),
        subject: z.string(),
        contentType: z.string(),
        options: z.record(z.any()),
      });

      const validatedData = validationSchema.parse(req.body);
      const { text, type, subject, contentType, options } = validatedData;

      let content = '';
      let title = `${subject} ${type}`;

      switch (type) {
        case 'flashcards': 
          const flashcards = await generateFlashcards(text, options);
          content = JSON.stringify(flashcards);
          break;
        case 'summary':
          const summary = await generateSummary(text, options);
          content = JSON.stringify(summary);
          break;
        case 'mindmap':
          const mindmap = await generateMindMap(text, options);
          content = JSON.stringify(mindmap);
          break;
        case 'questions':
          const questions = await generateQuestions(text, options);
          content = JSON.stringify(questions);
          break;
        case 'quiz':
          const quiz = await generateQuiz(text, options);
          content = JSON.stringify(quiz);
          break;
        default:
          throw new Error("Invalid transformation type");
      }

      // Save the transformation
      const transformation = await storage.createTransformation({
        id: Date.now().toString(),
        title,
        text,
        type,
        subject,
        contentType,
        content,
        options,
        createdAt: new Date()
      });

      res.json({ 
        success: true, 
        transformation, 
        data: JSON.parse(content)
      });
    } catch (error: any) {
      console.error("Error transforming text:", error);
      res.status(400).json({ 
        success: false, 
        error: error.message || "Failed to transform text" 
      });
    }
  });

  // Get all transformations
  router.get("/transformations", async (req, res) => {
    try {
      const transformations = await storage.getTransformations();
      res.json({ transformations });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to fetch transformations" 
      });
    }
  });

  // Get a single transformation
  router.get("/transformations/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const transformation = await storage.getTransformation(id);
      
      if (!transformation) {
        return res.status(404).json({ success: false, error: "Transformation not found" });
      }
      
      res.json({ transformation });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to fetch transformation" 
      });
    }
  });

  // Delete a transformation
  router.delete("/transformations/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const success = await storage.deleteTransformation(id);
      
      if (!success) {
        return res.status(404).json({ success: false, error: "Transformation not found" });
      }
      
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: error.message || "Failed to delete transformation" 
      });
    }
  });

  // Apply all routes with /api prefix
  app.use("/api", router);

  const httpServer = createServer(app);
  return httpServer;
}
