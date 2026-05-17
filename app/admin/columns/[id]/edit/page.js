import { notFound, redirect } from "next/navigation";
import { prisma } from "../../../../../lib/db";
import { requireAdmin } from "../../../../../lib/auth";
import { revalidatePath } from "next/cache";

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
    sponsorLabel: String(formData.get("sponsorLabel") || "").trim() || null,
    sponsorWho: String(formData.get("sponsorWho") || "").trim() || null,
    sponsorContact: String(formData.get("sponsorContact") || "").trim() || null,
  };
  await prisma.column.update({ where: { id }, data });
  revalidatePath("/admin/columns");
  revalidatePath("/");
  redirect("/admin/columns");
}

const CATS = [
  ["cat-realestate", "부동산·임대"],
  ["cat-finance", "금융·동업"],
  ["cat-crime", "형사·사기"],
  ["cat-digital", "디지털·BEC"],
  ["cat-mail", "우편"],
  ["cat-community", "이민·커뮤니티"],
];

export default async function AdminEditColumnPage({ params }) {
  await requireAdmin();
  const { id } = await params;
  const col = await prisma.column.findUnique({ where: { id } });
  if (!col) notFound();

  return (
    <div className="cms-wide">
      <h1 className="cms-h1">컬럼 수정 (Admin)</h1>
      <form action={saveColumnAdminAction} className="cms-form">
        <input type="hidden" name="id" value={col.id} />
        <label className="cms-label">제목
          <input name="title" defaultValue={col.title} required className="cms-input" />
        </label>
        <div className="cms-grid-2">
          <label className="cms-label">분야 (예: 부동산·임대차 피해)
            <input name="field" defaultValue={col.field} required className="cms-input" />
          </label>
          <label className="cms-label">카테고리 색
            <select name="cat" defaultValue={col.cat} className="cms-input">
              {CATS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
        </div>
        <label className="cms-label">발췌 (요약 2-3문장)
          <textarea name="excerpt" defaultValue={col.excerpt} rows={3} required className="cms-input" />
        </label>
        <label className="cms-label">본문 (Markdown 가능)
          <textarea name="body" defaultValue={col.body} rows={16} required className="cms-input cms-mono" />
        </label>
        <fieldset className="cms-fieldset">
          <legend>후원 (선택)</legend>
          <input name="sponsorLabel" defaultValue={col.sponsorLabel || ""} placeholder="분야 라벨 (예: 임대 분쟁·보증금 회수)" className="cms-input" />
          <input name="sponsorWho" defaultValue={col.sponsorWho || ""} placeholder="후원자 (예: 이수정 변호사 (Lee Law))" className="cms-input" />
          <input name="sponsorContact" defaultValue={col.sponsorContact || ""} placeholder="연락처 (예: (201) 555-0117 · lee-law.com)" className="cms-input" />
        </fieldset>
        <div className="cms-actions">
          <button type="submit" className="cms-btn-primary">저장</button>
          <a href="/admin/columns" className="cms-btn">취소</a>
        </div>
      </form>
    </div>
  );
}
