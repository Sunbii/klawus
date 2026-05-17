import Link from "next/link";
import { prisma } from "../../lib/db";

export const metadata = { title: "K-lawus · 사기사·사례·가이드" };
export const dynamic = "force-dynamic";

const CAT_LABEL = {
  HISTORY: "미주 한인사회 사기사",
  CASE_STUDY: "사기 사례",
  PREVENTION: "사기 대처방법 (전후)",
  SAFE_TX: "안전한 거래 방법",
};

export default async function ArticlesPage({ searchParams }) {
  const sp = await searchParams;
  const cat = ["HISTORY", "CASE_STUDY", "PREVENTION", "SAFE_TX"].includes(sp?.cat) ? sp.cat : null;
  const items = await prisma.article.findMany({
    where: { published: true, ...(cat ? { category: cat } : {}) },
    orderBy: [{ order: "asc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
    take: 60,
  });

  return (
    <div className="container" style={{ maxWidth: 1100, padding: "32px 20px 60px" }}>
      <p><Link href="/" className="cms-muted" style={{ fontSize: 13 }}>← K·lawus</Link></p>
      <h1 className="cms-h1" style={{ marginTop: 12 }}>
        {cat ? CAT_LABEL[cat] : "사기사 · 사례 · 가이드"}
      </h1>
      <div className="reg-hints" style={{ margin: "8px 0 18px" }}>
        <Link href="/articles" className={`cms-btn ${!cat ? "cms-btn-primary" : ""}`}>전체</Link>
        {Object.entries(CAT_LABEL).map(([k, l]) => (
          <Link key={k} href={`/articles?cat=${k}`} className={`cms-btn ${cat === k ? "cms-btn-primary" : ""}`}>{l}</Link>
        ))}
      </div>

      <div className="row-4">
        {items.map((a) => (
          <article key={a.id} className="article-card">
            {a.coverImageId ? (
              <Link href={`/articles/${a.slug}`}>
                <img src={`/api/files/${a.coverImageId}`} alt="" className="img-slot wide" style={{ width: "100%", objectFit: "cover" }} />
              </Link>
            ) : (
              <span className={`img-slot wide ${a.cat}`} aria-hidden="true" />
            )}
            <span className="cat-line">{CAT_LABEL[a.category] || a.category}</span>
            <h3 className="serif"><Link href={`/articles/${a.slug}`} style={{ color: "inherit" }}>{a.title}</Link></h3>
            <p>{a.excerpt}</p>
          </article>
        ))}
        {items.length === 0 && (
          <p className="cms-muted span-4" style={{ textAlign: "center", padding: 30 }}>아직 등록된 글이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
