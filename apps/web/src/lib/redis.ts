import { createClient, type RedisClientType } from "redis";
import { getEnv } from "@desafio/config";
import { logger } from "./observability/logger";

const globalRedis = globalThis as unknown as { redis?: RedisClientType };

export async function getRedis(): Promise<RedisClientType> {
  const env = getEnv();
  const client = globalRedis.redis ?? createClient({
    url: env.REDIS_URL,
    socket: {
      connectTimeout: 3_000,
      reconnectStrategy: (retries) => Math.min(retries * 100, 2_000),
    },
  });
  if (!globalRedis.redis) {
    client.on("error", (error) => logger.error("redis_error", { error: error.message }));
    globalRedis.redis = client;
  }
  if (!client.isOpen) await client.connect();
  return client;
}

const RATE_LIMIT_SCRIPT = `
local current = redis.call("INCR", KEYS[1])
if current == 1 then
  redis.call("EXPIRE", KEYS[1], ARGV[1])
end
local ttl = redis.call("TTL", KEYS[1])
return {current, ttl}
`;

export async function rateLimit(key: string, limit: number, windowSeconds: number) {
  const env = getEnv();
  try {
    const redis = await getRedis();
    const result = await redis.eval(RATE_LIMIT_SCRIPT, {
      keys: [`dv:rate:${key}`],
      arguments: [String(windowSeconds)],
    }) as [number, number];
    const count = Number(result[0]);
    const ttl = Math.max(0, Number(result[1]));
    return {
      allowed: count <= limit,
      limit,
      remaining: Math.max(0, limit - count),
      resetAt: new Date(Date.now() + ttl * 1_000),
    };
  } catch (error) {
    logger.error("rate_limit_unavailable", {
      error: error instanceof Error ? error.message : "unknown",
    });
    return {
      allowed: env.RATE_LIMIT_FAIL_OPEN,
      limit,
      remaining: 0,
      resetAt: new Date(Date.now() + windowSeconds * 1_000),
    };
  }
}
