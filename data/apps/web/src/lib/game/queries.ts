import { prisma } from "@desafio/database";

export async function listStagesWithMarkets() {
  return prisma.stage.findMany({
    orderBy: { number: "asc" },
    include: {
      predictionMarkets: {
        orderBy: { class: { code: "asc" } },
        include: { class: true, specialQuestion: { include: { options: { orderBy: { sortOrder: "asc" } } } } },
      },
    },
  });
}

export async function getStageBySlug(slug: string) {
  return prisma.stage.findUnique({
    where: { slug },
    include: {
      predictionMarkets: {
        orderBy: { class: { code: "asc" } },
        include: {
          class: true,
          specialQuestion: { include: { options: { where: { active: true }, orderBy: { sortOrder: "asc" } } } },
          _count: { select: { predictions: true } },
        },
      },
      results: {
        where: { isCurrent: true, status: { in: ["PROVISIONAL", "OFFICIAL"] } },
        include: { class: true },
      },
      stageBoats: {
        where: { eligibleForPrediction: true },
        include: {
          boat: {
            include: {
              class: { include: { parent: true } },
              identifiers: { where: { type: "SAIL_NUMBER", isCurrent: true }, take: 1 },
            },
          },
        },
        orderBy: { boat: { boatNumber: "asc" } },
      },
    },
  });
}

export async function listBoats() {
  return prisma.boat.findMany({
    where: { deletedAt: null },
    orderBy: [{ class: { code: "asc" } }, { publicName: "asc" }],
    include: {
      class: { include: { parent: true } },
      identifiers: { where: { isCurrent: true }, orderBy: { type: "asc" } },
      certificates: { where: { isCurrent: true }, orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
}

export async function getBoatByNumber(boatNumber: string) {
  return prisma.boat.findUnique({
    where: { boatNumber },
    include: {
      class: { include: { parent: true } },
      names: { orderBy: [{ isCurrent: "desc" }, { type: "asc" }, { name: "asc" }] },
      identifiers: { orderBy: [{ isCurrent: "desc" }, { type: "asc" }] },
      certificates: { orderBy: [{ isCurrent: "desc" }, { issuedAt: "desc" }] },
      stageBoats: { include: { stage: true }, orderBy: { stage: { number: "asc" } } },
    },
  });
}

export async function getPredictionMarketForUser({
  stageSlug,
  classCode,
  userId,
}: {
  stageSlug: string;
  classCode: string;
  userId: string;
}) {
  return prisma.predictionMarket.findFirst({
    where: { stage: { slug: stageSlug }, class: { code: classCode.toUpperCase() } },
    include: {
      stage: true,
      class: true,
      specialQuestion: { include: { options: { where: { active: true }, orderBy: { sortOrder: "asc" } } } },
      predictions: {
        where: { userId },
        take: 1,
        include: { podium: { orderBy: { position: "asc" } } },
      },
    },
  });
}

export async function listEligibleBoatsForMarket(marketId: string) {
  const market = await prisma.predictionMarket.findUnique({
    where: { id: marketId },
    select: { stageId: true, classId: true },
  });
  if (!market) return [];

  return prisma.stageBoat.findMany({
    where: {
      stageId: market.stageId,
      eligibleForPrediction: true,
      boat: {
        OR: [
          { classId: market.classId },
          { class: { parentId: market.classId } },
        ],
      },
    },
    include: {
      boat: {
        include: { identifiers: { where: { type: "SAIL_NUMBER", isCurrent: true }, take: 1 } },
      },
    },
    orderBy: { boat: { publicName: "asc" } },
  });
}
