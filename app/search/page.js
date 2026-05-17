import Link from "next/link";
import { prisma } from "../../lib/db";

export const metadata = { title: "K-lawus · 검색" };
export const dynamic = "force-dynamic";

const KIND_LABEL = {
  column: "변호사 컬럼",
  warning: "경고 명단",
  type: "사기 유형",
};

const STATUS_LABEL = {
  EVIDENCE: "증거 확보",
  SCREENED: "검토 완료",
  PENDING: "확인 대기",
};

async function searchAll(term, kind) {
  if (!term) return { columns: [], warnings: [], types: [] };
  const t = term.trim();
  const contains = { contains: t, mode: "insensitive" };

  const wantCol = !kind || kind === "column";
  const wantWarn = !kind || kind === "warning";
  const wantType = !kind || kind === "type";

  const [columns, warnings, types] = await Promise.all([
    wantCol
      ? prisma.column.findMany({
          where: {
            published: true,
            OR: [
              { title: contains },
              { excerpt: contains },
              { body: contains },
              { field: contains },
              { author: { name: contains } },
            ],
          },
          orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
          take: 12,
          include: {
            author: { select: { name: true, firm: true } },
          },
        })
      : Promise.resolve([]),
    wantWarn
      ? prisma.scammer.findMany({
          where: {
            published: true,
            OR: [
              { name: contains },
              { type: contains },
              { location: contains },
              { aliases: contains },
              { brief: contains },
              { overview: contains },
            ],
          },
          orderBy: { updatedAt: "desc" },
          take: 12,
        })
      : Promise.resolve([]),
    wantType
      ? prisma.scamType.findMany({
          where: {
            published: true,
            OR: [
              { title: contains },
              { sign: contains },
              { flag: contains },
              { act: contains },
            ],
          },
          orderBy: [{ order: "asc" }, { createdAt: "asc" }],
          take: 12,
        })
      : Promise.resolve([]),
  ]);

  return { columns, warnings, types };
}

