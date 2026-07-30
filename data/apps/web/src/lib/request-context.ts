import { headers } from "next/headers";

export async function getRequestContext() {
  const values = await headers();
  const forwarded = values.get("x-forwarded-for");
  return {
    ipAddress: forwarded?.split(",")[0]?.trim() ?? values.get("x-real-ip") ?? null,
    userAgent: values.get("user-agent") ?? null,
  };
}
