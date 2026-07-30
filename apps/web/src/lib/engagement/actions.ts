"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@desafio/database";
import { requireUser } from "../authorization";
import { rateLimit } from "../redis";
import { getRequestContext } from "../request-context";
import { recordSecurityEvent } from "../security/security-event";

export async function completeMission(formData: FormData) {
  const user = await requireUser();
  const missionId = String(formData.get("missionId") ?? "");
  const context = await getRequestContext();
  const limiter = await rateLimit(`mission:${user.id}`, 20, 3_600);
  if (!limiter.allowed) {
    await recordSecurityEvent({
      severity: "WARNING",
      eventType: "MISSION_RATE_LIMITED",
      actorUserId: user.id,
      requestId: context.requestId,
      ipHash: context.ipHash,
      route: "/missoes",
      method: "POST",
    });
    throw new Error("Demasiadas tentativas.");
  }

  const now = new Date();
  await prisma.$transaction(async (tx) => {
    const mission = await tx.mission.findUnique({ where: { id: missionId } });
    if (!mission || !mission.active || mission.startsAt > now || mission.endsAt < now) {
      throw new Error("Missão indisponível.");
    }
    if (mission.validationMode !== "AUTOMATIC") {
      throw new Error("Esta missão exige prova ou validação administrativa.");
    }
    const existing = await tx.missionCompletion.findUnique({
      where: { missionId_userId: { missionId, userId: user.id } },
    });
    if (existing?.status === "APPROVED") return;

    await tx.missionCompletion.upsert({
      where: { missionId_userId: { missionId, userId: user.id } },
      create: {
        missionId,
        userId: user.id,
        status: "APPROVED",
        pointsAwarded: mission.points,
        evidence: { validatedAt: now.toISOString(), method: "AUTOMATIC" },
      },
      update: {
        status: "APPROVED",
        pointsAwarded: mission.points,
        completedAt: now,
      },
    });
    await tx.auditLog.create({
      data: {
        actorUserId: user.id,
        action: "MISSION_COMPLETED",
        entityType: "Mission",
        entityId: mission.id,
        ipAddress: context.ipAddress,
        ipHash: context.ipHash,
        requestId: context.requestId,
        userAgent: context.userAgent,
      },
    });
  });
  revalidatePath("/missoes");
}

export async function markNotificationRead(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  await prisma.notification.updateMany({
    where: { id, userId: user.id },
    data: { status: "READ", readAt: new Date() },
  });
  revalidatePath("/notificacoes");
}
