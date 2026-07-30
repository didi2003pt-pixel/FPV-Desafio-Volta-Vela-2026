import { headers } from "next/headers";
import { getEnv } from "@desafio/config";
import { hashIdentifier } from "@desafio/operations";

function firstForwardedAddress(value: string | null): string | null {
  const candidate = value?.split(",")[0]?.trim();
  return candidate && candidate.length <= 64 ? candidate : null;
}

export async function getRequestContext() {
  const values = await headers();
  const env = getEnv();
  const ip = firstForwardedAddress(values.get("x-forwarded-for"))
    ?? firstForwardedAddress(values.get("x-real-ip"));

  return {
    ipAddress: env.STORE_RAW_IP_ADDRESSES ? ip : null,
    ipHash: ip ? hashIdentifier(ip, env.IP_HASH_PEPPER) : null,
    requestId: values.get("x-request-id")?.slice(0, 128) ?? null,
    userAgent: values.get("user-agent")?.slice(0, 500) ?? null,
  };
}
