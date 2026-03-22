import IORedis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL ??
  'redis://default:uCynzDhwgBCGb8c93VVTCqEZCoVnluSf@redis-16287.crce262.us-east-1-1.ec2.cloud.redislabs.com:16287';

// Cache client — separate instance with retry support
const cacheClient = new IORedis(REDIS_URL, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: false,
  lazyConnect: true,
});

cacheClient.on('error', (err) =>
  console.error('[Cache] Redis error:', err.message)
);

const CACHE_TTL = 86400; // 24 hours
const key = (id: string) => `paper:${id}`;

export async function getCachedPaper(assignmentId: string): Promise<object | null> {
  try {
    const raw = await cacheClient.get(key(assignmentId));
    if (!raw) return null;
    return JSON.parse(raw) as object;
  } catch {
    return null; // Cache miss — fall through to MongoDB
  }
}

export async function setCachedPaper(assignmentId: string, data: object): Promise<void> {
  try {
    await cacheClient.set(key(assignmentId), JSON.stringify(data), 'EX', CACHE_TTL);
  } catch (err) {
    console.error('[Cache] Failed to set cache:', err);
  }
}

export async function deleteCachedPaper(assignmentId: string): Promise<void> {
  try {
    await cacheClient.del(key(assignmentId));
  } catch {
    // Ignore cache delete errors
  }
}
