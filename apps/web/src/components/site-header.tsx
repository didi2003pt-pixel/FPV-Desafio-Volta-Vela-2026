import Image from "next/image";
import Link from "next/link";
import { getCurrentSession } from "@/lib/session";
import { logoutAction } from "@/app/(auth)/actions";

export async function SiteHeader() {
  const session = await getCurrentSession();

  return (
    <header className="border-b border-white/10 bg-brand-navy text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <Link href="/" className="flex items-center gap-3 font-black">
          <Image
            src="/brand/volta-portugal-vela-2026.jpg"
            alt="Volta a Portugal à Vela 2026"
            width={52}
            height={52}
            className="size-11 rounded-lg bg-white object-contain"
          />
          <span className="hidden sm:inline">Desafio Volta à Vela</span>
        </Link>
        <nav aria-label="Navegação principal" className="flex flex-wrap items-center justify-end gap-2 text-sm font-bold">
          <Link className="rounded-lg px-3 py-2 hover:bg-white/10" href="/etapas">Etapas</Link>
          <Link className="rounded-lg px-3 py-2 hover:bg-white/10" href="/embarcacoes">Embarcações</Link>
          <Link className="rounded-lg bg-brand-red px-3 py-2" href="/jogar">Jogar</Link>
          {session ? (
            <>
              <Link className="rounded-lg px-3 py-2 hover:bg-white/10" href="/perfil">Perfil</Link>
              <form action={logoutAction}>
                <button className="rounded-lg border border-white/25 px-3 py-2">Sair</button>
              </form>
            </>
          ) : (
            <Link className="rounded-lg border border-white/25 px-3 py-2" href="/login">Entrar</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
