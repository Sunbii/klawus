import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { prisma } from "../../../lib/db";

export const dynamic = "force-dynamic";

function renderMarkdown(md) {
  const raw = marked.parse(md || "", { gfm: true, breaks: true });
  return sanitizeHtml(String(raw), {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img", "h1", "h2", "h3", "h4", "h5", "h6", "figure", "figcaption",
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "title"],
      a: ["href", "name", "target", "rel", "title"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    transformTags: {
      a: (tagName, attribs) => ({
        tagName: "a",
        attribs: {
          ...attribs,
          target: attribs.href && attribs.href.startsWith("http") ? "_blank" : undefined,
          rel: attribs.href && attribs.href.startsWith("http") ? "noopener noreferrer" : undefined,
        },
      }),
    },
  });
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const col = await prisma.column.findUnique({
    where: { slug },
    select: { title: true, excerpt: true, published: true },
  });
  if (!col) return { title: "K-lawus" };
  return {
    title: `${col.title} · K-lawus`,
    description: col.excerpt,
    robots: col.published ? undefined : { index: false, follow: false },
  };
}

export default async function ColumnPage({ params }) {
  const { slug } = await params;
  const col = await prisma.column.findUnique({
    where: { slug },
    include: {
      author: { select: { name: true, firm: true, field: true, state: true } },
    },
  });
  if (!col) notFound();
  if (!col.published) {
    return (
      <div className="container" style={{ padding: "60px 20px", textAlign: "center" }}>
        <p className="cms-muted">이 컬럼은 아직 공개되지 않았습니다.</p>
        <p><Link href="/" className="cms-link">홈으로</Link></p>
      </div>
    );
  }

  const html = renderMarkdown(col.body);

  return (
    <article className="container" style={{ maxWidth: 760, padding: "32px 20px 60px" }}>
      <p>
        <Link href="/" className="cms-muted" style={{ fontSize: 13 }}>← K·lawus</Link>
      </p>
      <div className="cat-line" style={{ marginTop: 12 }}>{col.field}</div>
      <h1 className="serif" style={{
        fontFamily: "var(--serif)", fontWeight: 900,
        fontSize: "clamp(28px, 4vw, 42px)", lineHeight: 1.15,
        letterSpacing: "-0.025em", margin: "8px 0 14px",
      }}>
        {col.title}
      </h1>
      <p style={{
        fontFamily: "var(--serif)", fontStyle: "italic",
        fontSize: 16, lineHeight: 1.7, color: "var(--ink-2)", margin: "0 0 18px",
      }}>
        {col.excerpt}
      </p>
      <div style={{
        fontFamily: "var(--serif)", fontStyle: "italic",
        fontSize: 13, color: "var(--muted)",
        paddingBottom: 14, borderBottom: "1px solid var(--line)", marginBottom: 22,
      }}>
        By <strong style={{ color: "var(--ink)", fontStyle: "normal", fontFamily: "var(--sans)", fontWeight: 600 }}>
          {col.author.name} 변호사
        </strong>
        {col.author.firm && <> · {col.author.firm}</>}
        {col.author.field && <> · {col.author.field}</>}
        {col.publishedAt && <> · 게시 {new Date(col.publishedAt).toISOString().slice(0, 10)}</>}
      </div>

      {col.coverImageId && (
        <img
          src={`/api/files/${col.coverImageId}`}
          alt={col.title}
          style={{
            width: "100%", display: "block",
            marginBottom: 22, border: "1px solid var(--line)",
          }}
        />
      )}

      <div className="cms-md" dangerouslySetInnerHTML={{ __html: html }} />

      {(col.sponsorLabel || col.sponsorWho) && (
        <div className="sponsor" style={{ marginTop: 32 }}>
          <span className="sponsor-label">후원</span>
          <p>
            {col.sponsorLabel && <strong>{col.sponsorLabel}</strong>}
            {col.sponsorWho && <> — {col.sponsorWho}</>}
            {col.sponsorContact && (<><br/><span className="muted">{col.sponsorContact}</span></>)}
          </p>
        </div>
      )}

      <p style={{ marginTop: 32 }}>
        <Link href="/" className="cms-link">← 다른 컬럼 보기</Link>
      </p>
    </article>
  );
}
