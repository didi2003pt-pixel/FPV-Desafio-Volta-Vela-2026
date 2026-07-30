import { NextResponse } from "next/server";
import { prisma } from "@desafio/database";

export async function GET() {
  return NextResponse.json({ service: "desafio-volta-web", status: "ok", timestamp: new Date().toISOString() });
}
