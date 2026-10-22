import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB(): Promise<void> {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      '[DB] MONGODB_URI is not defined. Check your .env file and never commit secrets.'
    );
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10_000,
      socketTimeoutMS: 45_000,
      maxPoolSize: 10,
      minPoolSize: 2,
      heartbeatFrequencyMS: 10_000,
    });

    isConnected = true;
    // Log only the cluster host — never the full URI (which contains the password)
    const host = conn.connection.host;
    console.info(`[DB] Connected to MongoDB Atlas — host: ${host}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    // Strip credentials from the error message before logging
    const safe = message.replace(/\/\/[^@]+@/, '//***:***@');
    console.error(`[DB] Connection failed: ${safe}`);
    throw new Error('[DB] Could not connect to database. See server logs.');
  }
}

export async function disconnectDB(): Promise<void> {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
  console.info('[DB] Disconnected from MongoDB Atlas');
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});
process.on('SIGTERM', async () => {
  await disconnectDB();
  process.exit(0);
});
