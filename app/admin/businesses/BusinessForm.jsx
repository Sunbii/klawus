import { saveBusinessAction } from "./actions";
import ImagePicker from "../../components/ImagePicker";

export default function BusinessForm({ business }) {
  const v = business || {};
  return (
    <form action={saveBusinessAction} className="cms-form">
      {v.id && <input type="hidden" name="id" value={v.id} />}

      <ImagePicker
        name="photoFileId"
        defaultFileId={v.photoFileId || ""}
        label="사진 (선택)"
        maxHeight={200}
      />

      <div className="cms-grid-2">
        <label className="cms-label">업체명
          <input name="name" defaultValue={v.name || ""} required className="cms-input" />
        </label>
        <label className="cms-label">분야
          <input name="category" defaultValue={v.category || ""} className="cms-input" placeholder="예: 식당, 마트, 세탁, 병원, 자동차 정비" />
        </label>
      </div>
      <div className="cms-grid-2">
        <label className="cms-label">지역
          <input name="location" defaultValue={v.location || ""} className="cms-input" placeholder="예: Fort Lee, NJ" />
        </label>
        <label className="cms-label">전화
          <input name="phone" defaultValue={v.phone || ""} className="cms-input" />
        </label>
      </div>
      <label className="cms-label">웹사이트 (선택)
        <input name="website" defaultValue={v.website || ""} className="cms-input" placeholder="https://..." />
      </label>
      <label className="cms-label">추천한 사람·매체 (예: 김민수 변호사 / K-lawus 편집부)
        <input name="endorsedBy" defaultValue={v.endorsedBy || ""} className="cms-input" />
      </label>
      <label className="cms-label">추천 이유·노트
        <textarea name="note" defaultValue={v.note || ""} rows={4} className="cms-input" />
      </label>
      <div className="cms-grid-2">
        <label className="cms-label">표시 순서
          <input name="order" type="number" defaultValue={v.order ?? 0} className="cms-input" />
        </label>
        <label className="cms-checkbox" style={{ alignSelf: "end", paddingBottom: 8 }}>
          <input type="checkbox" name="published" defaultChecked={v.published !== false} />
          <span>공개</span>
        </label>
      </div>

      <div className="cms-actions">
        <button type="submit" className="cms-btn-primary">{v.id ? "저장" : "등록"}</button>
        <a href="/admin/businesses" className="cms-btn">취소</a>
      </div>
    </form>
  );
}
