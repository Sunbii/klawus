import { getSession } from "../../lib/session";
import ImagePicker from "../components/ImagePicker";
import { submitReportAction } from "./actions";

export const metadata = {
  title: "K-lawus · 사기 사례 제보",
  description: "겪었거나 알게 된 사기 사례를 K-lawus 편집부로 보낼 수 있습니다.",
};

const ERR = {
  fields: "이름·유형·요약·상세는 필수입니다.",
  email: "연락받을 이메일을 입력하세요 (로그인 시 자동 첨부).",
};

export default async function ReportPage({ searchParams }) {
  const session = await getSession();
  const sp = await searchParams;
  const err = sp?.e;
  const userMode = session.kind === "user";

  return (
    <div className="container" style={{ maxWidth: 720, padding: "32px 20px 60px" }}>
      <p><a href="/" className="cms-muted" style={{ fontSize: 13 }}>← K·lawus</a></p>
      <h1 className="cms-h1" style={{ marginTop: 12 }}>사기 사례 제보</h1>
      <p className="cms-muted">
        편집부가 검토 후 검증 라벨과 함께 경고 명단에 게재합니다.
        당사자 통지·반론 절차를 거치며, 사진은 동의·검증 후 공개됩니다.
        익명 제보 가능하나 확인을 위해 이메일은 필요합니다.
      </p>

      <form action={submitReportAction} className="cms-form">
        <ImagePicker
          name="photoFileId"
          label="사진 (선택)"
          hint="피의자 사진은 검증 전까지 비공개. 증거 문서/스크린샷도 가능."
          maxHeight={200}
        />

        <label className="cms-label">이름 / 사업체
          <input name="name" required className="cms-input" placeholder="예: 강남부동산 O씨 / OO 식자재 유통" />
        </label>
        <div className="cms-grid-2">
          <label className="cms-label">유형
            <input name="type" required className="cms-input" placeholder="예: 이중 임대 / 동업 투자금 편취 / 우편 사기" />
          </label>
          <label className="cms-label">지역
            <input name="location" className="cms-input" placeholder="예: Fort Lee, NJ" />
          </label>
        </div>

        <label className="cms-label">한 줄 요약
          <input name="brief" required className="cms-input" placeholder="목록 카드에 보일 한 줄" />
        </label>

        <label className="cms-label">상세 내용 (시간 순서·금액·증거 가능한 만큼)
          <textarea name="overview" required rows={6} className="cms-input" />
        </label>

        <label className="cms-label">반복되는 수법 (한 줄에 하나)
          <textarea name="patterns" rows={4} className="cms-input" placeholder={"Zelle·현금만 요구\nLLC 명의 분기마다 변경"} />
        </label>

        {!userMode && (
          <label className="cms-label">연락받을 이메일 (필수)
            <input name="submitterEmail" type="email" required className="cms-input" placeholder="추가 확인 시 회신용. 공개되지 않음" />
          </label>
        )}
        {userMode && (
          <p className="cms-muted cms-tiny">
            로그인된 계정({session.kind === "user" ? "회원" : ""})으로 제보됩니다.
          </p>
        )}

        {err && <p className="cms-error">{ERR[err] || "입력값을 확인해주세요."}</p>}

        <div className="cms-actions">
          <button type="submit" className="cms-btn-primary">제보 보내기</button>
          <a href="/" className="cms-btn">취소</a>
        </div>
        <p className="cms-muted cms-tiny">
          제출된 제보는 PENDING 상태로 저장되며, 공개 전 편집부 검토를 거칩니다.
        </p>
      </form>
    </div>
  );
}
