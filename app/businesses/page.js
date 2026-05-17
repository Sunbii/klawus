import Link from "next/link";
import { prisma } from "../../lib/db";

export const metadata = { title: "K-lawus · 정직한 업체" };
export const dynamic = "force-dynamic";

export default async function BusinessesPage() {
  const items = await prisma.honestBusiness.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { updatedAt: "desc" }],
  });

  return (
    <div className="container" style={{ maxWidth: 1100, padding: "32px 20px 60px" }}>
      <p><Link href="/" className="cms-muted" style={{ fontSize: 13 }}>← K·lawus</Link></p>
      <h1 className="cms-h1" style={{ marginTop: 12 }}>정직한 업체</h1>
      <p className="cms-muted">변호사·편집부가 직접 확인하거나 검증된 추천을 받은 한인 사회 업체.</p>

      <div className="row-4" style={{ marginTop: 18 }}>
        {items.map((b) => (
          <article key={b.id} className="article-card" style={{ border: "1px solid var(--line)", padding: 0 }}>
            {b.photoFileId ? (
              <img src={`/api/files/${b.photoFileId}`} alt={b.name} className="img-slot thumb" style={{ width: "100%", objectFit: "cover" }} />
            ) : (
              <span className="img-slot thumb" aria-hidden="true" />
            )}
            <div style={{ padding: "10px 12px 12px" }}>
              <span className="cat-line" style={{ marginBottom: 2 }}>{b.category}</span>
              <h3 style={{ margin: "0 0 4px", fontFamily: "var(--serif)", fontSize: 16, fontWeight: 800 }}>{b.name}</h3>
              <p className="cms-tiny cms-muted" style={{ margin: 0 }}>{b.location}</p>
              {b.phone && <p className="cms-tiny" style={{ margin: "4px 0 0" }}>{b.phone}</p>}
              {b.website && <p className="cms-tiny" style={{ margin: "2px 0 0" }}>
                <a href={b.website} className="cms-link" target="_blank" rel="noreferrer">웹사이트 →</a>
              </p>}
              {b.note && <p className="cms-tiny" style={{ margin: "6px 0 0", color: "var(--ink-2)" }}>{b.note}</p>}
              {b.endorsedBy && <p className="cms-tiny cms-muted" style={{ margin: "6px 0 0", fontStyle: "italic" }}>추천 — {b.endorsedBy}</p>}
            </div>
          </article>
        ))}
        {items.length === 0 && (
          <p className="cms-muted span-4" style={{ textAlign: "center", padding: 30 }}>등록된 업체가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
