import Link from "next/link";
import { prisma } from "../../../lib/db";
import { requireAdmin } from "../../../lib/auth";

const TYPE = {
  CREDIT_CHECK: "신용 조회",
  BACKGROUND_CHECK: "백그라운드 체크",
  DEBT_CREDIT_REPORTING: "채권 신용리포팅",
};
const STATUS = { PENDING: "접수", IN_PROGRESS: "처리 중", COMPLETED: "완료", REJECTED: "반려" };
const PAY = { UNPAID: "미지급", PAID: "지급", WAIVED: "면제", REFUNDED: "환불" };

export default async function AdminServicesPage({ searchParams }) {
  await requireAdmin();
  const sp = await searchParams;
  const status = ["PENDING", "IN_PROGRESS", "COMPLETED", "REJECTED"].includes(sp?.status) ? sp.status : null;

  const items = await prisma.serviceRequest.findMany({
    where: status ? { status } : {},
    orderBy: { requestedAt: "desc" },
    include: { user: { select: { name: true, email: true, role: true } } },
  });

  return (
    <div className="cms-wide">
      <div className="cms-row-between">
        <h1 className="cms-h1">서비스 요청</h1>
        <div className="cms-row">
          <Link href="/admin/services" className={`cms-btn ${!status ? "cms-btn-primary" : ""}`}>전체</Link>
          <Link href="/admin/services?status=PENDING" className={`cms-btn ${status === "PENDING" ? "cms-btn-primary" : ""}`}>대기</Link>
          <Link href="/admin/services?status=IN_PROGRESS" className={`cms-btn ${status === "IN_PROGRESS" ? "cms-btn-primary" : ""}`}>처리중</Link>
          <Link href="/admin/services?status=COMPLETED" className={`cms-btn ${status === "COMPLETED" ? "cms-btn-primary" : ""}`}>완료</Link>
        </div>
      </div>
      <p className="cms-muted">회원 신청을 검토·처리합니다. 채권 신용리포팅은 신용정보 회사(Experian/TransUnion/Equifax) 보고 상태도 같이 관리합니다.</p>

      <table className="cms-table">
        <thead>
          <tr><th>유형</th><th>대상</th><th>신청자</th><th>상태</th><th>지불</th><th>금액</th><th>신청</th></tr>
        </thead>
        <tbody>
          {items.map((s) => (
            <tr key={s.id}>
              <td>{TYPE[s.type] || s.type}</td>
              <td><Link href={`/admin/services/${s.id}/edit`} className="cms-link">{s.subjectName}</Link>
                <div className="cms-muted cms-tiny">{s.note ? s.note.slice(0, 60) : ""}</div>
              </td>
              <td>{s.user.name}<div className="cms-muted cms-tiny">{s.user.email}</div></td>
              <td><span className={`cms-pill ${s.status === "COMPLETED" ? "cms-pill-on" : ""}`}>{STATUS[s.status] || s.status}</span></td>
              <td className="cms-tiny">{PAY[s.payment] || s.payment}</td>
              <td className="cms-tiny">${(s.priceCents/100).toFixed(2)}</td>
              <td className="cms-tiny">{new Date(s.requestedAt).toISOString().slice(0, 10)}</td>
            </tr>
          ))}
          {items.length === 0 && <tr><td colSpan={7} className="cms-empty">신청된 서비스가 없습니다.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
