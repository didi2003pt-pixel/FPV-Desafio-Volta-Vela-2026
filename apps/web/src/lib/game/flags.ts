import { prisma } from "@desafio/database";

export async function getFeatureFlags(...keys: string[]): Promise<Record<string, boolean>> {
  const flags = await prisma.featureFlag.findMany({ where: { key: { in: keys } } });
  const map = Object.fromEntries(keys.map((key) => [key, false]));
  for (const flag of flags) map[flag.key] = flag.enabled;
  return map;
}

export async function isFeatureEnabled(key: string): Promise<boolean> {
  const flag = await prisma.featureFlag.findUnique({ where: { key }, select: { enabled: true } });
  return Boolean(flag?.enabled);
}

export async function getGameLaunchStage(): Promise<number | null> {
  const setting = await prisma.systemSetting.findUnique({
    where: { key: "game_launch_stage" },
    select: { value: true },
  });
  const value = setting?.value;
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const stage = (value as { stage?: unknown }).stage;
  return typeof stage === "number" && Number.isInteger(stage) && stage >= 1 && stage <= 8 ? stage : null;
}
