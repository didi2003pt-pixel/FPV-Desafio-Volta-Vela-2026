import Link from "next/link";
import { requireRole } from "@/lib/authorization";
import { logoutAction } from "../(auth)/actions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole("ADMIN", "SUPERADMIN", "RESULTS_MANAGER");
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b bg-brand-navy text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <Link href="/admin" className="font-black">Desafio Volta · Administração</Link>
          <form action={logoutAction}><button className="rounded-lg border border-white/30 px-3 py-2 text-sm font-bold">Sair · {user.profile?.nickname}</button></form>
        </div>
      </header>
      {children}
    </div>
  );
}
