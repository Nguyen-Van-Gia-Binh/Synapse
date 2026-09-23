import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config';
import apiRoutes from './routes';
import { ApiResponse } from './types';

const app = express();

// Middlewares
const corsOrigin = config.nodeEnv === 'development'
  ? [config.clientUrl, /^http:\/\/localhost:\d+$/]
  : config.clientUrl;

app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (req: Request, res: Response) => {
  const response: ApiResponse<{ status: string; service: string; environment: string }> = {
    success: true,
    data: {
      status: 'healthy',
      service: 'synapse-backend',
      environment: config.nodeEnv,
    },
    timestamp: new Date().toISOString(),
  };
  res.json(response);
});

// Mount API Routes
app.use('/api', apiRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  const response: ApiResponse<never> = {
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Đường dẫn ${req.method} ${req.url} không tồn tại.`,
    },
    timestamp: new Date().toISOString(),
  };
  res.status(404).json(response);
});

// Global Error Handler
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  const response: ApiResponse<never> = {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Đã xảy ra lỗi nội bộ máy chủ.',
      details: config.nodeEnv === 'development' ? err.message : null,
    },
    timestamp: new Date().toISOString(),
  };
  res.status(500).json(response);
});

// Khởi động server
if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    console.log(`🚀 Synapse Backend API đang chạy tại http://localhost:${config.port}`);
    console.log(`🩺 Health check sẵn sàng tại http://localhost:${config.port}/api/health`);
  });
}

export default app;
