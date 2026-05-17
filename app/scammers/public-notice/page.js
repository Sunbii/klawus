import Link from "next/link";
import { prisma } from "../../../lib/db";

export const metadata = { title: "K-lawus · 사기꾼 공시" };
export const dynamic = "force-dynamic";

export default async function PublicNoticePage() {
  const items = await prisma.scammer.findMany({
    where: { published: true, status: "EVIDENCE" },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="container" style={{ maxWidth: 1100, padding: "32px 20px 60px" }}>
      <p><Link href="/" className="cms-muted" style={{ fontSize: 13 }}>← K·lawus</Link></p>
      <h1 className="cms-h1" style={{ marginTop: 12 }}>사기꾼 공시</h1>
      <p className="cms-muted">
        편집부 검증을 통과해 <strong>증거 확보</strong> 단계에 들어간 사례만 공시합니다.
        당사자 통지·반론 절차를 거쳤습니다.
      </p>

      <ul style={{ listStyle: "none", padding: 0, margin: "20px 0 0" }}>
        {items.map((s) => (
          <li key={s.id} style={{
            display: "grid",
            gridTemplateColumns: "120px 1fr auto",
            gap: 16,
            padding: "16px 0",
            borderBottom: "1px solid var(--line)",
            alignItems: "start",
          }}>
            {s.photoFileId ? (
              <img src={`/api/files/${s.photoFileId}`} alt={s.name} style={{ width: 120, height: 120, objectFit: "cover", border: "1px solid var(--line)" }} />
            ) : (
              <div style={{ width: 120, height: 120, background: "var(--paper-dim)", border: "1px solid var(--line)" }} />
            )}
            <div>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: 19, fontWeight: 800, margin: 0 }}>{s.name}</h2>
              <p style={{ margin: "4px 0", color: "var(--red)", fontWeight: 700, fontSize: 13 }}>{s.type}</p>
              <p className="cms-tiny cms-muted" style={{ margin: 0 }}>{s.location}{s.aliases ? ` · 이명 ${s.aliases}` : ""}</p>
              <p style={{ margin: "8px 0", fontSize: 14, color: "var(--ink-2)" }}>{s.brief}</p>
              <p className="cms-tiny cms-muted" style={{ margin: 0 }}>
                접수 {s.cases}건
                {s.damage && <> · 피해 추정 {s.damage}</>}
                {s.lastUpdate && <> · 최근 {s.lastUpdate}</>}
              </p>
            </div>
            <span className="tag tag-evidence">증거 확보</span>
          </li>
        ))}
        {items.length === 0 && (
          <li style={{ padding: 30, textAlign: "center" }} className="cms-muted">
            현재 공시된 사례가 없습니다.
          </li>
        )}
      </ul>
    </div>
  );
}
