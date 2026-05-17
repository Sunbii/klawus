import Link from "next/link";
import { prisma } from "../../../lib/db";
import { requireAdmin } from "../../../lib/auth";
import { toggleColumnPublishAction, deleteColumnAction } from "../actions";

export default async function AdminColumnsPage() {
  await requireAdmin();
  const columns = await prisma.column.findMany({
    orderBy: { updatedAt: "desc" },
    include: { author: { select: { name: true, email: true } } },
  });

  return (
    <div className="cms-wide">
      <h1 className="cms-h1">변호사 컬럼</h1>
      <p className="cms-muted">변호사가 작성한 컬럼의 공개/비공개를 토글하거나 삭제합니다.</p>
      <table className="cms-table">
        <thead>
          <tr>
            <th>제목</th>
            <th>저자</th>
            <th>분야</th>
            <th>수정일</th>
            <th>상태</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {columns.map((c) => (
            <tr key={c.id}>
              <td>
                <Link href={`/admin/columns/${c.id}/edit`} className="cms-link">{c.title}</Link>
                <div className="cms-muted cms-tiny">{c.excerpt.slice(0, 80)}{c.excerpt.length > 80 ? "…" : ""}</div>
              </td>
              <td>{c.author.name}<div className="cms-muted cms-tiny">{c.author.email}</div></td>
              <td>{c.field}</td>
              <td>{new Date(c.updatedAt).toISOString().slice(0, 10)}</td>
              <td>
                {c.published ? (
                  <span className="cms-pill cms-pill-on">공개</span>
                ) : (
                  <span className="cms-pill">비공개</span>
                )}
              </td>
              <td>
                <form action={toggleColumnPublishAction} style={{ display: "inline-block", marginRight: 6 }}>
                  <input type="hidden" name="id" value={c.id} />
                  <button type="submit" className="cms-btn">{c.published ? "비공개" : "공개"}</button>
                </form>
                <form action={deleteColumnAction} style={{ display: "inline-block" }}>
                  <input type="hidden" name="id" value={c.id} />
                  <button type="submit" className="cms-btn-danger">삭제</button>
                </form>
              </td>
            </tr>
          ))}
          {columns.length === 0 && (
            <tr><td colSpan={6} className="cms-empty">아직 작성된 컬럼이 없습니다.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
