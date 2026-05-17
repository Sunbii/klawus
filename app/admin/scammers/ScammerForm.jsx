import { saveScammerAction } from "../actions";

const CATS = [
  ["cat-realestate", "부동산·임대"],
  ["cat-finance", "금융·동업"],
  ["cat-crime", "형사·사기"],
  ["cat-digital", "디지털·BEC"],
  ["cat-mail", "우편"],
  ["cat-community", "이민·커뮤니티"],
];

const STATUSES = [
  ["PENDING", "확인 대기"],
  ["SCREENED", "검토 완료"],
  ["EVIDENCE", "증거 확보"],
];

export default function ScammerForm({ scammer }) {
  const v = scammer || {};
  return (
    <form action={saveScammerAction} className="cms-form">
      {v.id && <input type="hidden" name="id" value={v.id} />}

      <label className="cms-label">이름 / 사업체
        <input name="name" defaultValue={v.name || ""} required className="cms-input" />
      </label>

      <div className="cms-grid-2">
        <label className="cms-label">유형
          <input name="type" defaultValue={v.type || ""} required className="cms-input" placeholder="예: 이중 임대" />
        </label>
        <label className="cms-label">지역
          <input name="location" defaultValue={v.location || ""} required className="cms-input" placeholder="예: Flushing, Queens, NY" />
        </label>
      </div>

      <label className="cms-label">이명 / 관련 명의
        <input name="aliases" defaultValue={v.aliases || ""} className="cms-input" placeholder="예: Lee Realty Inc, OO Properties LLC" />
      </label>

      <div className="cms-grid-3">
        <label className="cms-label">접수 건수
          <input name="cases" type="number" min="1" defaultValue={v.cases || 1} className="cms-input" />
        </label>
        <label className="cms-label">상태
          <select name="status" defaultValue={v.status || "PENDING"} className="cms-input">
            {STATUSES.map(([val, l]) => <option key={val} value={val}>{l}</option>)}
          </select>
        </label>
        <label className="cms-label">카테고리 색
          <select name="cat" defaultValue={v.cat || "cat-crime"} className="cms-input">
            {CATS.map(([val, l]) => <option key={val} value={val}>{l}</option>)}
          </select>
        </label>
      </div>

      <label className="cms-label">한 줄 요약 (brief)
        <input name="brief" defaultValue={v.brief || ""} required className="cms-input" placeholder="목록 카드에 노출되는 한 줄" />
      </label>

      <label className="cms-label">사건 개요 (overview)
        <textarea name="overview" defaultValue={v.overview || ""} rows={5} required className="cms-input" />
      </label>

      <label className="cms-label">주요 패턴 (한 줄에 하나씩)
        <textarea name="patterns" defaultValue={(v.patterns || []).join("\n")} rows={5} className="cms-input" placeholder={"Zelle·현금만 요구\n공동 명의 LLC 분기마다 변경\n한인 카페 동시 광고"} />
      </label>

      <label className="cms-label">진행 상황
        <textarea name="progress" defaultValue={v.progress || ""} rows={3} required className="cms-input" />
      </label>

      <div className="cms-grid-3">
        <label className="cms-label">피해 추정
          <input name="damage" defaultValue={v.damage || ""} className="cms-input" placeholder="예: $58,000+" />
        </label>
        <label className="cms-label">최초 접수
          <input name="firstReport" defaultValue={v.firstReport || ""} className="cms-input" placeholder="예: 2025.11" />
        </label>
        <label className="cms-label">최근 갱신
          <input name="lastUpdate" defaultValue={v.lastUpdate || ""} className="cms-input" placeholder="예: 2026.05.14" />
        </label>
      </div>

      <label className="cms-checkbox">
        <input type="checkbox" name="published" defaultChecked={v.published !== false} />
        <span>공개</span>
      </label>

      <div className="cms-actions">
        <button type="submit" className="cms-btn-primary">{v.id ? "저장" : "등록"}</button>
        <a href="/admin/scammers" className="cms-btn">취소</a>
      </div>
    </form>
  );
}
