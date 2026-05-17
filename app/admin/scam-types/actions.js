"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../lib/db";
import { requireAdmin } from "../../../lib/auth";

export async function saveScamTypeAction(formData) {
  await requireAdmin();
  const id = formData.get("id") ? String(formData.get("id")) : null;
  const title = String(formData.get("title") || "").trim();
  const sign = String(formData.get("sign") || "").trim();
  const flag = String(formData.get("flag") || "").trim();
  const act = String(formData.get("act") || "").trim();
  const order = parseInt(String(formData.get("order") || "0"), 10) || 0;
  const iconFileId = String(formData.get("iconFileId") || "").trim() || null;
  const published = formData.get("published") === "on";

  if (!title || !sign || !flag || !act) {
    redirect(id ? `/admin/scam-types/${id}/edit?e=fields` : `/admin/scam-types/new?e=fields`);
  }

  const data = { title, sign, flag, act, order, iconFileId, published };
  if (id) {
    await prisma.scamType.update({ where: { id }, data });
  } else {
    await prisma.scamType.create({ data });
  }
  revalidatePath("/admin/scam-types");
  revalidatePath("/");
  redirect("/admin/scam-types");
}

export async function deleteScamTypeAction(formData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.scamType.delete({ where: { id } });
  revalidatePath("/admin/scam-types");
  revalidatePath("/");
}

export async function toggleScamTypePublishAction(formData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const cur = await prisma.scamType.findUnique({ where: { id } });
  if (!cur) return;
  await prisma.scamType.update({
    where: { id }, data: { published: !cur.published },
  });
  revalidatePath("/admin/scam-types");
  revalidatePath("/");
}
