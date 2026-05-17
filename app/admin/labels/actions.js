"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "../../../lib/db";
import { requireAdmin } from "../../../lib/auth";
import { invalidateLabelCache, isKnownLabelKey, DEFAULT_LABELS } from "../../../lib/labels";

export async function saveLabelsAction(formData) {
  await requireAdmin();
  const entries = [];
  for (const [k, v] of formData.entries()) {
    if (!k.startsWith("lbl.")) continue;
    const key = k.slice(4);
    if (!isKnownLabelKey(key)) continue;
    const value = String(v || "").trim();
    if (!value) continue;
    if (value === DEFAULT_LABELS[key]) {
      await prisma.siteLabel.deleteMany({ where: { key } });
    } else {
      entries.push({ key, value });
    }
  }
  for (const e of entries) {
    await prisma.siteLabel.upsert({
      where: { key: e.key },
      update: { value: e.value },
      create: { key: e.key, value: e.value },
    });
  }
  invalidateLabelCache();
  revalidatePath("/admin/labels");
  revalidatePath("/", "layout");
  redirect("/admin/labels?saved=1");
}

export async function resetLabelAction(formData) {
  await requireAdmin();
  const key = String(formData.get("key") || "");
  if (!isKnownLabelKey(key)) return;
  await prisma.siteLabel.deleteMany({ where: { key } });
  invalidateLabelCache();
  revalidatePath("/admin/labels");
  revalidatePath("/", "layout");
}
