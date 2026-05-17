"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../lib/db";
import { requireAdmin } from "../../../lib/auth";
import { slugify } from "../../../lib/codes";

const ALLOWED_CAT = ["HISTORY", "CASE_STUDY", "PREVENTION", "SAFE_TX"];

export async function saveArticleAction(formData) {
  await requireAdmin();
  const id = formData.get("id") ? String(formData.get("id")) : null;
  const title = String(formData.get("title") || "").trim();
  const category = String(formData.get("category") || "");
  if (!title || !ALLOWED_CAT.includes(category)) {
    redirect(id ? `/admin/articles/${id}/edit?e=fields` : `/admin/articles/new?e=fields`);
  }

  const data = {
    title,
    category,
    excerpt: String(formData.get("excerpt") || "").trim(),
    body: String(formData.get("body") || ""),
    cat: String(formData.get("cat") || "cat-crime"),
    coverImageId: String(formData.get("coverImageId") || "").trim() || null,
    order: parseInt(String(formData.get("order") || "0"), 10) || 0,
    published: formData.get("published") === "on",
  };

  if (id) {
    const cur = await prisma.article.findUnique({ where: { id } });
    if (!cur) redirect("/admin/articles");
    await prisma.article.update({
      where: { id },
      data: {
        ...data,
        publishedAt: data.published ? (cur.publishedAt ?? new Date()) : null,
      },
    });
    revalidatePath(`/articles/${cur.slug}`);
  } else {
    const created = await prisma.article.create({
      data: {
        ...data,
        slug: slugify(title, "article"),
        publishedAt: data.published ? new Date() : null,
      },
    });
    revalidatePath(`/articles/${created.slug}`);
  }
  revalidatePath("/admin/articles");
  revalidatePath("/articles");
  revalidatePath("/");
  redirect("/admin/articles");
}

export async function deleteArticleAction(formData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.article.delete({ where: { id } });
  revalidatePath("/admin/articles");
  revalidatePath("/articles");
  revalidatePath("/");
}
