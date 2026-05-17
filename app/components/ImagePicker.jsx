"use client";

import { useState } from "react";

export default function ImagePicker({
  name,
  defaultFileId = "",
  label = "이미지",
  maxHeight = 240,
  hint = null,
}) {
  const [fileId, setFileId] = useState(defaultFileId || "");
  const [preview, setPreview] = useState(defaultFileId ? `/api/files/${defaultFileId}` : "");
  const [uploading, setUploading] = useState(false);

  async function onPick(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", f);
      const r = await fetch("/api/upload", { method: "POST", body: fd });
      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        alert(`업로드 실패: ${err.error || r.status}`);
        return;
      }
      const data = await r.json();
      setFileId(data.id);
      setPreview(data.url);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <fieldset className="cms-fieldset">
      <legend>{label}</legend>
      <input type="hidden" name={name} value={fileId} />
      {preview && (
        <div style={{ marginBottom: 10 }}>
          <img
            src={preview}
            alt={label}
            style={{
              maxWidth: "100%",
              maxHeight,
              display: "block",
              border: "1px solid var(--line)",
            }}
          />
          <button
            type="button"
            className="cms-btn-danger"
            style={{ marginTop: 6 }}
            onClick={() => { setFileId(""); setPreview(""); }}
          >
            제거
          </button>
        </div>
      )}
      <input type="file" accept="image/*" onChange={onPick} disabled={uploading} />
      {hint && <p className="cms-muted cms-tiny" style={{ marginTop: 4 }}>{hint}</p>}
      {uploading && <p className="cms-muted cms-tiny">업로드 중...</p>}
    </fieldset>
  );
}
