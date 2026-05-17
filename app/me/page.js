import Link from "next/link";
import { prisma } from "../../lib/db";
import { requireUser } from "../../lib/auth";
import { deleteOwnColumnAction } from "./actions";

const SVC_LABEL = {
  CREDIT_CHECK: "신용 조회",
  BACKGROUND_CHECK: "백그라운드 체크",
  DEBT_CREDIT_REPORTING: "채권 신용리포팅",
};
const SVC_STATUS = {
  PENDING: "접수",
  IN_PROGRESS: "처리 중",
  COMPLETED: "완료",
  REJECTED: "반려",
};

export default async function MeDashboard() {
  const user = await requireUser();
  const isLawyer = user.role === "LAWYER";

  const [cols, services] = await Promise.all([
    isLawyer
      ? prisma.column.findMany({ where: { authorId: user.id }, orderBy: { updatedAt: "desc" } })
      : Promise.resolve([]),
    prisma.serviceRequest.findMany({
      where: { userId: user.id },
      orderBy: { requestedAt: "desc" },
      take: 8,
    }),
  ]);

  return (
    <div className="cms-wide">
      <h1 className="cms-h1">대시보드</h1>
      <p className="cms-muted">
        {isLawyer
          ? "변호사 계정입니다. 컬럼 작성·수정과 서비스 요청 모두 가능합니다."
          : "회원 계정입니다. 신용 조회·백그라운드 체크·채권 신용리포팅 요청을 신청하실 수 있습니다."}
      </p>

      {isLawyer && (
        <>
          <div className="cms-row-between" style={{ marginTop: 18 }}>
            <h2 className="cms-h1" style={{ fontSize: 20 }}>내 컬럼</h2>
            <Link href="/me/columns/new" className="cms-btn-primary">+ 새 컬럼</Link>
          </div>
          <table className="cms-table">
            <thead><tr><th>제목</th><th>분야</th><th>수정</th><th>상태</th><th></th></tr></thead>
            <tbody>
              {cols.map((c) => (
                <tr key={c.id}>
                  <td><Link href={`/me/columns/${c.id}/edit`} className="cms-link">{c.title}</Link>
                    <div className="cms-muted cms-tiny">{c.excerpt.slice(0, 80)}{c.excerpt.length > 80 ? "…" : ""}</div>
                  </td>
                  <td>{c.field}</td>
                  <td className="cms-tiny">{new Date(c.updatedAt).toISOString().slice(0, 10)}</td>
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
        </>
      )}

      <div className="cms-row-between" style={{ marginTop: 26 }}>
        <h2 className="cms-h1" style={{ fontSize: 20 }}>서비스 요청</h2>
        <Link href="/me/services/new" className="cms-btn-primary">+ 서비스 신청</Link>
      </div>
      <table className="cms-table">
        <thead><tr><th>유형</th><th>대상</th><th>상태</th><th>지불</th><th>접수</th></tr></thead>
        <tbody>
          {services.map((s) => (
            <tr key={s.id}>
              <td>{SVC_LABEL[s.type] || s.type}</td>
              <td>{s.subjectName}</td>
              <td><span className="cms-pill">{SVC_STATUS[s.status] || s.status}</span></td>
              <td className="cms-tiny">{s.payment === "PAID" ? "지급" : s.payment === "WAIVED" ? "면제" : "미지급"} · ${(s.priceCents/100).toFixed(2)}</td>
              <td className="cms-tiny">{new Date(s.requestedAt).toISOString().slice(0, 10)}</td>
            </tr>
          ))}
          {services.length === 0 && <tr><td colSpan={5} className="cms-empty">아직 요청한 서비스가 없습니다.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
