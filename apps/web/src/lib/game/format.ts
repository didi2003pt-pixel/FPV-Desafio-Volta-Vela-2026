const dateFormatter = new Intl.DateTimeFormat("pt-PT", {
  timeZone: "Europe/Lisbon",
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("pt-PT", {
  timeZone: "Europe/Lisbon",
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDate(value: Date): string {
  return dateFormatter.format(value);
}

export function formatDateTime(value: Date | null): string {
  return value ? dateTimeFormatter.format(value) : "Por definir";
}

export function toDateTimeLocal(value: Date | null): string {
  if (!value) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Lisbon",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(value);
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${map.year}-${map.month}-${map.day}T${map.hour}:${map.minute}`;
}

export function classLabel(code: string): string {
  return code === "ANC" ? "Classe ANC" : code === "ORC" ? "Classe ORC" : code;
}

export function parseLisbonDateTimeLocal(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(trimmed)) {
    throw new Error("Data e hora inválidas.");
  }

  const [datePart, timePart] = trimmed.split("T");
  if (!datePart || !timePart) throw new Error("Data e hora inválidas.");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  if ([year, month, day, hour, minute].some((part) => !Number.isInteger(part))) {
    throw new Error("Data e hora inválidas.");
  }

  const wallClockAsUtc = Date.UTC(year!, month! - 1, day!, hour!, minute!);
  let instant = wallClockAsUtc;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Lisbon",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date(instant));
    const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    const representedWallClock = Date.UTC(
      Number(map.year),
      Number(map.month) - 1,
      Number(map.day),
      Number(map.hour),
      Number(map.minute),
    );
    instant += wallClockAsUtc - representedWallClock;
  }
  return new Date(instant);
}
