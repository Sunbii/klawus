import { redirect } from "next/navigation";
import { getSession } from "./session";
import { prisma } from "./db";

export async function getCurrentLawyer() {
  const session = await getSession();
  if (!session.kind || session.kind !== "lawyer" || !session.lawyerId) return null;
  return prisma.lawyer.findUnique({ where: { id: session.lawyerId } });
}

export async function requireAdmin() {
  const session = await getSession();
  if (session.kind !== "admin") redirect("/admin/login");
}

export async function requireLawyer() {
  const session = await getSession();
  if (session.kind !== "lawyer" || !session.lawyerId) redirect("/login");
  const lawyer = await prisma.lawyer.findUnique({ where: { id: session.lawyerId } });
  if (!lawyer) redirect("/login");
  return lawyer;
}

export function isAdminPasswordValid(input) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  if (!input || input.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ input.charCodeAt(i);
  }
  return mismatch === 0;
}
