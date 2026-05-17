import { prisma } from "../../../lib/db";
import { requireAdmin } from "../../../lib/auth";

export default async function LawyersPage() {
  await requireAdmin();
  const lawyers = await prisma.lawyer.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      inviteCode: { select: { code: true } },
      _count: { select: { columns: true } },
    },
  });

  return (
    <div className="cms-wide">
      <h1 className="cms-h1">변호사</h1>
      <p className="cms-muted">초청 코드로 가입한 변호사 명단.</p>
      <table className="cms-table">
        <thead>
          <tr>
            <th>이름</th>
            <th>이메일</th>
            <th>분야</th>
            <th>소속</th>
            <th>주</th>
            <th>Bar #</th>
            <th>컬럼</th>
            <th>코드</th>
            <th>가입일</th>
          </tr>
        </thead>
        <tbody>
          {lawyers.map((l) => (
            <tr key={l.id}>
              <td>{l.name}</td>
              <td>{l.email}</td>
              <td>{l.field || <span className="cms-muted">—</span>}</td>
              <td>{l.firm || <span className="cms-muted">—</span>}</td>
              <td>{l.state || <span className="cms-muted">—</span>}</td>
              <td className="cms-mono cms-tiny">{l.barNumber || <span className="cms-muted">—</span>}</td>
              <td>{l._count.columns}</td>
              <td className="cms-mono cms-tiny">{l.inviteCode?.code || <span className="cms-muted">—</span>}</td>
              <td>{new Date(l.createdAt).toISOString().slice(0, 10)}</td>
            </tr>
          ))}
          {lawyers.length === 0 && (
            <tr>
              <td colSpan={9} className="cms-empty">등록된 변호사가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
