import { notFound } from "next/navigation";
import { prisma } from "../../../../../lib/db";
import { requireAdmin } from "../../../../../lib/auth";
import {
  saveServiceAdminAction,
  deleteServiceAction,
  generateDebtExportAction,
  setBureauStatusAction,
} from "../../../actions";

const TYPE = {
  CREDIT_CHECK: "신용 조회",
  BACKGROUND_CHECK: "백그라운드 체크",
  DEBT_CREDIT_REPORTING: "채권 신용리포팅",
};

const STATUSES = [
  ["PENDING", "접수"],
  ["IN_PROGRESS", "처리 중"],
  ["COMPLETED", "완료"],
  ["REJECTED", "반려"],
];
const PAYMENTS = [
  ["UNPAID", "미지급"],
  ["PAID", "지급 완료"],
  ["WAIVED", "면제"],
  ["REFUNDED", "환불"],
];
const BUREAU_STATUSES = [
  ["NONE", "해당 없음"],
  ["QUEUED", "보고 대기"],
  ["EXPORTED", "Metro 2 추출"],
  ["SUBMITTED", "신용정보사 제출"],
  ["ACKNOWLEDGED", "확인됨"],
];

export default async function AdminEditServicePage({ params }) {
  await requireAdmin();
  const { id } = await params;
  const s = await prisma.serviceRequest.findUnique({
    where: { id },
    include: { user: { select: { name: true, email: true, phone: true, state: true, role: true } } },
  });
  if (!s) notFound();

  const isDebtReporting = s.type === "DEBT_CREDIT_REPORTING";

  return (
    <div className="cms-wide" style={{ maxWidth: 860 }}>
      <h1 className="cms-h1">서비스 요청 처리</h1>
      <p className="cms-muted">
        {TYPE[s.type] || s.type} · 신청자 {s.user.name} ({s.user.email}{s.user.phone ? ` · ${s.user.phone}` : ""}{s.user.state ? ` · ${s.user.state}` : ""})
        · 접수 {new Date(s.requestedAt).toISOString().slice(0, 16).replace("T", " ")}
      </p>

      <fieldset className="cms-fieldset">
        <legend>대상자 정보 (신청 시점 입력)</legend>
        <p style={{ fontSize: 13, lineHeight: 1.6 }}>
          <strong>{s.subjectName}</strong>
          {s.subjectPhone && <> · {s.subjectPhone}</>}
          {s.subjectEmail && <> · {s.subjectEmail}</>}
        </p>
        {s.subjectAddress && <p className="cms-tiny cms-muted">{s.subjectAddress}</p>}
        <p className="cms-tiny cms-muted">
          {s.subjectDob && <>DOB {s.subjectDob}</>}
          {s.subjectSsn4 && <> · SSN ****-**-{s.subjectSsn4}</>}
        </p>
        {s.note && <p style={{ fontSize: 13, marginTop: 8 }}><strong>신청 메모:</strong> {s.note}</p>}
      </fieldset>

      <form action={saveServiceAdminAction} className="cms-form">
        <input type="hidden" name="id" value={s.id} />

        <div className="cms-grid-3">
          <label className="cms-label">상태
            <select name="status" defaultValue={s.status} className="cms-input">
              {STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
          <label className="cms-label">지불
            <select name="payment" defaultValue={s.payment} className="cms-input">
              {PAYMENTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
          <label className="cms-label">단가 (USD)
            <input type="number" name="price" step="0.01" min="0" defaultValue={(s.priceCents/100).toFixed(2)} className="cms-input" />
          </label>
        </div>

        <label className="cms-label">관리자 노트 (신청자에게도 노출됨)
          <textarea name="adminNote" defaultValue={s.adminNote || ""} rows={4} className="cms-input" />
        </label>
        <label className="cms-label">결과 파일/링크 URL
          <input name="resultUrl" defaultValue={s.resultUrl || ""} className="cms-input" placeholder="https://..." />
        </label>

        {isDebtReporting && (
          <fieldset className="cms-fieldset">
            <legend>채권 신용리포팅</legend>
            <p className="cms-tiny cms-muted">
              채권 금액 ${s.debtAmountCents ? (s.debtAmountCents/100).toFixed(2) : "—"}
              {s.debtSince && <> · 발생 {s.debtSince}</>}
              {s.creditorName && <> · 채권자 {s.creditorName}</>}
            </p>

            <label className="cms-label">신용정보사 보고 상태
              <select name="bureauStatus" defaultValue={s.bureauStatus || "NONE"} className="cms-input">
                {BUREAU_STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </label>

            <div className="cms-row" style={{ gap: 16, flexWrap: "wrap" }}>
              <label className="cms-checkbox">
                <input type="checkbox" name="reportExperian" defaultChecked={s.reportExperian} />
                <span>Experian</span>
              </label>
              <label className="cms-checkbox">
                <input type="checkbox" name="reportTransUnion" defaultChecked={s.reportTransUnion} />
                <span>TransUnion</span>
              </label>
              <label className="cms-checkbox">
                <input type="checkbox" name="reportEquifax" defaultChecked={s.reportEquifax} />
                <span>Equifax</span>
              </label>
            </div>

            <label className="cms-label">핸드오프 export 파일 URL
              <input name="metroExportUrl" defaultValue={s.metroExportUrl || ""} className="cms-input" placeholder="자동 생성 시 채워짐" />
            </label>
            <p className="cms-muted cms-tiny" style={{ margin: 0 }}>
              이 export는 사양 호환 Metro 2 파일이 아니며, 신용정보사 furnisher
              포털에 입력하거나 라이선스된 변환 대행사에 넘기는 구조화 텍스트입니다.
              Reporter 정보는 환경변수(<span className="cms-mono">REPORTER_NAME</span>,
              <span className="cms-mono"> SUBSCRIBER_CODE</span> 등)에서 읽습니다.
            </p>
          </fieldset>
        )}

        <div className="cms-actions">
          <button type="submit" className="cms-btn-primary">저장</button>
          <a href="/admin/services" className="cms-btn">취소</a>
        </div>
      </form>

      {s.type === "DEBT_CREDIT_REPORTING" && (
        <fieldset className="cms-fieldset" style={{ marginTop: 18 }}>
          <legend>신용정보사 보고 워크플로</legend>
          <p className="cms-tiny" style={{ marginTop: 0 }}>
            현재 상태: <strong>{s.bureauStatus || "NONE"}</strong>
            {s.metroExportUrl && (
              <> · <a className="cms-link" href={s.metroExportUrl} target="_blank" rel="noreferrer">현재 export 다운로드</a></>
            )}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 8 }}>
            <form action={generateDebtExportAction}>
              <input type="hidden" name="id" value={s.id} />
              <button type="submit" className="cms-btn-primary">
                {s.metroExportUrl ? "핸드오프 export 재생성" : "핸드오프 export 생성"}
              </button>
            </form>

            <form action={setBureauStatusAction}>
              <input type="hidden" name="id" value={s.id} />
              <input type="hidden" name="to" value="SUBMITTED" />
              <button type="submit" className="cms-btn" disabled={!s.metroExportUrl}>신용정보사 제출 완료로 표시</button>
            </form>

            <form action={setBureauStatusAction}>
              <input type="hidden" name="id" value={s.id} />
              <input type="hidden" name="to" value="ACKNOWLEDGED" />
              <button type="submit" className="cms-btn">신용정보사 확인됨으로 표시</button>
            </form>

            <form action={setBureauStatusAction}>
              <input type="hidden" name="id" value={s.id} />
              <input type="hidden" name="to" value="NONE" />
              <button type="submit" className="cms-btn">상태 초기화</button>
            </form>
          </div>

          <p className="cms-muted cms-tiny" style={{ marginTop: 10 }}>
            워크플로: <strong>EXPORT 생성</strong> → 외부 변환·수동 입력으로 신용정보사 furnisher 포털 제출 → <strong>제출 완료</strong> 표시 → 신용정보사 응답 확인 후 <strong>확인됨</strong>.
          </p>
        </fieldset>
      )}

      <form action={deleteServiceAction} style={{ marginTop: 18, borderTop: "1px solid var(--line)", paddingTop: 12 }}>
        <input type="hidden" name="id" value={s.id} />
        <button type="submit" className="cms-btn-danger">이 요청 영구 삭제</button>
      </form>
    </div>
  );
}
