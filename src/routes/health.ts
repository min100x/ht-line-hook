import config from '../config/config';

import { Request, Response, Router } from 'express';

const router: Router = Router();

interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
}

interface DetailedHealthResponse extends HealthResponse {
  memory: {
    used: number;
    total: number;
    free: number;
    percentage: number;
  };
  cpu: {
    user: number;
    system: number;
  };
  platform: string;
  nodeVersion: string;
}

// Basic health check
router.get('/', (_req: Request, res: Response): void => {
  const response: HealthResponse = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv,
    version: '1.0.0',
  };

  res.json(response);
});

// Detailed health check
router.get('/detailed', (_req: Request, res: Response): void => {
  const memUsage = process.memoryUsage();
  const totalMem = memUsage.heapTotal;
  const usedMem = memUsage.heapUsed;
  const freeMem = totalMem - usedMem;
  const cpuUsage = process.cpuUsage();

  const response: DetailedHealthResponse = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv,
    version: '1.0.0',
    memory: {
      used: Math.round((usedMem / 1024 / 1024) * 100) / 100,
      total: Math.round((totalMem / 1024 / 1024) * 100) / 100,
      free: Math.round((freeMem / 1024 / 1024) * 100) / 100,
      percentage: Math.round((usedMem / totalMem) * 100),
    },
    cpu: {
      user: Math.round((cpuUsage.user / 1000) * 100) / 100, // Convert to milliseconds
      system: Math.round((cpuUsage.system / 1000) * 100) / 100, // Convert to milliseconds
    },
    platform: process.platform,
    nodeVersion: process.version,
  };

  res.json(response);
});

// Readiness probe
router.get('/ready', (_req: Request, res: Response): void => {
  // Add your readiness logic here
  // For example, check database connection, external services, etc.
  res.status(200).json({
    status: 'ready',
    timestamp: new Date().toISOString(),
  });
});

// Liveness probe
router.get('/live', (_req: Request, res: Response): void => {
  // Add your liveness logic here
  // For example, check if the application is responsive
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
  });
});

export default router;
