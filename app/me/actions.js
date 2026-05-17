"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "../../lib/db";
import { getSession } from "../../lib/session";
import { requireLawyer } from "../../lib/auth";
import { slugify } from "../../lib/codes";

export async function redeemAction(formData) {
  const code = String(formData.get("code") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const name = String(formData.get("name") || "").trim();
  const firm = String(formData.get("firm") || "").trim() || null;
  const barNumber = String(formData.get("barNumber") || "").trim() || null;
  const state = String(formData.get("state") || "").trim() || null;
  const field = String(formData.get("field") || "").trim() || null;
  const bio = String(formData.get("bio") || "").trim() || null;

  if (!code || !email || !name || password.length < 8) {
    redirect(`/redeem/${encodeURIComponent(code)}?e=fields`);
  }

  const invite = await prisma.inviteCode.findUnique({ where: { code } });
  if (!invite || invite.redeemedAt) {
    redirect(`/redeem/${encodeURIComponent(code)}?e=code`);
  }

  const dupe = await prisma.lawyer.findUnique({ where: { email } });
  if (dupe) redirect(`/redeem/${encodeURIComponent(code)}?e=email`);

  const passwordHash = await bcrypt.hash(password, 12);
  const lawyer = await prisma.lawyer.create({
    data: {
      email, passwordHash, name, firm, barNumber, state, field, bio,
      inviteCodeId: invite.id,
    },
  });
  await prisma.inviteCode.update({ where: { id: invite.id }, data: { redeemedAt: new Date() } });

  const session = await getSession();
  session.kind = "lawyer";
  session.lawyerId = lawyer.id;
  await session.save();
  redirect("/me");
}

export async function lawyerLoginAction(formData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  if (!email || !password) redirect("/login?e=1");

  const lawyer = await prisma.lawyer.findUnique({ where: { email } });
  if (!lawyer) redirect("/login?e=1");
  const ok = await bcrypt.compare(password, lawyer.passwordHash);
  if (!ok) redirect("/login?e=1");

  const session = await getSession();
  session.kind = "lawyer";
  session.lawyerId = lawyer.id;
  await session.save();
  redirect("/me");
}

export async function lawyerLogoutAction() {
  const session = await getSession();
  session.destroy();
  redirect("/");
}

export async function saveOwnColumnAction(formData) {
  const lawyer = await requireLawyer();
  const id = formData.get("id") ? String(formData.get("id")) : null;
  const title = String(formData.get("title") || "").trim();
  const field = String(formData.get("field") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  const body = String(formData.get("body") || "");
  const cat = String(formData.get("cat") || "cat-realestate");
  const sponsorLabel = String(formData.get("sponsorLabel") || "").trim() || null;
  const sponsorWho = String(formData.get("sponsorWho") || "").trim() || null;
  const sponsorContact = String(formData.get("sponsorContact") || "").trim() || null;
  const publish = formData.get("publish") === "on";

  if (!title) redirect(id ? `/me/columns/${id}/edit?e=title` : `/me/columns/new?e=title`);

  if (id) {
    const existing = await prisma.column.findUnique({ where: { id } });
    if (!existing || existing.authorId !== lawyer.id) redirect("/me");
    await prisma.column.update({
      where: { id },
      data: {
        title, field, excerpt, body, cat,
        sponsorLabel, sponsorWho, sponsorContact,
        published: publish,
        publishedAt: publish ? existing.publishedAt ?? new Date() : null,
      },
    });
  } else {
    await prisma.column.create({
      data: {
        slug: slugify(title, "column"),
        title, field, excerpt, body, cat,
        sponsorLabel, sponsorWho, sponsorContact,
        published: publish,
        publishedAt: publish ? new Date() : null,
        authorId: lawyer.id,
      },
    });
  }
  revalidatePath("/me");
  revalidatePath("/");
  redirect("/me");
}

export async function deleteOwnColumnAction(formData) {
  const lawyer = await requireLawyer();
  const id = String(formData.get("id"));
  const col = await prisma.column.findUnique({ where: { id } });
  if (!col || col.authorId !== lawyer.id) redirect("/me");
  await prisma.column.delete({ where: { id } });
  revalidatePath("/me");
  revalidatePath("/");
  redirect("/me");
}
