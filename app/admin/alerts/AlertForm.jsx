import { saveAlertAction } from "./actions";

const SEVERITY = [
  ["HIGH", "긴급 (HIGH)"],
  ["MEDIUM", "보통 (MEDIUM)"],
  ["LOW", "낮음 (LOW)"],
];

function toLocal(dt) {
  if (!dt) return "";
  const d = new Date(dt);
  const tz = d.getTimezoneOffset();
  return new Date(d.getTime() - tz * 60000).toISOString().slice(0, 16);
}

export default function AlertForm({ alert }) {
  const v = alert || {};
  return (
    <form action={saveAlertAction} className="cms-form">
      {v.id && <input type="hidden" name="id" value={v.id} />}

      <label className="cms-label">제목 (홈 배너·팝업에 노출)
        <input name="title" defaultValue={v.title || ""} required className="cms-input" />
      </label>

      <label className="cms-label">본문 (1-2문장)
        <textarea name="body" defaultValue={v.body || ""} rows={4} required className="cms-input" />
      </label>

      <div className="cms-grid-2">
        <label className="cms-label">관련 링크 (선택)
          <input name="link" defaultValue={v.link || ""} className="cms-input" placeholder="/scammers/public-notice 또는 외부 URL" />
        </label>
        <label className="cms-label">중요도
          <select name="severity" defaultValue={v.severity || "HIGH"} className="cms-input">
            {SEVERITY.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </label>
      </div>

      <label className="cms-label">만료 일시 (선택, 비우면 무제한)
        <input name="expiresAt" type="datetime-local" defaultValue={toLocal(v.expiresAt)} className="cms-input" />
      </label>

      <div className="cms-row" style={{ gap: 20 }}>
        <label className="cms-checkbox">
          <input type="checkbox" name="active" defaultChecked={v.active !== false} />
          <span>활성 (홈 배너 노출)</span>
        </label>
        <label className="cms-checkbox">
          <input type="checkbox" name="popup" defaultChecked={!!v.popup} />
          <span>팝업으로도 표시</span>
        </label>
      </div>

      <div className="cms-actions">
        <button type="submit" className="cms-btn-primary">{v.id ? "저장" : "등록"}</button>
        <a href="/admin/alerts" className="cms-btn">취소</a>
      </div>
    </form>
  );
}
