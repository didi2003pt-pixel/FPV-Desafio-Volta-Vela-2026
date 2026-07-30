import { createClient, type RedisClientType } from "redis";
import { getEnv } from "@desafio/config";

const globalRedis = globalThis as unknown as { redis?: RedisClientType };

export async function getRedis(): Promise<RedisClientType> {
  const env = getEnv();
  const client = globalRedis.redis ?? createClient({ url: env.REDIS_URL });
  if (!globalRedis.redis) {
    client.on("error", (error) => console.error("Redis:", error));
    globalRedis.redis = client;
  }
  if (!client.isOpen) await client.connect();
  return client;
}

export async function rateLimit(key: string, limit: number, windowSeconds: number) {
  const env = getEnv();
  try {
    const redis = await getRedis();
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, windowSeconds);
    return { allowed: count <= limit, remaining: Math.max(0, limit - count) };
  } catch (error) {
    console.error("Rate limit indisponível:", error);
    return { allowed: env.RATE_LIMIT_FAIL_OPEN, remaining: 0 };
  }
}
