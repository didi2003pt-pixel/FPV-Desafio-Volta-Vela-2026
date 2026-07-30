import { redirect } from "next/navigation";
import { getCurrentSession } from "./session";

export async function requireUser() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");
  return session.user;
}

export async function requireRole(...roleCodes: string[]) {
  const user = await requireUser();
  const current = new Set(user.roles.map(({ role }) => role.code));
  if (!roleCodes.some((code) => current.has(code))) redirect("/");
  return user;
}
