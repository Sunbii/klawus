import Link from "next/link";
import { prisma } from "../../../lib/db";
import { requireAdmin } from "../../../lib/auth";
import { deleteBusinessAction } from "./actions";

export default async function BusinessesAdminPage() {
  await requireAdmin();
  const items = await prisma.honestBusiness.findMany({
    orderBy: [{ order: "asc" }, { updatedAt: "desc" }],
  });
  return (
    <div className="cms-wide">
      <div className="cms-row-between">
        <h1 className="cms-h1">정직한 업체</h1>
        <Link href="/admin/businesses/new" className="cms-btn-primary">+ 새 업체</Link>
      </div>
      <p className="cms-muted">변호사·편집부가 추천한 업체. 공개 항목만 홈/공개 페이지에 노출됩니다.</p>
      <table className="cms-table">
        <thead>
          <tr><th style={{ width: 48 }}></th><th>업체</th><th>분야</th><th>지역</th><th>추천</th><th>공개</th><th></th></tr>
        </thead>
        <tbody>
          {items.map((b) => (
            <tr key={b.id}>
              <td>
                {b.photoFileId ? (
                  <img src={`/api/files/${b.photoFileId}`} alt="" style={{ width: 40, height: 40, objectFit: "cover", border: "1px solid var(--line)" }} />
                ) : (
                  <div style={{ width: 40, height: 40, background: "var(--paper-dim)", border: "1px solid var(--line)" }} />
                )}
              </td>
              <td>
                <Link href={`/admin/businesses/${b.id}/edit`} className="cms-link">{b.name}</Link>
                <div className="cms-muted cms-tiny">{b.note ? b.note.slice(0, 60) : ""}</div>
              </td>
              <td className="cms-tiny">{b.category}</td>
              <td className="cms-tiny">{b.location}</td>
              <td className="cms-tiny">{b.endorsedBy || <span className="cms-muted">—</span>}</td>
              <td><span className={`cms-pill ${b.published ? "cms-pill-on" : ""}`}>{b.published ? "공개" : "비공개"}</span></td>
              <td>
                <form action={deleteBusinessAction} style={{ display: "inline" }}>
                  <input type="hidden" name="id" value={b.id} />
                  <button type="submit" className="cms-btn-danger">삭제</button>
                </form>
              </td>
            </tr>
          ))}
          {items.length === 0 && <tr><td colSpan={7} className="cms-empty">등록된 업체가 없습니다.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
