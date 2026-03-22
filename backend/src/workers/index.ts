import 'dotenv/config';
import { connectDB, generationWorker } from './generationWorker';

async function main() {
  console.log('🚀  VedaForge worker starting...');

  // Connect MongoDB first
  await connectDB();

  console.log('👷  Worker listening on queue: assignment-generation');
  console.log('    Concurrency: 3 jobs');
  console.log('    Press Ctrl+C to stop\n');

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n[Worker] Shutting down gracefully...');
    await generationWorker.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\n[Worker] SIGTERM received — shutting down...');
    await generationWorker.close();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error('[Worker] Startup error:', err);
  process.exit(1);
});
