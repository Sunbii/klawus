import { requireUser } from "../../../../lib/auth";
import { submitServiceRequestAction } from "../../actions";

export const metadata = { title: "K-lawus · 서비스 신청", robots: { index: false } };

const ERR = {
  type: "서비스 유형을 선택하세요.",
  subject: "대상자 이름을 입력하세요.",
};

const PRICES = {
  CREDIT_CHECK: 49,
  BACKGROUND_CHECK: 99,
  DEBT_CREDIT_REPORTING: 149,
};

export default async function NewServicePage({ searchParams }) {
  await requireUser();
  const sp = await searchParams;
  const err = sp?.e;
  const presetType = ["CREDIT_CHECK", "BACKGROUND_CHECK", "DEBT_CREDIT_REPORTING"].includes(sp?.type) ? sp.type : "CREDIT_CHECK";

  return (
    <div className="cms-wide" style={{ maxWidth: 720 }}>
      <h1 className="cms-h1">서비스 신청</h1>
      <p className="cms-muted">
        신청 후 관리자가 신원·증빙 확인 → 처리 → 결과 회신 순으로 진행합니다.
        채권 신용리포팅의 경우 Experian/TransUnion/Equifax 중 선택한 신용정보 회사로 보고됩니다.
      </p>

      <form action={submitServiceRequestAction} className="cms-form">
        <label className="cms-label">서비스 유형
          <select name="type" defaultValue={presetType} required className="cms-input">
            <option value="CREDIT_CHECK">신용 조회 (${PRICES.CREDIT_CHECK})</option>
            <option value="BACKGROUND_CHECK">백그라운드 체크 (${PRICES.BACKGROUND_CHECK})</option>
            <option value="DEBT_CREDIT_REPORTING">채권 신용리포팅 (${PRICES.DEBT_CREDIT_REPORTING})</option>
          </select>
        </label>

        <fieldset className="cms-fieldset">
          <legend>대상자 정보</legend>
          <input name="subjectName" placeholder="이름 (필수)" required className="cms-input" />
          <div className="cms-grid-2">
            <input name="subjectPhone" placeholder="전화" className="cms-input" />
            <input name="subjectEmail" type="email" placeholder="이메일" className="cms-input" />
          </div>
          <input name="subjectAddress" placeholder="주소" className="cms-input" />
          <div className="cms-grid-2">
            <input name="subjectDob" placeholder="생년월일 (YYYY-MM-DD)" className="cms-input" />
            <input name="subjectSsn4" placeholder="SSN 끝 4자리만" maxLength={4} className="cms-input" />
          </div>
        </fieldset>

        <fieldset className="cms-fieldset">
          <legend>채권 신용리포팅 시에만 작성</legend>
          <div className="cms-grid-2">
            <input name="debtAmount" type="number" min="0" step="0.01" placeholder="채권 금액 (USD)" className="cms-input" />
            <input name="debtSince" placeholder="채권 발생일 (YYYY-MM-DD)" className="cms-input" />
          </div>
          <input name="creditorName" placeholder="채권자 이름/업체" className="cms-input" />
        </fieldset>

        <label className="cms-label">메모 (배경·필요 사유 등)
          <textarea name="note" rows={4} className="cms-input" />
        </label>

        {err && <p className="cms-error">{ERR[err] || "입력값을 확인해주세요."}</p>}

        <div className="cms-actions">
          <button type="submit" className="cms-btn-primary">신청 제출</button>
          <a href="/me/services" className="cms-btn">취소</a>
        </div>
        <p className="cms-muted cms-tiny">
          제출 후 결제(현재는 stub)는 관리자가 단가 확인 → 결제 안내 발송 → 지급 확인 순으로 처리합니다.
        </p>
      </form>
    </div>
  );
}
