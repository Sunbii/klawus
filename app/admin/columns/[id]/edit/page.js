import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../../../lib/db";
import { requireAdmin } from "../../../../../lib/auth";
import ColumnEditor from "../../../../me/columns/ColumnEditor";

async function saveColumnAdminAction(formData) {
  "use server";
  await requireAdmin();
  const id = String(formData.get("id"));
  const data = {
    title: String(formData.get("title") || "").trim(),
    field: String(formData.get("field") || "").trim(),
    cat: String(formData.get("cat") || "cat-realestate"),
    excerpt: String(formData.get("excerpt") || "").trim(),
    body: String(formData.get("body") || ""),
    coverImageId: String(formData.get("coverImageId") || "").trim() || null,
    sponsorLabel: String(formData.get("sponsorLabel") || "").trim() || null,
    sponsorWho: String(formData.get("sponsorWho") || "").trim() || null,
    sponsorContact: String(formData.get("sponsorContact") || "").trim() || null,
  };
  await prisma.column.update({ where: { id }, data });
  revalidatePath("/admin/columns");
  revalidatePath("/");
  revalidatePath(`/columns/${id}`);
  redirect("/admin/columns");
}

export default async function AdminEditColumnPage({ params }) {
  await requireAdmin();
  const { id } = await params;
  const col = await prisma.column.findUnique({ where: { id } });
  if (!col) notFound();

  return (
    <div className="cms-wide">
      <h1 className="cms-h1">컬럼 수정 (Admin)</h1>
      <ColumnEditor
        column={col}
        action={saveColumnAdminAction}
        cancelHref="/admin/columns"
        showPublish={false}
      />
    </div>
  );
}
