import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import healthRoutes from "./routes/health";
import apiRoutes from "./routes/api";
import lineWebhookRoutes from "./routes/line-webhook";

dotenv.config();

const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/health", healthRoutes);
app.use("/api", apiRoutes);
app.use("/line-webhook", lineWebhookRoutes);

// Root route
app.get("/", (_req: Request, res: Response): void => {
  res.json({
    message: "Welcome to HT Line Hooks API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      health: "/health",
      api: "/api",
      lineWebhook: "/line-webhook",
    },
  });
});

// 404 handler
app.use("*", (req: Request, res: Response): void => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

// Error handler
app.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
    console.error(err.stack);
    res.status(500).json({
      error: "Something went wrong!",
      message:
        process.env["NODE_ENV"] === "development"
          ? err.message
          : "Internal server error",
    });
  }
);

export default app;
