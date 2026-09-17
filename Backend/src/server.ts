import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import config from './config/environment';
import prisma from './config/database';
import authRoutes from './features/auth/authRoutes';
import projectRoutes from './features/projects/projectRoutes';

const app: Express = express();

// Middleware
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

// Health check
app.get('/health', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: 'ok', 
      message: 'Server is running',
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'error', 
      message: 'Database connection failed' 
    });
  }
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${config.nodeEnv}`);
  console.log(`🔐 JWT Auth enabled`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});
