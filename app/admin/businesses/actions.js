"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../lib/db";
import { requireAdmin } from "../../../lib/auth";

export async function saveBusinessAction(formData) {
  await requireAdmin();
  const id = formData.get("id") ? String(formData.get("id")) : null;
  const name = String(formData.get("name") || "").trim();
  if (!name) {
    redirect(id ? `/admin/businesses/${id}/edit?e=name` : `/admin/businesses/new?e=name`);
  }
  const data = {
    name,
    category: String(formData.get("category") || "").trim() || "기타",
    location: String(formData.get("location") || "").trim(),
    phone: String(formData.get("phone") || "").trim() || null,
    website: String(formData.get("website") || "").trim() || null,
    endorsedBy: String(formData.get("endorsedBy") || "").trim() || null,
    note: String(formData.get("note") || "").trim() || null,
    photoFileId: String(formData.get("photoFileId") || "").trim() || null,
    order: parseInt(String(formData.get("order") || "0"), 10) || 0,
    published: formData.get("published") === "on",
  };
  if (id) {
    await prisma.honestBusiness.update({ where: { id }, data });
  } else {
    await prisma.honestBusiness.create({ data });
  }
  revalidatePath("/admin/businesses");
  revalidatePath("/businesses");
  revalidatePath("/");
  redirect("/admin/businesses");
}

export async function deleteBusinessAction(formData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.honestBusiness.delete({ where: { id } });
  revalidatePath("/admin/businesses");
  revalidatePath("/businesses");
  revalidatePath("/");
}
