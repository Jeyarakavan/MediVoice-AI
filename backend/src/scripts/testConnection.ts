/**
 * Connection test script — run with: npx ts-node src/scripts/testConnection.ts
 * This script tests the MongoDB Atlas connection, creates a temp document,
 * verifies read, then deletes it. Never logs credentials.
 */
import '../config/env';
import { connectDB, disconnectDB } from '../config/database';
import mongoose from 'mongoose';

async function main() {
  console.log('[TEST] Starting MongoDB Atlas connection test...');

  try {
    await connectDB();

    const db = mongoose.connection.db!;
    const col = db.collection('_connection_test');

    // Insert
    const result = await col.insertOne({ test: true, ts: new Date(), purpose: 'connection_test' });
    console.log('[TEST] ✓ Insert succeeded:', result.insertedId.toString());

    // Read back
    const doc = await col.findOne({ _id: result.insertedId });
    if (!doc) throw new Error('Could not read back inserted document');
    console.log('[TEST] ✓ Read succeeded');

    // Clean up
    await col.deleteOne({ _id: result.insertedId });
    console.log('[TEST] ✓ Cleanup succeeded');

    // Check database name
    const dbName = mongoose.connection.db!.databaseName;
    console.log(`[TEST] ✓ Connected to database: ${dbName}`);

    console.log('\n[TEST] ✅ All checks passed — MongoDB Atlas is correctly configured.\n');
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // Strip any credentials from error output
    const safe = msg.replace(/\/\/[^@]+@/, '//***:***@');
    console.error('[TEST] ❌ FAILED:', safe);
    process.exit(1);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
}

main();
