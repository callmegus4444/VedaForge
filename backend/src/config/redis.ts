import IORedis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL ??
  'redis://default:uCynzDhwgBCGb8c93VVTCqEZCoVnluSf@redis-16287.crce262.us-east-1-1.ec2.cloud.redislabs.com:16287';

export const redisConnection = new IORedis(REDIS_URL, {
  maxRetriesPerRequest: null,   // Required by BullMQ
  enableReadyCheck: false,
  lazyConnect: false,
});

redisConnection.on('error', (err) =>
  console.error('[Redis] Connection error:', err.message)
);
redisConnection.on('connect', () =>
  console.log('✅  Redis connected')
);
redisConnection.on('ready', () =>
  console.log('✅  Redis ready')
);
