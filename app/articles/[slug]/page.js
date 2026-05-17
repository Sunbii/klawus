import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { prisma } from "../../../lib/db";

export const dynamic = "force-dynamic";

const CAT_LABEL = {
  HISTORY: "미주 한인사회 사기사",
  CASE_STUDY: "사기 사례",
  PREVENTION: "사기 대처방법 (전후)",
  SAFE_TX: "안전한 거래 방법",
};

function renderMarkdown(md) {
  const raw = marked.parse(md || "", { gfm: true, breaks: true });
  return sanitizeHtml(String(raw), {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "h3", "h4", "figure", "figcaption"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "title"],
      a: ["href", "name", "target", "rel", "title"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
  });
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const a = await prisma.article.findUnique({ where: { slug }, select: { title: true, excerpt: true, published: true } });
  if (!a) return { title: "K-lawus" };
  return {
    title: `${a.title} · K-lawus`,
    description: a.excerpt,
    robots: a.published ? undefined : { index: false, follow: false },
  };
}

export default async function ArticleDetailPage({ params }) {
  const { slug } = await params;
  const a = await prisma.article.findUnique({ where: { slug } });
  if (!a) notFound();
  if (!a.published) {
    return (
      <div className="container" style={{ padding: "60px 20px", textAlign: "center" }}>
        <p className="cms-muted">이 글은 아직 공개되지 않았습니다.</p>
        <p><Link href="/" className="cms-link">홈으로</Link></p>
      </div>
    );
  }

  const html = renderMarkdown(a.body);
  return (
    <article className="container" style={{ maxWidth: 760, padding: "32px 20px 60px" }}>
      <p>
        <Link href="/" className="cms-muted" style={{ fontSize: 13 }}>← K·lawus</Link>
        {" · "}
        <Link href={`/articles?cat=${a.category}`} className="cms-link" style={{ fontSize: 13 }}>{CAT_LABEL[a.category]}</Link>
      </p>
      <h1 className="serif" style={{
        fontFamily: "var(--serif)", fontWeight: 900,
        fontSize: "clamp(28px, 4vw, 42px)", lineHeight: 1.15,
        letterSpacing: "-0.025em", margin: "12px 0 14px",
      }}>{a.title}</h1>
      <p style={{
        fontFamily: "var(--serif)", fontStyle: "italic",
        fontSize: 16, lineHeight: 1.7, color: "var(--ink-2)", margin: "0 0 18px",
      }}>{a.excerpt}</p>
      {a.coverImageId && (
        <img src={`/api/files/${a.coverImageId}`} alt="" style={{ width: "100%", display: "block", marginBottom: 22, border: "1px solid var(--line)" }} />
      )}
      <div className="cms-md" dangerouslySetInnerHTML={{ __html: html }} />
      <p style={{ marginTop: 32 }}>
        <Link href={`/articles?cat=${a.category}`} className="cms-link">← {CAT_LABEL[a.category]} 전체 보기</Link>
      </p>
    </article>
  );
}
