import Link from "next/link";
import { prisma } from "../../../lib/db";
import { requireAdmin } from "../../../lib/auth";
import { deleteScamTypeAction, toggleScamTypePublishAction } from "./actions";

export default async function ScamTypesPage() {
  await requireAdmin();
  const items = await prisma.scamType.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });

  return (
    <div className="cms-wide">
      <div className="cms-row-between">
        <h1 className="cms-h1">사기 유형 도감</h1>
        <Link href="/admin/scam-types/new" className="cms-btn-primary">+ 새 유형</Link>
      </div>
      <p className="cms-muted">홈의 도감 섹션에 노출됩니다. 비공개 항목은 홈에서 빠집니다. 순서 숫자가 작을수록 앞에 옵니다.</p>

      <table className="cms-table">
        <thead>
          <tr>
            <th style={{ width: 48 }}>아이콘</th>
            <th style={{ width: 60 }}>순서</th>
            <th>제목</th>
            <th>수법</th>
            <th>적신호</th>
            <th>대응</th>
            <th>공개</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((s) => (
            <tr key={s.id}>
              <td>
                {s.iconFileId ? (
                  <img src={`/api/files/${s.iconFileId}`} alt="" style={{ width: 36, height: 36, objectFit: "cover", border: "1px solid var(--line)" }} />
                ) : (
                  <div style={{ width: 36, height: 36, background: "var(--paper-dim)", border: "1px solid var(--line)" }} />
                )}
              </td>
              <td>{s.order}</td>
              <td>
                <Link href={`/admin/scam-types/${s.id}/edit`} className="cms-link">{s.title}</Link>
              </td>
              <td className="cms-tiny" style={{ maxWidth: 240 }}>{s.sign}</td>
              <td className="cms-tiny" style={{ maxWidth: 220 }}>{s.flag}</td>
              <td className="cms-tiny" style={{ maxWidth: 220 }}>{s.act}</td>
              <td>
                <form action={toggleScamTypePublishAction} style={{ display: "inline" }}>
                  <input type="hidden" name="id" value={s.id} />
                  <button type="submit" className={`cms-pill ${s.published ? "cms-pill-on" : ""}`} style={{ border: "1px solid currentColor", background: "transparent", cursor: "pointer" }}>
                    {s.published ? "공개" : "비공개"}
                  </button>
                </form>
              </td>
              <td>
                <form action={deleteScamTypeAction} style={{ display: "inline" }}>
                  <input type="hidden" name="id" value={s.id} />
                  <button type="submit" className="cms-btn-danger">삭제</button>
                </form>
              </td>
            </tr>
          ))}
          {items.length === 0 && <tr><td colSpan={8} className="cms-empty">등록된 사기 유형이 없습니다. (홈에서는 하드코딩 폴백 12종이 표시됩니다)</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
