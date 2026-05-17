import Link from "next/link";
import { prisma } from "../../../lib/db";
import { requireAdmin } from "../../../lib/auth";

const ROLE_LABEL = { LAWYER: "변호사", MEMBER: "회원" };

export default async function UsersPage({ searchParams }) {
  await requireAdmin();
  const sp = await searchParams;
  const role = sp?.role === "LAWYER" || sp?.role === "MEMBER" ? sp.role : null;

  const users = await prisma.user.findMany({
    where: role ? { role } : {},
    orderBy: { createdAt: "desc" },
    include: {
      inviteCode: { select: { code: true } },
      _count: { select: { columns: true, serviceRequests: true } },
    },
  });

  return (
    <div className="cms-wide">
      <div className="cms-row-between">
        <h1 className="cms-h1">사용자</h1>
        <div className="cms-row">
          <Link href="/admin/users" className={`cms-btn ${!role ? "cms-btn-primary" : ""}`}>전체</Link>
          <Link href="/admin/users?role=LAWYER" className={`cms-btn ${role === "LAWYER" ? "cms-btn-primary" : ""}`}>변호사</Link>
          <Link href="/admin/users?role=MEMBER" className={`cms-btn ${role === "MEMBER" ? "cms-btn-primary" : ""}`}>회원</Link>
        </div>
      </div>
      <p className="cms-muted">변호사는 초청 코드로, 일반 회원은 /signup으로 가입합니다.</p>

      <table className="cms-table">
        <thead>
          <tr>
            <th>이름</th><th>이메일</th><th>역할</th><th>주</th><th>전화</th>
            <th>분야</th><th>컬럼</th><th>요청</th><th>가입</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td><span className={`cms-pill ${u.role === "LAWYER" ? "cms-pill-on" : ""}`}>{ROLE_LABEL[u.role]}</span></td>
              <td>{u.state || <span className="cms-muted">—</span>}</td>
              <td className="cms-tiny">{u.phone || <span className="cms-muted">—</span>}</td>
              <td className="cms-tiny">{u.field || <span className="cms-muted">—</span>}</td>
              <td>{u._count.columns}</td>
              <td>{u._count.serviceRequests}</td>
              <td className="cms-tiny">{new Date(u.createdAt).toISOString().slice(0, 10)}</td>
            </tr>
          ))}
          {users.length === 0 && <tr><td colSpan={9} className="cms-empty">등록된 사용자가 없습니다.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
