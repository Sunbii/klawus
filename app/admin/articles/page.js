import Link from "next/link";
import { prisma } from "../../../lib/db";
import { requireAdmin } from "../../../lib/auth";
import { deleteArticleAction } from "./actions";

const CAT_LABEL = {
  HISTORY: "사기사",
  CASE_STUDY: "사기 사례",
  PREVENTION: "대처방법",
  SAFE_TX: "안전 거래",
};

export default async function ArticlesAdminPage({ searchParams }) {
  await requireAdmin();
  const sp = await searchParams;
  const cat = ["HISTORY", "CASE_STUDY", "PREVENTION", "SAFE_TX"].includes(sp?.cat) ? sp.cat : null;
  const items = await prisma.article.findMany({
    where: cat ? { category: cat } : {},
    orderBy: [{ category: "asc" }, { order: "asc" }, { createdAt: "desc" }],
  });
  return (
    <div className="cms-wide">
      <div className="cms-row-between">
        <h1 className="cms-h1">사기사·사례·가이드</h1>
        <Link href="/admin/articles/new" className="cms-btn-primary">+ 새 글</Link>
      </div>
      <div className="reg-hints" style={{ margin: "8px 0 14px" }}>
        <Link href="/admin/articles" className={`cms-btn ${!cat ? "cms-btn-primary" : ""}`}>전체</Link>
        {Object.entries(CAT_LABEL).map(([k, l]) => (
          <Link key={k} href={`/admin/articles?cat=${k}`} className={`cms-btn ${cat === k ? "cms-btn-primary" : ""}`}>{l}</Link>
        ))}
      </div>
      <table className="cms-table">
        <thead>
          <tr><th>카테고리</th><th>순서</th><th>제목</th><th>공개</th><th>수정</th><th></th></tr>
        </thead>
        <tbody>
          {items.map((a) => (
            <tr key={a.id}>
              <td className="cms-tiny">{CAT_LABEL[a.category] || a.category}</td>
              <td>{a.order}</td>
              <td>
                <Link href={`/admin/articles/${a.id}/edit`} className="cms-link">{a.title}</Link>
                <div className="cms-muted cms-tiny">{a.excerpt.slice(0, 80)}{a.excerpt.length > 80 ? "…" : ""}</div>
              </td>
              <td><span className={`cms-pill ${a.published ? "cms-pill-on" : ""}`}>{a.published ? "공개" : "비공개"}</span></td>
              <td className="cms-tiny">{new Date(a.updatedAt).toISOString().slice(0, 10)}</td>
              <td>
                <form action={deleteArticleAction} style={{ display: "inline" }}>
                  <input type="hidden" name="id" value={a.id} />
                  <button type="submit" className="cms-btn-danger">삭제</button>
                </form>
              </td>
            </tr>
          ))}
          {items.length === 0 && <tr><td colSpan={6} className="cms-empty">등록된 글이 없습니다.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
