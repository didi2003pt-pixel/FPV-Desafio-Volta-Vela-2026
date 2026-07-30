import { prisma } from "@desafio/database";
import { toAuditJson } from "../audit";
import { logger } from "../observability/logger";

export async function recordSecurityEvent(input: {
  severity?: "INFO" | "WARNING" | "CRITICAL";
  eventType: string;
  actorUserId?: string | null;
  requestId?: string | null;
  ipHash?: string | null;
  route?: string | null;
  method?: string | null;
  metadata?: unknown;
}): Promise<void> {
  try {
    await prisma.securityEvent.create({
      data: {
        severity: input.severity ?? "INFO",
        eventType: input.eventType,
        actorUserId: input.actorUserId ?? null,
        requestId: input.requestId ?? null,
        ipHash: input.ipHash ?? null,
        route: input.route?.slice(0, 500) ?? null,
        method: input.method?.slice(0, 12) ?? null,
        ...(input.metadata === undefined ? {} : { metadata: toAuditJson(input.metadata) }),
      },
    });
  } catch (error) {
    logger.error("security_event_persistence_failed", {
      eventType: input.eventType,
      error: error instanceof Error ? error.message : "unknown",
    });
  }
}
