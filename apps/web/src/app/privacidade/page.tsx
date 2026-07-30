import { getEnv } from "@desafio/config";
import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "Política de privacidade" };

export default function PrivacyPage() {
  const env = getEnv();
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
        <h1 className="text-4xl font-black text-brand-navy">Política de privacidade</h1>
        <div className="prose mt-7 max-w-none">
          <p>
            Esta página é uma implementação técnica provisória e deve ser aprovada pelo responsável
            pelo tratamento e pelo apoio jurídico antes da abertura pública do jogo.
          </p>
          <h2>Dados tratados</h2>
          <p>
            Conta, perfil, cidade ou clube, consentimentos, previsões, pontuações, missões,
            notificações, prémios e registos técnicos de segurança minimizados.
          </p>
          <h2>Finalidades</h2>
          <p>
            Operar o jogo, calcular classificações, prevenir fraude, entregar prémios,
            prestar suporte e cumprir obrigações legais. Marketing exige consentimento separado.
          </p>
          <h2>Conservação</h2>
          <p>
            Sessões, tokens, notificações, logs e comunicações seguem períodos configuráveis.
            Os registos competitivos podem ser anonimizados em vez de eliminados quando isso seja
            necessário para preservar a integridade das classificações.
          </p>
          <h2>Direitos</h2>
          <p>
            O centro de privacidade permite exportar dados e apresentar pedidos. Contacto:
            {" "}<a href={`mailto:${env.PRIVACY_CONTACT_EMAIL}`}>{env.PRIVACY_CONTACT_EMAIL}</a>.
          </p>
          <h2>Segurança</h2>
          <p>
            São aplicadas sessões revogáveis, controlo de acesso, registos de auditoria,
            limitação de tentativas, cifragem em trânsito e backups protegidos.
          </p>
        </div>
      </main>
    </>
  );
}
