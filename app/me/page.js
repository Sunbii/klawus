import Link from "next/link";
import { prisma } from "../../lib/db";
import { requireLawyer } from "../../lib/auth";
import { deleteOwnColumnAction } from "./actions";

export default async function MeDashboard() {
  const lawyer = await requireLawyer();
  const cols = await prisma.column.findMany({
    where: { authorId: lawyer.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="cms-wide">
      <div className="cms-row-between">
        <h1 className="cms-h1">내 컬럼</h1>
        <Link href="/me/columns/new" className="cms-btn-primary">+ 새 컬럼 작성</Link>
      </div>
      <p className="cms-muted">작성한 컬럼을 수정·삭제할 수 있습니다. 공개 토글은 게시 직후 홈에서 노출됩니다.</p>

      <table className="cms-table">
        <thead>
          <tr><th>제목</th><th>분야</th><th>수정일</th><th>상태</th><th></th></tr>
        </thead>
        <tbody>
          {cols.map((c) => (
            <tr key={c.id}>
              <td>
                <Link href={`/me/columns/${c.id}/edit`} className="cms-link">{c.title}</Link>
                <div className="cms-muted cms-tiny">{c.excerpt.slice(0, 80)}{c.excerpt.length > 80 ? "…" : ""}</div>
              </td>
              <td>{c.field}</td>
              <td>{new Date(c.updatedAt).toISOString().slice(0, 10)}</td>
              <td>{c.published ? <span className="cms-pill cms-pill-on">공개</span> : <span className="cms-pill">비공개</span>}</td>
              <td>
                <form action={deleteOwnColumnAction} style={{ display: "inline" }}>
                  <input type="hidden" name="id" value={c.id} />
                  <button type="submit" className="cms-btn-danger">삭제</button>
                </form>
              </td>
            </tr>
          ))}
          {cols.length === 0 && <tr><td colSpan={5} className="cms-empty">아직 작성한 컬럼이 없습니다.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
