import { cookies } from "next/headers";
import { createOpaqueToken, hashOpaqueToken } from "@desafio/auth";
import { getEnv } from "@desafio/config";
import { prisma } from "@desafio/database";
import { getRequestContext } from "./request-context";

function sessionCookieName(): string {
  return getEnv().NODE_ENV === "production" ? "__Host-dv_session" : "dv_session";
}

export async function createSession(userId: string): Promise<void> {
  const env = getEnv();
  const token = createOpaqueToken();
  const tokenHash = hashOpaqueToken(token, env.AUTH_PEPPER);
  const expiresAt = new Date(Date.now() + env.SESSION_TTL_DAYS * 86_400_000);
  const context = await getRequestContext();

  await prisma.$transaction(async (tx) => {
    await tx.session.create({
      data: { userId, tokenHash, expiresAt, ...context },
    });
    await tx.session.deleteMany({
      where: { userId, OR: [{ expiresAt: { lte: new Date() } }, { revokedAt: { not: null } }] },
    });
  });

  const store = await cookies();
  store.set(sessionCookieName(), token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
    priority: "high",
  });
}

export async function getCurrentSession() {
  const env = getEnv();
  const token = (await cookies()).get(sessionCookieName())?.value;
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

  if (session.lastSeenAt.getTime() < Date.now() - 15 * 60_000) {
    void prisma.session.update({
      where: { id: session.id },
      data: { lastSeenAt: new Date() },
    }).catch(() => undefined);
  }
  return session;
}

export async function revokeCurrentSession(): Promise<void> {
  const env = getEnv();
  const store = await cookies();
  const name = sessionCookieName();
  const token = store.get(name)?.value;
  if (token) {
    await prisma.session.updateMany({
      where: { tokenHash: hashOpaqueToken(token, env.AUTH_PEPPER), revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
  store.delete(name);
}

export async function revokeAllUserSessions(userId: string): Promise<number> {
  const result = await prisma.session.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  return result.count;
}
