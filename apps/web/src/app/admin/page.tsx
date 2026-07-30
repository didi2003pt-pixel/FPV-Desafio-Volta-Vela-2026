import { Card } from "@desafio/ui";
import { prisma } from "@desafio/database";

export default async function AdminPage() {
  const [boats, stages, users, flags] = await Promise.all([
    prisma.boat.count(),
    prisma.stage.count(),
    prisma.user.count(),
    prisma.featureFlag.findMany({ orderBy: { key: "asc" } }),
  ]);
  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <h1 className="text-3xl font-black text-brand-navy">Fundação técnica</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card><p className="text-sm text-slate-500">Embarcações</p><p className="text-4xl font-black">{boats}</p></Card>
        <Card><p className="text-sm text-slate-500">Etapas</p><p className="text-4xl font-black">{stages}</p></Card>
        <Card><p className="text-sm text-slate-500">Utilizadores</p><p className="text-4xl font-black">{users}</p></Card>
      </div>
      <Card className="mt-6">
        <h2 className="text-xl font-black text-brand-navy">Feature flags</h2>
        <dl className="mt-4 grid gap-3">
          {flags.map((flag) => <div key={flag.key} className="flex justify-between border-b pb-2"><dt>{flag.key}</dt><dd className="font-bold">{flag.enabled ? "Ativa" : "Desativada"}</dd></div>)}
        </dl>
      </Card>
    </main>
  );
}
