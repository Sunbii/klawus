import Link from "next/link";
import { prisma } from "../../../lib/db";
import { requireUser } from "../../../lib/auth";

const TYPE = {
  CREDIT_CHECK: "신용 조회",
  BACKGROUND_CHECK: "백그라운드 체크",
  DEBT_CREDIT_REPORTING: "채권 신용리포팅",
};
const STATUS = { PENDING: "접수", IN_PROGRESS: "처리 중", COMPLETED: "완료", REJECTED: "반려" };
const PAY = { UNPAID: "미지급", PAID: "지급 완료", WAIVED: "면제", REFUNDED: "환불" };

export default async function MyServicesPage() {
  const user = await requireUser();
  const items = await prisma.serviceRequest.findMany({
    where: { userId: user.id },
    orderBy: { requestedAt: "desc" },
  });

  return (
    <div className="cms-wide">
      <div className="cms-row-between">
        <h1 className="cms-h1">내 서비스 요청</h1>
        <Link href="/me/services/new" className="cms-btn-primary">+ 새 요청</Link>
      </div>
      <p className="cms-muted">접수 → 처리 중 → 완료 단계로 진행됩니다. 결과 파일·노트는 처리 완료 후 표시됩니다.</p>

      <table className="cms-table">
        <thead>
          <tr><th>유형</th><th>대상</th><th>상태</th><th>지불</th><th>금액</th><th>접수</th><th>결과</th></tr>
        </thead>
        <tbody>
          {items.map((s) => (
            <tr key={s.id}>
              <td>{TYPE[s.type] || s.type}</td>
              <td>{s.subjectName}<div className="cms-muted cms-tiny">{s.note ? s.note.slice(0, 50) : ""}</div></td>
              <td><span className={`cms-pill ${s.status === "COMPLETED" ? "cms-pill-on" : ""}`}>{STATUS[s.status] || s.status}</span></td>
              <td className="cms-tiny">{PAY[s.payment] || s.payment}</td>
              <td className="cms-tiny">${(s.priceCents/100).toFixed(2)}</td>
              <td className="cms-tiny">{new Date(s.requestedAt).toISOString().slice(0, 10)}</td>
              <td className="cms-tiny">
                {s.resultUrl ? <a className="cms-link" href={s.resultUrl} target="_blank" rel="noreferrer">파일</a> : <span className="cms-muted">—</span>}
                {s.adminNote && <div className="cms-muted">{s.adminNote.slice(0, 60)}</div>}
              </td>
            </tr>
          ))}
          {items.length === 0 && <tr><td colSpan={7} className="cms-empty">아직 요청한 서비스가 없습니다.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
