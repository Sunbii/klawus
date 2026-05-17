"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "../../lib/db";
import { getSession } from "../../lib/session";
import { slugify } from "../../lib/codes";

export async function submitReportAction(formData) {
  const session = await getSession();
  const userId = session.kind === "user" ? session.userId : null;

  const name = String(formData.get("name") || "").trim();
  const type = String(formData.get("type") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const brief = String(formData.get("brief") || "").trim();
  const overview = String(formData.get("overview") || "").trim();
  const submitterEmail = String(formData.get("submitterEmail") || "").trim().toLowerCase() || null;
  const photoFileId = String(formData.get("photoFileId") || "").trim() || null;
  const patterns = String(formData.get("patterns") || "")
    .split("\n").map((s) => s.trim()).filter(Boolean);

  if (!name || !type || !brief || !overview) {
    redirect("/report?e=fields");
  }
  if (!userId && !submitterEmail) {
    redirect("/report?e=email");
  }

  const created = await prisma.scammer.create({
    data: {
      slug: slugify(name, "report"),
      name, type, location: location || "—",
      brief, overview,
      patterns,
      progress: "신규 제보 — 검토 대기",
      cat: "cat-crime",
      status: "PENDING",
      published: false,
      photoFileId,
      submitterEmail: userId ? null : submitterEmail,
      submittedById: userId || null,
    },
  });

  await prisma.scammerReview.create({
    data: {
      scammerId: created.id,
      action: "submitted",
      toStatus: "PENDING",
      note: userId ? "회원 제보" : "익명 제보",
      byAdmin: false,
      byUserId: userId,
      byEmail: submitterEmail,
    },
  });

  revalidatePath("/admin/scammers");
  redirect("/report/thanks");
}
