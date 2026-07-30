import Image from "next/image";
import Link from "next/link";
import { Card } from "@desafio/ui";

const modules = [
  ["Base de dados", "PostgreSQL, Prisma 7 e migração inicial versionada."],
  ["Autenticação", "Argon2id, sessões opacas, verificação de email e permissões."],
  ["Seeds oficiais", "30 embarcações e 8 etapas, sem resultados históricos."],
  ["Infraestrutura", "Redis, MinIO e Mailpit para desenvolvimento local."],
];

export default function FoundationPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-5 py-8 sm:px-8">
      <header className="overflow-hidden rounded-3xl bg-brand-navy text-white shadow-xl">
        <Image
          src="/brand/percurso-etapas-2026.png"
          width={1268}
          height={357}
          alt="Percurso e oito etapas da Volta a Portugal à Vela 2026"
          priority
          className="h-auto w-full"
        />
        <div className="grid gap-5 p-7 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-yellow">Fase 1 · Fundação</p>
            <h1 className="mt-2 text-3xl font-black sm:text-5xl">Desafio Volta à Vela</h1>
            <p className="mt-3 max-w-2xl text-white/80">
              Repositório, dados, autenticação e infraestrutura. A interface pública do jogo ainda está desativada.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="rounded-xl bg-white px-5 py-3 font-bold text-brand-navy" href="/login">Entrar</Link>
            <Link className="rounded-xl border border-white/30 px-5 py-3 font-bold" href="/register">Registo técnico</Link>
          </div>
        </div>
      </header>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        {modules.map(([title, description]) => (
          <Card key={title}>
            <h2 className="text-xl font-black text-brand-navy">{title}</h2>
            <p className="mt-2 text-slate-600">{description}</p>
          </Card>
        ))}
      </section>

      <aside className="mt-8 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-950">
        <strong>Estado:</strong> o jogo público, as previsões e a integração automática Sailti estão desligados por feature flags.
      </aside>
    </main>
  );
}
