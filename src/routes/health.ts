import { Router, Request, Response } from "express";

const router: Router = Router();

interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
}

interface DetailedHealthResponse extends HealthResponse {
  memory: NodeJS.MemoryUsage;
  nodeVersion: string;
  platform: string;
  arch: string;
  pid: number;
}

interface ProbeResponse {
  status: string;
  timestamp: string;
}

// Basic health check
router.get("/", (_req: Request, res: Response): void => {
  const healthResponse: HealthResponse = {
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env["NODE_ENV"] || "development",
  };

  res.json(healthResponse);
});

// Detailed health check
router.get("/detailed", (_req: Request, res: Response): void => {
  const healthInfo: DetailedHealthResponse = {
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env["NODE_ENV"] || "development",
    memory: process.memoryUsage(),
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    pid: process.pid,
  };

  res.json(healthInfo);
});

// Readiness check
router.get("/ready", (_req: Request, res: Response): void => {
  // Add your readiness logic here (database connections, external services, etc.)
  const isReady: boolean = true; // Replace with actual readiness check

  if (isReady) {
    const response: ProbeResponse = {
      status: "ready",
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  } else {
    const response: ProbeResponse = {
      status: "not ready",
      timestamp: new Date().toISOString(),
    };
    res.status(503).json(response);
  }
});

// Liveness check
router.get("/live", (_req: Request, res: Response): void => {
  // Add your liveness logic here
  const isAlive: boolean = true; // Replace with actual liveness check

  if (isAlive) {
    const response: ProbeResponse = {
      status: "alive",
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  } else {
    const response: ProbeResponse = {
      status: "not alive",
      timestamp: new Date().toISOString(),
    };
    res.status(503).json(response);
  }
});

export default router;
