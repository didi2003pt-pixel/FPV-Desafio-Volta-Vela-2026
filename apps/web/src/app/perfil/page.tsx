import Link from "next/link";
import { Card } from "@desafio/ui";
import { prisma } from "@desafio/database";
import { SiteHeader } from "@/components/site-header";
import { requireUser } from "@/lib/authorization";
import { formatDateTime } from "@/lib/game/format";
import { ProfileForm } from "./profile-form";

export const metadata = { title: "Perfil" };

export default async function ProfilePage() {
  const user = await requireUser();
  const [profile, cities, predictions] = await Promise.all([
    prisma.profile.findUniqueOrThrow({ where: { userId: user.id } }),
    prisma.city.findMany({ where: { active: true }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.prediction.findMany({
      where: { userId: user.id },
      orderBy: { submittedAt: "desc" },
      include: { market: { include: { stage: true, class: true } } },
      take: 20,
    }),
  ]);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <h1 className="text-4xl font-black text-brand-navy">O teu perfil</h1>
        <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <Card>
            <h2 className="text-xl font-black text-brand-navy">Dados públicos</h2>
            <p className="mt-2 text-sm text-slate-500">O email nunca aparece nas classificações.</p>
            <div className="mt-6"><ProfileForm profile={profile} cities={cities} /></div>
          </Card>
          <Card>
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-black text-brand-navy">Previsões</h2>
              <Link href="/jogar" className="font-bold text-brand-blue">Nova previsão →</Link>
            </div>
            <div className="mt-5 grid gap-3">
              {predictions.map((prediction) => (
                <Link key={prediction.id} href={`/jogar/${prediction.market.stage.slug}/${prediction.market.class.code.toLowerCase()}`} className="rounded-xl border border-slate-200 p-4 hover:border-brand-blue">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div><p className="font-black text-brand-navy">Etapa {prediction.market.stage.number} · {prediction.market.class.code}</p><p className="mt-1 text-sm text-slate-500">{prediction.market.stage.name}</p></div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black">{prediction.status}</span>
                  </div>
                  <p className="mt-3 text-xs text-slate-500">Última submissão: {formatDateTime(prediction.submittedAt)}</p>
                </Link>
              ))}
              {predictions.length === 0 ? <p className="text-sm text-slate-500">Ainda não submeteste previsões.</p> : null}
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}
