"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "../../lib/db";
import { getSession } from "../../lib/session";
import { requireAdmin, isAdminPasswordValid } from "../../lib/auth";
import { generateInviteCode, slugify } from "../../lib/codes";

export async function adminLoginAction(formData) {
  const password = String(formData.get("password") || "");
  if (!isAdminPasswordValid(password)) {
    redirect("/admin/login?e=1");
  }
  const session = await getSession();
  session.kind = "admin";
  await session.save();
  redirect("/admin");
}

export async function adminLogoutAction() {
  const session = await getSession();
  session.destroy();
  redirect("/admin/login");
}

export async function createInviteAction(formData) {
  await requireAdmin();
  const note = String(formData.get("note") || "").trim() || null;
  for (let i = 0; i < 5; i++) {
    const code = generateInviteCode();
    const exists = await prisma.inviteCode.findUnique({ where: { code } });
    if (!exists) {
      await prisma.inviteCode.create({ data: { code, note } });
      break;
    }
  }
  revalidatePath("/admin/invites");
}

export async function deleteInviteAction(formData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const invite = await prisma.inviteCode.findUnique({ where: { id } });
  if (invite && !invite.redeemedAt) {
    await prisma.inviteCode.delete({ where: { id } });
  }
  revalidatePath("/admin/invites");
}

export async function toggleColumnPublishAction(formData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const col = await prisma.column.findUnique({ where: { id } });
  if (!col) return;
  await prisma.column.update({
    where: { id },
    data: {
      published: !col.published,
      publishedAt: !col.published ? new Date() : col.publishedAt,
    },
  });
  revalidatePath("/admin/columns");
  revalidatePath("/");
}

export async function deleteColumnAction(formData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.column.delete({ where: { id } });
  revalidatePath("/admin/columns");
  revalidatePath("/");
}

export async function saveScammerAction(formData) {
  await requireAdmin();
  const id = formData.get("id") ? String(formData.get("id")) : null;
  const name = String(formData.get("name") || "").trim();
  if (!name) redirect(id ? `/admin/scammers/${id}/edit?e=name` : `/admin/scammers/new?e=name`);

  const data = {
    name,
    type: String(formData.get("type") || "").trim(),
    location: String(formData.get("location") || "").trim(),
    aliases: String(formData.get("aliases") || "").trim() || null,
    cases: parseInt(String(formData.get("cases") || "1"), 10) || 1,
    status: String(formData.get("status") || "PENDING"),
    cat: String(formData.get("cat") || "cat-crime"),
    brief: String(formData.get("brief") || "").trim(),
    overview: String(formData.get("overview") || "").trim(),
    patterns: String(formData.get("patterns") || "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    progress: String(formData.get("progress") || "").trim(),
    damage: String(formData.get("damage") || "").trim() || null,
    firstReport: String(formData.get("firstReport") || "").trim() || null,
    lastUpdate: String(formData.get("lastUpdate") || "").trim() || null,
    published: formData.get("published") === "on",
  };

  if (id) {
    await prisma.scammer.update({ where: { id }, data });
  } else {
    await prisma.scammer.create({ data: { ...data, slug: slugify(name, "scammer") } });
  }
  revalidatePath("/admin/scammers");
  revalidatePath("/");
  redirect("/admin/scammers");
}

export async function deleteScammerAction(formData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.scammer.delete({ where: { id } });
  revalidatePath("/admin/scammers");
  revalidatePath("/");
}
