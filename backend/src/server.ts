import './config/env'; // must be first
import { createApp } from './app';
import { connectDB } from './config/database';
import { config } from './config/env';

async function bootstrap() {
  try {
    // 1. Connect to MongoDB Atlas
    await connectDB();

    // 2. Start Express server
    const app = createApp();
    const server = app.listen(config.port, () => {
      console.info(`[Server] MediVox AI backend running on port ${config.port} (${config.env})`);
    });

    // 3. Graceful shutdown
    const shutdown = (signal: string) => {
      console.info(`[Server] ${signal} received — shutting down gracefully`);
      server.close(() => {
        console.info('[Server] HTTP server closed');
        process.exit(0);
      });
      // Force exit after 10s
      setTimeout(() => process.exit(1), 10_000).unref();
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[Server] Startup failed: ${message}`);
    process.exit(1);
  }
}

bootstrap();
