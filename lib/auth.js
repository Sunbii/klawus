import { redirect } from "next/navigation";
import { getSession } from "./session";
import { prisma } from "./db";

export async function getCurrentUser() {
  const session = await getSession();
  if (session.kind !== "user" || !session.userId) return null;
  return prisma.user.findUnique({ where: { id: session.userId } });
}

export async function getSessionState() {
  const session = await getSession();
  if (session.kind === "admin") return { kind: "admin" };
  if (session.kind === "user" && session.userId) {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, name: true, role: true, email: true },
    });
    if (user) return { kind: "user", user };
  }
  return { kind: "guest" };
}

export async function requireAdmin() {
  const session = await getSession();
  if (session.kind !== "admin") redirect("/admin/login");
}

export async function requireUser() {
  const session = await getSession();
  if (session.kind !== "user" || !session.userId) redirect("/login");
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) redirect("/login");
  return user;
}

export async function requireLawyer() {
  const user = await requireUser();
  if (user.role !== "LAWYER") redirect("/me");
  return user;
}

export async function requireMember() {
  const user = await requireUser();
  if (user.role !== "MEMBER") redirect("/me");
  return user;
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
