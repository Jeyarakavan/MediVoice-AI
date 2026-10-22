import '../../src/config/env'; // must be first — loads dotenv
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import 'express-async-errors';

import { config } from './config/env';
import authRoutes from './routes/auth';
import { errorHandler, notFound } from './middleware/errorHandler';

export function createApp(): Application {
  const app = express();

  // ─── Security headers ───────────────────────────────────────────────────────
  app.use(helmet());

  // ─── CORS ───────────────────────────────────────────────────────────────────
  app.use(
    cors({
      origin: config.frontendUrl,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    })
  );

  // ─── Body parsing ───────────────────────────────────────────────────────────
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));
  app.use(cookieParser());

  // ─── Logging (dev only) ─────────────────────────────────────────────────────
  if (config.env === 'development') {
    app.use(morgan('dev'));
  }

  // ─── Global rate limiting ───────────────────────────────────────────────────
  const globalLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    message: { success: false, message: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/', globalLimiter);

  // Stricter limiter for auth endpoints
  const authLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.authMax,
    message: { success: false, message: 'Too many authentication attempts, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/auth/', authLimiter);

  // ─── Health check ───────────────────────────────────────────────────────────
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // ─── API Routes ─────────────────────────────────────────────────────────────
  app.use('/api/auth', authRoutes);

  // ─── 404 and Error Handling ─────────────────────────────────────────────────
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
