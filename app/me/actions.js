"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "../../lib/db";
import { getSession } from "../../lib/session";
import { requireLawyer, requireUser } from "../../lib/auth";
import { slugify } from "../../lib/codes";
import {
  queueEmail,
  tplWelcomeMember,
  tplWelcomeLawyer,
  tplServiceReceived,
} from "../../lib/email";

export async function signupAction(formData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim() || null;
  const state = String(formData.get("state") || "").trim() || null;

  if (!email || !name || password.length < 8) {
    redirect("/signup?e=fields");
  }
  const dupe = await prisma.user.findUnique({ where: { email } });
  if (dupe) redirect("/signup?e=email");

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, passwordHash, name, phone, state, role: "MEMBER" },
  });

  await queueEmail(tplWelcomeMember(user));

  const session = await getSession();
  session.kind = "user";
  session.userId = user.id;
  await session.save();
  redirect("/me");
}

export async function redeemAction(formData) {
  const code = String(formData.get("code") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim() || null;
  const state = String(formData.get("state") || "").trim() || null;
  const firm = String(formData.get("firm") || "").trim() || null;
  const barNumber = String(formData.get("barNumber") || "").trim() || null;
  const field = String(formData.get("field") || "").trim() || null;
  const bio = String(formData.get("bio") || "").trim() || null;

  if (!code || !email || !name || password.length < 8) {
    redirect(`/redeem/${encodeURIComponent(code)}?e=fields`);
  }

  const invite = await prisma.inviteCode.findUnique({ where: { code } });
  if (!invite || invite.redeemedAt) {
    redirect(`/redeem/${encodeURIComponent(code)}?e=code`);
  }

  const dupe = await prisma.user.findUnique({ where: { email } });
  if (dupe) redirect(`/redeem/${encodeURIComponent(code)}?e=email`);

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      email, passwordHash, name, phone, state,
      firm, barNumber, field, bio,
      role: "LAWYER",
      inviteCodeId: invite.id,
    },
  });
  await prisma.inviteCode.update({ where: { id: invite.id }, data: { redeemedAt: new Date() } });

  await queueEmail(tplWelcomeLawyer(user));

  const session = await getSession();
  session.kind = "user";
  session.userId = user.id;
  await session.save();
  redirect("/me");
}

export async function loginAction(formData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  if (!email || !password) redirect("/login?e=1");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) redirect("/login?e=1");
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) redirect("/login?e=1");

  const session = await getSession();
  session.kind = "user";
  session.userId = user.id;
  await session.save();
  redirect("/me");
}

export async function logoutAction() {
  const session = await getSession();
  session.destroy();
  redirect("/");
}

export async function saveOwnColumnAction(formData) {
  const user = await requireLawyer();
  const id = formData.get("id") ? String(formData.get("id")) : null;
  const title = String(formData.get("title") || "").trim();
  const field = String(formData.get("field") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  const body = String(formData.get("body") || "");
  const cat = String(formData.get("cat") || "cat-realestate");
  const coverImageId = String(formData.get("coverImageId") || "").trim() || null;
  const sponsorLabel = String(formData.get("sponsorLabel") || "").trim() || null;
  const sponsorWho = String(formData.get("sponsorWho") || "").trim() || null;
  const sponsorContact = String(formData.get("sponsorContact") || "").trim() || null;
  const publish = formData.get("publish") === "on";

  if (!title) redirect(id ? `/me/columns/${id}/edit?e=title` : `/me/columns/new?e=title`);

  if (id) {
    const existing = await prisma.column.findUnique({ where: { id } });
    if (!existing || existing.authorId !== user.id) redirect("/me");
    await prisma.column.update({
      where: { id },
      data: {
        title, field, excerpt, body, cat, coverImageId,
        sponsorLabel, sponsorWho, sponsorContact,
        published: publish,
        publishedAt: publish ? existing.publishedAt ?? new Date() : null,
      },
    });
  } else {
    await prisma.column.create({
      data: {
        slug: slugify(title, "column"),
        title, field, excerpt, body, cat, coverImageId,
        sponsorLabel, sponsorWho, sponsorContact,
        published: publish,
        publishedAt: publish ? new Date() : null,
        authorId: user.id,
      },
    });
  }
  revalidatePath("/me");
  revalidatePath("/");
  if (id) revalidatePath(`/columns/${id}`);
  redirect("/me");
}

export async function deleteOwnColumnAction(formData) {
  const user = await requireLawyer();
  const id = String(formData.get("id"));
  const col = await prisma.column.findUnique({ where: { id } });
  if (!col || col.authorId !== user.id) redirect("/me");
  await prisma.column.delete({ where: { id } });
  revalidatePath("/me");
  revalidatePath("/");
  redirect("/me");
}

export async function submitServiceRequestAction(formData) {
  const user = await requireUser();
  const type = String(formData.get("type") || "");
  if (!["CREDIT_CHECK", "BACKGROUND_CHECK", "DEBT_CREDIT_REPORTING"].includes(type)) {
    redirect("/me/services/new?e=type");
  }
  const subjectName = String(formData.get("subjectName") || "").trim();
  if (!subjectName) redirect("/me/services/new?e=subject");

  const priceMap = {
    CREDIT_CHECK: 4900,        // $49.00
    BACKGROUND_CHECK: 9900,    // $99.00
    DEBT_CREDIT_REPORTING: 14900, // $149.00
  };

  const sr = await prisma.serviceRequest.create({
    data: {
      userId: user.id,
      type,
      priceCents: priceMap[type] || 0,
      subjectName,
      subjectPhone:   String(formData.get("subjectPhone") || "").trim() || null,
      subjectEmail:   String(formData.get("subjectEmail") || "").trim() || null,
      subjectAddress: String(formData.get("subjectAddress") || "").trim() || null,
      subjectDob:     String(formData.get("subjectDob") || "").trim() || null,
      subjectSsn4:    String(formData.get("subjectSsn4") || "").trim().slice(0, 4) || null,
      note:           String(formData.get("note") || "").trim() || null,
      debtAmountCents: type === "DEBT_CREDIT_REPORTING"
        ? Math.round(parseFloat(String(formData.get("debtAmount") || "0")) * 100) || null
        : null,
      debtSince:    type === "DEBT_CREDIT_REPORTING" ? (String(formData.get("debtSince") || "").trim() || null) : null,
      creditorName: type === "DEBT_CREDIT_REPORTING" ? (String(formData.get("creditorName") || "").trim() || null) : null,
    },
  });
  await queueEmail(tplServiceReceived(user, sr));
  revalidatePath("/me/services");
  revalidatePath("/admin/services");
  redirect("/me/services");
}
