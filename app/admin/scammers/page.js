import Link from "next/link";
import { prisma } from "../../../lib/db";
import { requireAdmin } from "../../../lib/auth";
import { deleteScammerAction } from "../actions";

const STATUS = { EVIDENCE: "증거 확보", SCREENED: "검토 완료", PENDING: "확인 대기" };

export default async function ScammersListPage() {
  await requireAdmin();
  const items = await prisma.scammer.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <div className="cms-wide">
      <div className="cms-row-between">
        <h1 className="cms-h1">경고 명단</h1>
        <Link href="/admin/scammers/new" className="cms-btn-primary">+ 새 사례</Link>
      </div>
      <table className="cms-table">
        <thead>
          <tr>
            <th>이름</th><th>유형</th><th>지역</th><th>접수</th><th>상태</th><th>공개</th><th>최근</th><th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((s) => (
            <tr key={s.id}>
              <td><Link href={`/admin/scammers/${s.id}/edit`} className="cms-link">{s.name}</Link>
                <div className="cms-muted cms-tiny">{s.brief}</div>
              </td>
              <td>{s.type}</td>
              <td>{s.location}</td>
              <td>{s.cases}건</td>
              <td>{STATUS[s.status] || s.status}</td>
              <td>{s.published ? <span className="cms-pill cms-pill-on">공개</span> : <span className="cms-pill">비공개</span>}</td>
              <td className="cms-tiny">{new Date(s.updatedAt).toISOString().slice(0, 10)}</td>
              <td>
                <form action={deleteScammerAction} style={{ display: "inline" }}>
                  <input type="hidden" name="id" value={s.id} />
                  <button type="submit" className="cms-btn-danger">삭제</button>
                </form>
              </td>
            </tr>
          ))}
          {items.length === 0 && <tr><td colSpan={8} className="cms-empty">등록된 사례가 없습니다.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
