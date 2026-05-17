"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../lib/db";
import { requireAdmin } from "../../../lib/auth";

const SEVERITIES = ["HIGH", "MEDIUM", "LOW"];

export async function saveAlertAction(formData) {
  await requireAdmin();
  const id = formData.get("id") ? String(formData.get("id")) : null;
  const title = String(formData.get("title") || "").trim();
  const body = String(formData.get("body") || "").trim();
  if (!title || !body) {
    redirect(id ? `/admin/alerts/${id}/edit?e=fields` : `/admin/alerts/new?e=fields`);
  }
  const severity = SEVERITIES.includes(formData.get("severity")) ? formData.get("severity") : "HIGH";
  const expires = String(formData.get("expiresAt") || "").trim();
  const data = {
    title, body,
    link: String(formData.get("link") || "").trim() || null,
    severity,
    active: formData.get("active") === "on",
    popup: formData.get("popup") === "on",
    expiresAt: expires ? new Date(expires) : null,
  };
  if (id) {
    await prisma.scamAlert.update({ where: { id }, data });
  } else {
    await prisma.scamAlert.create({ data });
  }
  revalidatePath("/admin/alerts");
  revalidatePath("/");
  redirect("/admin/alerts");
}

export async function deleteAlertAction(formData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.scamAlert.delete({ where: { id } });
  revalidatePath("/admin/alerts");
  revalidatePath("/");
}

export async function toggleAlertActiveAction(formData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const cur = await prisma.scamAlert.findUnique({ where: { id } });
  if (!cur) return;
  await prisma.scamAlert.update({ where: { id }, data: { active: !cur.active } });
  revalidatePath("/admin/alerts");
  revalidatePath("/");
}
