import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "Termos e condições" };

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
        <h1 className="text-4xl font-black text-brand-navy">Termos e condições</h1>
        <div className="prose mt-7 max-w-none">
          <p>
            Minuta técnica sujeita a aprovação jurídica e institucional antes do lançamento.
          </p>
          <h2>Participação</h2>
          <p>
            As previsões são gratuitas, pessoais e ficam bloqueadas no horário definido pelo
            servidor. Tentativas de manipulação podem levar à anulação de pontos ou suspensão.
          </p>
          <h2>Resultados e correções</h2>
          <p>
            A pontuação usa resultados oficiais confirmados. Correções posteriores podem alterar
            classificações, mantendo histórico auditável.
          </p>
          <h2>Prémios</h2>
          <p>
            Elegibilidade, idade mínima, entrega, impostos e substituições devem constar do
            regulamento final de cada prémio.
          </p>
        </div>
      </main>
    </>
  );
}
