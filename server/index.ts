import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./vite";
import cors from "cors";

const app = express();

// Enable CORS for Vercel deployment
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register API routes
(async () => {
  const server = await registerRoutes(app);

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  // Setup static file serving in production
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  }

  // Start the server if not running in Vercel
  if (process.env.VERCEL !== "1") {
    const port = process.env.PORT || 3001;
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
})();

// Export the Express app for Vercel
export default app;
