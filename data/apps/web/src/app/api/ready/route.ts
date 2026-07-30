import { NextResponse } from "next/server";
import { prisma } from "@desafio/database";
import { getRedis } from "@/lib/redis";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const redis = await getRedis();
    await redis.ping();
    return NextResponse.json({ status: "ready", database: "ok", redis: "ok" });
  } catch (error) {
    return NextResponse.json({ status: "not_ready", error: error instanceof Error ? error.message : "unknown" }, { status: 503 });
  }
}
