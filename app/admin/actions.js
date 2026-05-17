"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "../../lib/db";
import { getSession } from "../../lib/session";
import { requireAdmin, isAdminPasswordValid } from "../../lib/auth";
import { generateInviteCode, slugify } from "../../lib/codes";
import {
  queueEmail,
  tplServiceStatus,
  tplColumnPublished,
  tplScammerTransition,
} from "../../lib/email";

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
  const col = await prisma.column.findUnique({
    where: { id },
    include: { author: { select: { id: true, name: true, email: true } } },
  });
  if (!col) return;
  const becomingPublic = !col.published;
  const updated = await prisma.column.update({
    where: { id },
    data: {
      published: becomingPublic,
      publishedAt: becomingPublic ? (col.publishedAt ?? new Date()) : col.publishedAt,
    },
  });
  if (becomingPublic) {
    await queueEmail(tplColumnPublished(col.author, { ...updated, slug: col.slug, title: col.title }));
  }
  revalidatePath("/admin/columns");
  revalidatePath("/");
  revalidatePath(`/columns/${col.slug}`);
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

  const photoFileId = String(formData.get("photoFileId") || "").trim() || null;

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
    photoFileId,
  };

  if (id) {
    await prisma.scammer.update({ where: { id }, data });
    await prisma.scammerReview.create({
      data: { scammerId: id, action: "edit", byAdmin: true, toStatus: data.status },
    });
  } else {
    const created = await prisma.scammer.create({
      data: { ...data, slug: slugify(name, "scammer") },
    });
    await prisma.scammerReview.create({
      data: { scammerId: created.id, action: "submitted", byAdmin: true, toStatus: data.status },
    });
  }
  revalidatePath("/admin/scammers");
  revalidatePath("/");
  redirect("/admin/scammers");
}

export async function transitionScammerAction(formData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const toStatus = String(formData.get("toStatus") || "");
  const action = String(formData.get("action") || "edit");
  const note = String(formData.get("note") || "").trim() || null;
  const publishOverride = formData.get("publish");

  const cur = await prisma.scammer.findUnique({ where: { id } });
  if (!cur) redirect("/admin/scammers");

  const update = {};
  if (["PENDING", "SCREENED", "EVIDENCE"].includes(toStatus)) update.status = toStatus;
  if (publishOverride === "on") update.published = true;
  if (publishOverride === "off") update.published = false;

  const refreshed = await prisma.scammer.update({
    where: { id },
    data: update,
    include: { submittedBy: { select: { email: true } } },
  });
  await prisma.scammerReview.create({
    data: {
      scammerId: id,
      action,
      fromStatus: cur.status,
      toStatus: update.status ?? cur.status,
      note,
      byAdmin: true,
    },
  });

  const notifyEmail = refreshed.submittedBy?.email || refreshed.submitterEmail;
  if (notifyEmail && update.status && update.status !== cur.status) {
    await queueEmail(tplScammerTransition(notifyEmail, refreshed, note));
  }

  revalidatePath("/admin/scammers");
  revalidatePath(`/admin/scammers/${id}/edit`);
  revalidatePath("/");
  redirect(`/admin/scammers/${id}/edit`);
}

export async function deleteScammerAction(formData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.scammer.delete({ where: { id } });
  revalidatePath("/admin/scammers");
  revalidatePath("/");
}

export async function saveServiceAdminAction(formData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const existing = await prisma.serviceRequest.findUnique({ where: { id } });
  if (!existing) redirect("/admin/services");

  const status = String(formData.get("status") || existing.status);
  const payment = String(formData.get("payment") || existing.payment);
  const priceCents = Math.round(parseFloat(String(formData.get("price") || "0")) * 100) || 0;
  const adminNote = String(formData.get("adminNote") || "").trim() || null;
  const resultUrl = String(formData.get("resultUrl") || "").trim() || null;

  const bureauStatus = String(formData.get("bureauStatus") || existing.bureauStatus || "NONE");
  const reportExperian = formData.get("reportExperian") === "on";
  const reportTransUnion = formData.get("reportTransUnion") === "on";
  const reportEquifax = formData.get("reportEquifax") === "on";
  const metroExportUrl = String(formData.get("metroExportUrl") || "").trim() || null;

  const updated = await prisma.serviceRequest.update({
    where: { id },
    data: {
      status, payment, priceCents,
      adminNote, resultUrl,
      bureauStatus, reportExperian, reportTransUnion, reportEquifax, metroExportUrl,
      completedAt: status === "COMPLETED" ? (existing.completedAt ?? new Date()) : null,
    },
    include: { user: { select: { name: true, email: true } } },
  });
  if (status !== existing.status) {
    await queueEmail(tplServiceStatus(updated.user, updated));
  }
  revalidatePath("/admin/services");
  revalidatePath("/me/services");
  redirect("/admin/services");
}

export async function deleteServiceAction(formData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.serviceRequest.delete({ where: { id } });
  revalidatePath("/admin/services");
}