export default async function SearchPage({ searchParams }) {
  const sp = await searchParams;
  const q = String(sp?.q || "").trim();
  const kind = ["column", "warning", "type"].includes(sp?.kind) ? sp.kind : null;
  const { columns, warnings, types } = await searchAll(q, kind);
  const total = columns.length + warnings.length + types.length;

  return (
    <div className="container" style={{ maxWidth: 980, padding: "32px 20px 60px" }}>
      <p>
        <Link href="/" className="cms-muted" style={{ fontSize: 13 }}>← K·lawus</Link>
      </p>
      <h1 className="cms-h1" style={{ marginTop: 12 }}>검색</h1>

      <form method="get" action="/search" className="cms-form cms-row" style={{ alignItems: "stretch", gap: 8 }}>
        <input
          name="q"
          defaultValue={q}
          placeholder="컬럼 · 경고 명단 · 사기 유형 통합 검색"
          autoFocus
          className="cms-input"
          style={{ flex: 1 }}
        />
        {kind && <input type="hidden" name="kind" value={kind} />}
        <button type="submit" className="cms-btn-primary">검색</button>
      </form>

      <div className="reg-hints" style={{ marginTop: 12 }}>
        <span>구분:</span>
        <Link href={`/search?q=${encodeURIComponent(q)}`} className={`cms-btn ${!kind ? "cms-btn-primary" : ""}`}>전체</Link>
        {Object.entries(KIND_LABEL).map(([k, l]) => (
          <Link key={k} href={`/search?q=${encodeURIComponent(q)}&kind=${k}`} className={`cms-btn ${kind === k ? "cms-btn-primary" : ""}`}>{l}</Link>
        ))}
      </div>

      {!q && (
        <p className="cms-muted" style={{ marginTop: 24 }}>
          검색어를 입력해주세요. 컬럼 본문·경고 명단·사기 유형을 한 번에 찾습니다.
        </p>
      )}

      {q && (
        <p className="cms-muted" style={{ marginTop: 12 }}>
          <strong>{q}</strong>에 대한 결과 {total}건 — 컬럼 {columns.length} · 경고 {warnings.length} · 유형 {types.length}
        </p>
      )}

      {warnings.length > 0 && (
        <section style={{ marginTop: 24 }}>
          <h2 className="cms-h1" style={{ fontSize: 18, borderBottom: "1px solid var(--line)", paddingBottom: 6 }}>경고 명단</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 0" }}>
            {warnings.map((w) => (
              <li key={w.id} style={{ display: "grid", gridTemplateColumns: "60px 1fr auto", gap: 12, padding: "10px 0", borderBottom: "1px dashed var(--line-soft)", alignItems: "center" }}>
                {w.photoFileId ? (
                  <img src={`/api/files/${w.photoFileId}`} alt="" style={{ width: 56, height: 56, objectFit: "cover", border: "1px solid var(--line)" }} />
                ) : (
                  <div style={{ width: 56, height: 56, background: "var(--paper-dim)", border: "1px solid var(--line)" }} />
                )}
                <div>
                  <Link href={`/#registry`} className="cms-link" style={{ fontSize: 15, fontWeight: 700 }}>{w.name}</Link>
                  <div className="cms-tiny" style={{ color: "var(--red)", fontWeight: 600 }}>{w.type}</div>
                  <div className="cms-tiny cms-muted">{w.location} · {w.brief}</div>
                </div>
                <span className={`tag ${w.status === "EVIDENCE" ? "tag-evidence" : w.status === "SCREENED" ? "tag-screened" : "tag-pending"}`}>
                  {STATUS_LABEL[w.status] || w.status}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {columns.length > 0 && (
        <section style={{ marginTop: 24 }}>
          <h2 className="cms-h1" style={{ fontSize: 18, borderBottom: "1px solid var(--line)", paddingBottom: 6 }}>변호사 컬럼</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 0" }}>
            {columns.map((c) => (
              <li key={c.id} style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 12, padding: "10px 0", borderBottom: "1px dashed var(--line-soft)" }}>
                {c.coverImageId ? (
                  <img src={`/api/files/${c.coverImageId}`} alt="" style={{ width: 80, height: 60, objectFit: "cover", border: "1px solid var(--line)" }} />
                ) : (
                  <div style={{ width: 80, height: 60, background: "var(--paper-dim)", border: "1px solid var(--line)" }} />
                )}
                <div>
                  <div className="cms-tiny" style={{ color: "var(--red)", fontWeight: 600, letterSpacing: "0.14em" }}>{c.field}</div>
                  <Link href={`/columns/${c.slug}`} className="cms-link" style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em" }}>
                    {c.title}
                  </Link>
                  <div className="cms-tiny cms-muted" style={{ marginTop: 2 }}>{c.excerpt.slice(0, 120)}{c.excerpt.length > 120 ? "…" : ""}</div>
                  <div className="cms-tiny cms-muted">By {c.author?.name}{c.author?.firm ? ` · ${c.author.firm}` : ""}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {types.length > 0 && (
        <section style={{ marginTop: 24 }}>
          <h2 className="cms-h1" style={{ fontSize: 18, borderBottom: "1px solid var(--line)", paddingBottom: 6 }}>사기 유형 도감</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 0" }}>
            {types.map((t) => (
              <li key={t.id} style={{ padding: "12px 0", borderBottom: "1px dashed var(--line-soft)" }}>
                <div style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: 15.5 }}>{t.title}</div>
                <div className="cms-tiny" style={{ marginTop: 4 }}><strong style={{ color: "var(--red)" }}>수법</strong> {t.sign}</div>
                <div className="cms-tiny"><strong style={{ color: "var(--red)" }}>적신호</strong> {t.flag}</div>
                <div className="cms-tiny"><strong style={{ color: "var(--red)" }}>대응</strong> {t.act}</div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {q && total === 0 && (
        <div style={{ marginTop: 28, padding: 24, textAlign: "center", border: "1px dashed var(--line)" }}>
          <p className="cms-muted">검색 결과가 없습니다.</p>
          <p className="cms-muted cms-tiny" style={{ marginTop: 8 }}>
            다른 키워드를 시도하거나 새 사례라면 <Link href="/report" className="cms-link">사례 제보</Link>로 알려주세요.
          </p>
        </div>
      )}
    </div>
  );
}
