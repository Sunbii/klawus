import { prisma } from "../../../lib/db";
import { requireAdmin } from "../../../lib/auth";
import { createInviteAction, deleteInviteAction } from "../actions";

export default async function InvitesPage() {
  await requireAdmin();
  const invites = await prisma.inviteCode.findMany({
    orderBy: { createdAt: "desc" },
    include: { lawyer: { select: { name: true, email: true } } },
  });

  return (
    <div className="cms-wide">
      <h1 className="cms-h1">초청 코드</h1>
      <p className="cms-muted">코드를 생성한 뒤 변호사에게 직접 전달하세요. 코드 1개당 변호사 1명에게만 사용됩니다.</p>

      <form action={createInviteAction} className="cms-form cms-row">
        <input type="text" name="note" placeholder="메모 (예: 김민수 변호사, NJ Real Estate)" className="cms-input" />
        <button type="submit" className="cms-btn-primary">새 코드 생성</button>
      </form>

      <table className="cms-table">
        <thead>
          <tr>
            <th>코드</th>
            <th>메모</th>
            <th>발급일</th>
            <th>상태</th>
            <th>사용자</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {invites.map((inv) => (
            <tr key={inv.id}>
              <td className="cms-mono">{inv.code}</td>
              <td>{inv.note || <span className="cms-muted">—</span>}</td>
              <td>{new Date(inv.createdAt).toISOString().slice(0, 10)}</td>
              <td>
                {inv.redeemedAt ? (
                  <span className="cms-pill cms-pill-on">사용됨 {new Date(inv.redeemedAt).toISOString().slice(0, 10)}</span>
                ) : (
                  <span className="cms-pill">미사용</span>
                )}
              </td>
              <td>
                {inv.lawyer ? (
                  <>
                    {inv.lawyer.name}
                    <div className="cms-muted cms-tiny">{inv.lawyer.email}</div>
                  </>
                ) : (
                  <span className="cms-muted">—</span>
                )}
              </td>
              <td>
                {!inv.redeemedAt && (
                  <form action={deleteInviteAction} style={{ display: "inline" }}>
                    <input type="hidden" name="id" value={inv.id} />
                    <button type="submit" className="cms-btn-danger">삭제</button>
                  </form>
                )}
              </td>
            </tr>
          ))}
          {invites.length === 0 && (
            <tr>
              <td colSpan={6} className="cms-empty">아직 발급된 코드가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
