import Link from "next/link";
import { prisma } from "../../../lib/db";
import { requireAdmin } from "../../../lib/auth";
import { retryNotificationAction } from "./actions";

const STATUS = {
  QUEUED: "대기",
  SENT: "발송 완료",
  FAILED: "실패",
  SKIPPED: "스킵 (미설정)",
};

const KIND = {
  welcome_member: "회원 환영",
  welcome_lawyer: "변호사 환영",
  service_received: "서비스 접수",
  service_status: "서비스 상태 변경",
  column_published: "컬럼 공개",
  report_received: "제보 접수",
  scammer_transition: "제보 상태 변경",
  admin_notice: "관리자 안내",
};

export default async function NotificationsPage({ searchParams }) {
  await requireAdmin();
  const sp = await searchParams;
  const filter = ["QUEUED", "SENT", "FAILED", "SKIPPED"].includes(sp?.status) ? sp.status : null;

  const items = await prisma.emailNotification.findMany({
    where: filter ? { status: filter } : {},
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const hasResend = Boolean(process.env.RESEND_API_KEY);
  const mailFrom = process.env.MAIL_FROM || "K-lawus <onboarding@resend.dev>";

  return (
    <div className="cms-wide">
      <div className="cms-row-between">
        <h1 className="cms-h1">이메일 알림</h1>
        <div className="cms-row">
          <Link href="/admin/notifications" className={`cms-btn ${!filter ? "cms-btn-primary" : ""}`}>전체</Link>
          <Link href="/admin/notifications?status=QUEUED" className={`cms-btn ${filter === "QUEUED" ? "cms-btn-primary" : ""}`}>대기</Link>
          <Link href="/admin/notifications?status=SENT" className={`cms-btn ${filter === "SENT" ? "cms-btn-primary" : ""}`}>완료</Link>
          <Link href="/admin/notifications?status=FAILED" className={`cms-btn ${filter === "FAILED" ? "cms-btn-primary" : ""}`}>실패</Link>
          <Link href="/admin/notifications?status=SKIPPED" className={`cms-btn ${filter === "SKIPPED" ? "cms-btn-primary" : ""}`}>스킵</Link>
        </div>
      </div>

      <fieldset className="cms-fieldset">
        <legend>발송 설정</legend>
        <p className="cms-tiny" style={{ margin: 0 }}>
          <strong>RESEND_API_KEY:</strong> {hasResend ? "설정됨 — 큐에 들어가는 즉시 발송 시도" : "미설정 — 큐 적재만 되고 SKIPPED 처리"}
        </p>
        <p className="cms-tiny" style={{ margin: 4 + "px 0 0" }}>
          <strong>MAIL_FROM:</strong> <span className="cms-mono">{mailFrom}</span>
        </p>
        <p className="cms-muted cms-tiny" style={{ marginTop: 6 }}>
          Resend(resend.com) 계정에서 API 키 발급 → Railway 환경변수 RESEND_API_KEY 설정.
          자체 도메인 검증 후 MAIL_FROM도 변경 권장.
        </p>
      </fieldset>

      <table className="cms-table">
        <thead>
          <tr>
            <th>유형</th><th>수신자</th><th>제목</th><th>상태</th><th>접수</th><th>완료</th><th>오류</th><th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((n) => (
            <tr key={n.id}>
              <td className="cms-tiny">{KIND[n.kind] || n.kind}</td>
              <td className="cms-tiny">{n.to}</td>
              <td>{n.subject}</td>
              <td>
                <span className={`cms-pill ${n.status === "SENT" ? "cms-pill-on" : ""}`}>
                  {STATUS[n.status] || n.status}
                </span>
              </td>
              <td className="cms-tiny">{new Date(n.createdAt).toISOString().slice(0, 16).replace("T", " ")}</td>
              <td className="cms-tiny">{n.sentAt ? new Date(n.sentAt).toISOString().slice(0, 16).replace("T", " ") : <span className="cms-muted">—</span>}</td>
              <td className="cms-tiny cms-muted" style={{ maxWidth: 200 }}>{n.error || ""}</td>
              <td>
                {(n.status === "FAILED" || n.status === "SKIPPED" || n.status === "QUEUED") && (
                  <form action={retryNotificationAction} style={{ display: "inline" }}>
                    <input type="hidden" name="id" value={n.id} />
                    <button type="submit" className="cms-btn">재시도</button>
                  </form>
                )}
              </td>
            </tr>
          ))}
          {items.length === 0 && <tr><td colSpan={8} className="cms-empty">아직 알림이 없습니다.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
