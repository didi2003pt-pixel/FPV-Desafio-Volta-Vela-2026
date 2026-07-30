import { Badge } from "@desafio/ui";

const labels: Record<string, string> = {
  DRAFT: "Rascunho",
  SCHEDULED: "Prevista",
  PREDICTIONS_OPEN: "Previsões abertas",
  PREDICTIONS_CLOSED: "Previsões fechadas",
  IN_PROGRESS: "Em curso",
  PROVISIONAL_RESULTS: "Resultados provisórios",
  OFFICIAL_RESULTS: "Resultados oficiais",
  POSTPONED: "Adiada",
  CANCELLED: "Cancelada",
  ARCHIVED: "Arquivada",
  OPEN: "Aberto",
  CLOSED: "Fechado",
};

export function StageStatusBadge({ status }: { status: string }) {
  const tone = status === "PREDICTIONS_OPEN" || status === "OPEN"
    ? "success"
    : status === "CANCELLED"
      ? "danger"
      : status === "PREDICTIONS_CLOSED" || status === "CLOSED"
        ? "warning"
        : "neutral";
  return <Badge tone={tone}>{labels[status] ?? status}</Badge>;
}
