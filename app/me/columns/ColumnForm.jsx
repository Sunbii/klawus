import { saveOwnColumnAction } from "../actions";

const CATS = [
  ["cat-realestate", "부동산·임대"],
  ["cat-finance", "금융·동업"],
  ["cat-crime", "형사·사기"],
  ["cat-digital", "디지털·BEC"],
  ["cat-mail", "우편"],
  ["cat-community", "이민·커뮤니티"],
];

export default function ColumnForm({ column }) {
  const v = column || {};
  return (
    <form action={saveOwnColumnAction} className="cms-form">
      {v.id && <input type="hidden" name="id" value={v.id} />}

      <label className="cms-label">제목
        <input name="title" defaultValue={v.title || ""} required className="cms-input" />
      </label>

      <div className="cms-grid-2">
        <label className="cms-label">분야 (예: 부동산·임대차 피해)
          <input name="field" defaultValue={v.field || ""} required className="cms-input" />
        </label>
        <label className="cms-label">카테고리 색
          <select name="cat" defaultValue={v.cat || "cat-realestate"} className="cms-input">
            {CATS.map(([val, l]) => <option key={val} value={val}>{l}</option>)}
          </select>
        </label>
      </div>

      <label className="cms-label">발췌 (요약 2-3문장)
        <textarea name="excerpt" defaultValue={v.excerpt || ""} rows={3} required className="cms-input" />
      </label>

      <label className="cms-label">본문 (Markdown 가능)
        <textarea name="body" defaultValue={v.body || ""} rows={16} required className="cms-input cms-mono" />
      </label>

      <fieldset className="cms-fieldset">
        <legend>후원 (선택)</legend>
        <input name="sponsorLabel" defaultValue={v.sponsorLabel || ""} placeholder="분야 라벨 (예: 임대 분쟁·보증금 회수)" className="cms-input" />
        <input name="sponsorWho" defaultValue={v.sponsorWho || ""} placeholder="후원자 (예: 이수정 변호사 (Lee Law))" className="cms-input" />
        <input name="sponsorContact" defaultValue={v.sponsorContact || ""} placeholder="연락처 (예: (201) 555-0117 · lee-law.com)" className="cms-input" />
      </fieldset>

      <label className="cms-checkbox">
        <input type="checkbox" name="publish" defaultChecked={!!v.published} />
        <span>공개 (체크 해제 시 비공개 저장)</span>
      </label>

      <div className="cms-actions">
        <button type="submit" className="cms-btn-primary">{v.id ? "저장" : "작성"}</button>
        <a href="/me" className="cms-btn">취소</a>
      </div>
    </form>
  );
}
