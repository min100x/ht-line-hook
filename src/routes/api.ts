import { Request, Response, Router } from 'express';

const router: Router = Router();

interface ApiResponse {
  message: string;
  endpoints?: {
    health: string;
    api: string;
    root: string;
    lineWebhook: string;
  };
}

interface ProtectedResponse {
  message: string;
  timestamp: string;
}

interface DataRequest {
  data: string;
}

interface DataResponse {
  message: string;
  receivedData: string;
  timestamp: string;
}

interface ErrorResponse {
  error: string;
}

// Sample API endpoint
router.get('/', (_req: Request, res: Response): void => {
  const response: ApiResponse = {
    message: 'API is working!',
    endpoints: {
      health: '/health',
      api: '/api',
      root: '/',
      lineWebhook: '/line-webhook',
    },
  };

  res.json(response);
});

// Sample protected endpoint
router.get('/protected', (_req: Request, res: Response): void => {
  // Add authentication middleware here if needed
  const response: ProtectedResponse = {
    message: 'This is a protected endpoint',
    timestamp: new Date().toISOString(),
  };

  res.json(response);
});

// Sample POST endpoint
router.post('/data', (req: Request, res: Response): void => {
  const { data }: DataRequest = req.body;

  if (!data) {
    const errorResponse: ErrorResponse = {
      error: 'Data is required',
    };
    res.status(400).json(errorResponse);
    return;
  }

  const response: DataResponse = {
    message: 'Data received successfully',
    receivedData: data,
    timestamp: new Date().toISOString(),
  };

  res.json(response);
});

export default router;
