"use client";

import { useRef, useState } from "react";
import { marked } from "marked";

const CATS = [
  ["cat-realestate", "부동산·임대"],
  ["cat-finance", "금융·동업"],
  ["cat-crime", "형사·사기"],
  ["cat-digital", "디지털·BEC"],
  ["cat-mail", "우편"],
  ["cat-community", "이민·커뮤니티"],
];

export default function ColumnEditor({ column, action, cancelHref = "/me", showPublish = true }) {
  const v = column || {};
  const [body, setBody] = useState(v.body || "");
  const [coverId, setCoverId] = useState(v.coverImageId || "");
  const [coverPreview, setCoverPreview] = useState(v.coverImageId ? `/api/files/${v.coverImageId}` : "");
  const [preview, setPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const bodyRef = useRef(null);

  async function uploadFile(file) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch("/api/upload", { method: "POST", body: fd });
      if (!r.ok) {
        const e = await r.json().catch(() => ({}));
        alert(`업로드 실패: ${e.error || r.status}`);
        return null;
      }
      return r.json();
    } finally {
      setUploading(false);
    }
  }

  async function onPickCover(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const res = await uploadFile(f);
    if (res) {
      setCoverId(res.id);
      setCoverPreview(res.url);
    }
    e.target.value = "";
  }

  async function insertImage() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (ev) => {
      const f = ev.target.files?.[0];
      if (!f) return;
      const res = await uploadFile(f);
      if (!res) return;
      const ta = bodyRef.current;
      if (!ta) return;
      const alt = f.name.replace(/[\[\]]/g, "");
      insertAtCursor(ta, `![${alt}](${res.url})`);
    };
    input.click();
  }

  function insertAtCursor(ta, text) {
    const start = ta.selectionStart || 0;
    const end = ta.selectionEnd || 0;
    const next = ta.value.slice(0, start) + text + ta.value.slice(end);
    setBody(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.selectionStart = ta.selectionEnd = start + text.length;
    });
  }

  function wrapSel(prefix, suffix = prefix) {
    const ta = bodyRef.current;
    if (!ta) return;
    const start = ta.selectionStart || 0;
    const end = ta.selectionEnd || 0;
    const sel = ta.value.slice(start, end);
    const next = ta.value.slice(0, start) + prefix + sel + suffix + ta.value.slice(end);
    setBody(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.selectionStart = start + prefix.length;
      ta.selectionEnd = end + prefix.length;
    });
  }

  function insertLink() {
    const url = window.prompt("링크 URL?");
    if (!url) return;
    const ta = bodyRef.current;
    if (!ta) return;
    const start = ta.selectionStart || 0;
    const end = ta.selectionEnd || 0;
    const sel = ta.value.slice(start, end) || "링크 텍스트";
    const md = `[${sel}](${url})`;
    insertAtCursor(ta, md);
  }

  return (
    <form action={action} className="cms-form">
      {v.id && <input type="hidden" name="id" value={v.id} />}
      <input type="hidden" name="coverImageId" value={coverId} />
      <input type="hidden" name="body" value={body} />

      <fieldset className="cms-fieldset">
        <legend>표지 이미지</legend>
        {coverPreview && (
          <div style={{ marginBottom: 10 }}>
            <img src={coverPreview} alt="표지" style={{ maxWidth: "100%", maxHeight: 240, display: "block", border: "1px solid var(--line)" }} />
            <button
              type="button"
              className="cms-btn-danger"
              style={{ marginTop: 6 }}
              onClick={() => { setCoverId(""); setCoverPreview(""); }}
            >
              표지 제거
            </button>
          </div>
        )}
        <input type="file" accept="image/*" onChange={onPickCover} disabled={uploading} />
        {uploading && <p className="cms-muted cms-tiny">업로드 중...</p>}
      </fieldset>

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

      <div className="cms-label">
        <span>본문 (Markdown)</span>
        <div className="cms-editor-toolbar">
          <button type="button" className="cms-btn" onClick={() => wrapSel("**")}>굵게</button>
          <button type="button" className="cms-btn" onClick={() => wrapSel("*")}>기울임</button>
          <button type="button" className="cms-btn" onClick={() => insertAtCursor(bodyRef.current, "\n\n## ")}>제목</button>
          <button type="button" className="cms-btn" onClick={() => insertAtCursor(bodyRef.current, "\n\n- ")}>목록</button>
          <button type="button" className="cms-btn" onClick={insertLink}>링크</button>
          <button type="button" className="cms-btn" onClick={insertImage} disabled={uploading}>
            {uploading ? "업로드..." : "이미지"}
          </button>
          <span style={{ flex: 1 }} />
          <button type="button" className="cms-btn" onClick={() => setPreview(!preview)}>
            {preview ? "에디터로" : "프리뷰"}
          </button>
        </div>
        {preview ? (
          <div
            className="cms-md-preview"
            dangerouslySetInnerHTML={{ __html: marked.parse(body || "_(본문이 비어 있습니다)_") }}
          />
        ) : (
          <textarea
            ref={bodyRef}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={18}
            required
            className="cms-input cms-mono"
          />
        )}
      </div>

      <fieldset className="cms-fieldset">
        <legend>후원 (선택)</legend>
        <input name="sponsorLabel" defaultValue={v.sponsorLabel || ""} placeholder="분야 라벨 (예: 임대 분쟁·보증금 회수)" className="cms-input" />
        <input name="sponsorWho" defaultValue={v.sponsorWho || ""} placeholder="후원자 (예: 이수정 변호사 (Lee Law))" className="cms-input" />
        <input name="sponsorContact" defaultValue={v.sponsorContact || ""} placeholder="연락처 (예: (201) 555-0117 · lee-law.com)" className="cms-input" />
      </fieldset>

      {showPublish && (
        <label className="cms-checkbox">
          <input type="checkbox" name="publish" defaultChecked={!!v.published} />
          <span>공개 (체크 해제 시 비공개 저장)</span>
        </label>
      )}

      <div className="cms-actions">
        <button type="submit" className="cms-btn-primary">{v.id ? "저장" : "작성"}</button>
        <a href={cancelHref} className="cms-btn">취소</a>
      </div>
    </form>
  );
}
