import { saveArticleAction } from "./actions";
import ImagePicker from "../../components/ImagePicker";

const CATEGORIES = [
  ["HISTORY", "미주 한인사회 사기사"],
  ["CASE_STUDY", "사기 사례"],
  ["PREVENTION", "사기 대처방법 (전후)"],
  ["SAFE_TX", "안전한 거래 방법"],
];

const COLORS = [
  ["cat-realestate", "부동산·임대"],
  ["cat-finance", "금융·동업"],
  ["cat-crime", "형사·사기"],
  ["cat-digital", "디지털·BEC"],
  ["cat-mail", "우편"],
  ["cat-community", "이민·커뮤니티"],
];

export default function ArticleForm({ article }) {
  const v = article || {};
  return (
    <form action={saveArticleAction} className="cms-form">
      {v.id && <input type="hidden" name="id" value={v.id} />}

      <ImagePicker
        name="coverImageId"
        defaultFileId={v.coverImageId || ""}
        label="표지 이미지 (선택)"
        maxHeight={240}
      />

      <div className="cms-grid-2">
        <label className="cms-label">카테고리
          <select name="category" defaultValue={v.category || "CASE_STUDY"} required className="cms-input">
            {CATEGORIES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </label>
        <label className="cms-label">표시 순서 (낮을수록 먼저)
          <input name="order" type="number" defaultValue={v.order ?? 0} className="cms-input" />
        </label>
      </div>

      <label className="cms-label">제목
        <input name="title" defaultValue={v.title || ""} required className="cms-input" />
      </label>
      <label className="cms-label">색 카테고리
        <select name="cat" defaultValue={v.cat || "cat-crime"} className="cms-input">
          {COLORS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
      </label>
      <label className="cms-label">발췌 (2-3문장)
        <textarea name="excerpt" defaultValue={v.excerpt || ""} rows={3} required className="cms-input" />
      </label>
      <label className="cms-label">본문 (Markdown)
        <textarea name="body" defaultValue={v.body || ""} rows={16} required className="cms-input cms-mono" />
      </label>
      <label className="cms-checkbox">
        <input type="checkbox" name="published" defaultChecked={v.published !== false} />
        <span>공개</span>
      </label>

      <div className="cms-actions">
        <button type="submit" className="cms-btn-primary">{v.id ? "저장" : "등록"}</button>
        <a href="/admin/articles" className="cms-btn">취소</a>
      </div>
    </form>
  );
}
