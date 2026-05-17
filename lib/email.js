import { prisma } from "./db";

const MAIL_FROM = process.env.MAIL_FROM || "K-lawus <onboarding@resend.dev>";
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";

let _resend = null;
async function getResend() {
  if (!RESEND_API_KEY) return null;
  if (_resend) return _resend;
  const { Resend } = await import("resend");
  _resend = new Resend(RESEND_API_KEY);
  return _resend;
}

/**
 * Enqueue an email and try to flush immediately.
 * Returns the EmailNotification record.
 */
export async function queueEmail({ to, subject, body, kind, relatedId = null }) {
  if (!to || !subject || !body) {
    return null;
  }
  const record = await prisma.emailNotification.create({
    data: {
      to: String(to).trim().toLowerCase(),
      subject: String(subject).slice(0, 250),
      body: String(body),
      kind,
      relatedId,
      status: "QUEUED",
    },
  });

  // Try to send in the background; failures stay as FAILED records.
  flushOne(record.id).catch((e) => {
    console.error("email flush error:", e?.message);
  });

  return record;
}

export async function flushOne(id) {
  const rec = await prisma.emailNotification.findUnique({ where: { id } });
  if (!rec || rec.status !== "QUEUED") return rec;

  const resend = await getResend();
  if (!resend) {
    // No provider configured — mark as SKIPPED with a log so admin sees it.
    console.log(`[email:SKIPPED] to=${rec.to} kind=${rec.kind} subject=${rec.subject}`);
    return prisma.emailNotification.update({
      where: { id },
      data: { status: "SKIPPED", sentAt: new Date(), error: "RESEND_API_KEY 미설정" },
    });
  }

  try {
    const result = await resend.emails.send({
      from: MAIL_FROM,
      to: rec.to,
      subject: rec.subject,
      text: rec.body,
    });
    if (result.error) throw new Error(result.error.message || JSON.stringify(result.error));
    return prisma.emailNotification.update({
      where: { id },
      data: { status: "SENT", sentAt: new Date(), error: null },
    });
  } catch (err) {
    return prisma.emailNotification.update({
      where: { id },
      data: { status: "FAILED", error: String(err?.message || err).slice(0, 500) },
    });
  }
}

export async function retryFailed(id) {
  const rec = await prisma.emailNotification.findUnique({ where: { id } });
  if (!rec) return null;
  if (rec.status === "SENT") return rec;
  await prisma.emailNotification.update({
    where: { id },
    data: { status: "QUEUED", error: null },
  });
  return flushOne(id);
}

// ---------- Templates ----------

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
const SCM_STATUS = {
  PENDING: "확인 대기",
  SCREENED: "검토 완료",
  EVIDENCE: "증거 확보",
};

export function tplWelcomeMember(user) {
  return {
    kind: "welcome_member",
    to: user.email,
    subject: "K-lawus 가입을 환영합니다",
    body:
`${user.name}님,

K-lawus 회원 가입이 완료되었습니다.

회원으로 신청 가능한 서비스:
- 신용 조회
- 백그라운드 체크
- 채권 신용리포팅 (Experian/TransUnion/Equifax)

서비스 신청: https://klawus-production.up.railway.app/me/services/new
대시보드: https://klawus-production.up.railway.app/me

K-lawus 편집부`,
  };
}

export function tplWelcomeLawyer(user) {
  return {
    kind: "welcome_lawyer",
    to: user.email,
    subject: "K-lawus 변호사 계정이 활성화되었습니다",
    body:
`${user.name} 변호사님,

K-lawus 변호사 계정이 활성화되었습니다. 컬럼 작성과 서비스 요청이 모두 가능합니다.

컬럼 작성: https://klawus-production.up.railway.app/me/columns/new
대시보드: https://klawus-production.up.railway.app/me

게시된 컬럼은 편집부 검토 후 홈에 노출됩니다.

K-lawus 편집부`,
  };
}

export function tplServiceReceived(user, sr) {
  const label = SVC_LABEL[sr.type] || sr.type;
  return {
    kind: "service_received",
    to: user.email,
    relatedId: sr.id,
    subject: `[K-lawus] ${label} 신청이 접수되었습니다`,
    body:
`${user.name}님,

${label} 신청이 접수되었습니다.

대상: ${sr.subjectName}
금액: $${(sr.priceCents / 100).toFixed(2)}
상태: 접수 (검토 대기)

진행 상황은 다음 페이지에서 확인하실 수 있습니다.
https://klawus-production.up.railway.app/me/services

K-lawus 편집부`,
  };
}

export function tplServiceStatus(user, sr) {
  const label = SVC_LABEL[sr.type] || sr.type;
  const status = SVC_STATUS[sr.status] || sr.status;
  const lines = [
    `${user.name}님,`,
    "",
    `${label} 신청 상태가 "${status}"로 변경되었습니다.`,
    "",
    `대상: ${sr.subjectName}`,
  ];
  if (sr.adminNote) lines.push("", "처리 노트:", sr.adminNote);
  if (sr.resultUrl) lines.push("", `결과: ${sr.resultUrl}`);
  lines.push("", "내 페이지: https://klawus-production.up.railway.app/me/services", "", "K-lawus 편집부");
  return {
    kind: "service_status",
    to: user.email,
    relatedId: sr.id,
    subject: `[K-lawus] ${label} 상태 변경 → ${status}`,
    body: lines.join("\n"),
  };
}

export function tplColumnPublished(user, col) {
  return {
    kind: "column_published",
    to: user.email,
    relatedId: col.id,
    subject: `[K-lawus] 컬럼 "${col.title}"이(가) 공개되었습니다`,
    body:
`${user.name} 변호사님,

작성하신 컬럼이 K-lawus 홈에 공개되었습니다.

제목: ${col.title}
공개 페이지: https://klawus-production.up.railway.app/columns/${col.slug}

K-lawus 편집부`,
  };
}

export function tplReportReceived(toEmail, scammer) {
  return {
    kind: "report_received",
    to: toEmail,
    relatedId: scammer.id,
    subject: "[K-lawus] 제보가 접수되었습니다",
    body:
`보내주신 사기 사례 제보가 접수되었습니다.

대상: ${scammer.name}
유형: ${scammer.type}
상태: 확인 대기

편집부 검토 후 추가 확인이 필요한 경우 회신드립니다. 게시는 검증 절차를 거친 후에만 이루어집니다.

K-lawus 편집부`,
  };
}

export function tplScammerTransition(toEmail, scammer, note) {
  const status = SCM_STATUS[scammer.status] || scammer.status;
  const lines = [
    "보내주신 제보의 검토 상태가 변경되었습니다.",
    "",
    `대상: ${scammer.name}`,
    `현재 상태: ${status}`,
  ];
  if (note) lines.push("", "편집부 노트:", note);
  lines.push("", "K-lawus 편집부");
  return {
    kind: "scammer_transition",
    to: toEmail,
    relatedId: scammer.id,
    subject: `[K-lawus] 제보 상태 변경 → ${status}`,
    body: lines.join("\n"),
  };
}
