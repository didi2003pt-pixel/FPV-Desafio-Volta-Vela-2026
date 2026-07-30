export function toAuditJson(value: unknown): never {
  return JSON.parse(JSON.stringify(value)) as never;
}
