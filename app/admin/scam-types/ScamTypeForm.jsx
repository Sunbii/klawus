import { saveScamTypeAction } from "./actions";
import ImagePicker from "../../components/ImagePicker";

export default function ScamTypeForm({ scamType }) {
  const v = scamType || {};
  return (
    <form action={saveScamTypeAction} className="cms-form">
      {v.id && <input type="hidden" name="id" value={v.id} />}

      <ImagePicker
        name="iconFileId"
        defaultFileId={v.iconFileId || ""}
        label="아이콘 / 사진 (선택)"
        hint="홈 도감 카드에 표시. 작은 정사각형 또는 일러스트 권장"
        maxHeight={160}
      />

      <div className="cms-grid-2">
        <label className="cms-label">표시 순서 (낮을수록 먼저)
          <input name="order" type="number" defaultValue={v.order ?? 0} className="cms-input" />
        </label>
        <label className="cms-checkbox" style={{ alignSelf: "end", paddingBottom: 8 }}>
          <input type="checkbox" name="published" defaultChecked={v.published !== false} />
          <span>공개</span>
        </label>
      </div>

      <label className="cms-label">제목 (예: 이중 임대 (Double Lease))
        <input name="title" defaultValue={v.title || ""} required className="cms-input" />
      </label>

      <label className="cms-label">수법 (sign)
        <textarea name="sign" defaultValue={v.sign || ""} rows={2} required className="cms-input" />
      </label>
      <label className="cms-label">적신호 (flag)
        <textarea name="flag" defaultValue={v.flag || ""} rows={2} required className="cms-input" />
      </label>
      <label className="cms-label">대응 (act)
        <textarea name="act" defaultValue={v.act || ""} rows={2} required className="cms-input" />
      </label>

      <div className="cms-actions">
        <button type="submit" className="cms-btn-primary">{v.id ? "저장" : "등록"}</button>
        <a href="/admin/scam-types" className="cms-btn">취소</a>
      </div>
    </form>
  );
}
