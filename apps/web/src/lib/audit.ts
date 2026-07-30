import { redactSensitive } from "@desafio/operations";

export function toAuditJson(value: unknown): never {
  return JSON.parse(JSON.stringify(redactSensitive(value))) as never;
}
