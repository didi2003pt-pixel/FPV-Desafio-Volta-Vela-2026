import { cookies } from "next/headers";
import { createOpaqueToken, hashOpaqueToken } from "@desafio/auth";
import { getEnv } from "@desafio/config";
import { prisma } from "@desafio/database";
import { getRequestContext } from "./request-context";

const COOKIE_NAME = "dv_session";

export async function createSession(userId: string): Promise<void> {
  const env = getEnv();
  const token = createOpaqueToken();
  const tokenHash = hashOpaqueToken(token, env.AUTH_PEPPER);
  const expiresAt = new Date(Date.now() + env.SESSION_TTL_DAYS * 86_400_000);
  const context = await getRequestContext();

  await prisma.session.create({
    data: { userId, tokenHash, expiresAt, ...context },
  });

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function getCurrentSession() {
  const env = getEnv();
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashOpaqueToken(token, env.AUTH_PEPPER) },
    include: {
      user: {
        include: { profile: true, roles: { include: { role: true } } },
      },
    },
  });

  if (!session || session.revokedAt || session.expiresAt <= new Date()) return null;
  if (session.user.status !== "ACTIVE") return null;
  return session;
}

export async function revokeCurrentSession(): Promise<void> {
  const env = getEnv();
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (token) {
    await prisma.session.updateMany({
      where: { tokenHash: hashOpaqueToken(token, env.AUTH_PEPPER), revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
  store.delete(COOKIE_NAME);
}
