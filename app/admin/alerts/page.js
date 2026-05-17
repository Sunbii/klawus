import Link from "next/link";
import { prisma } from "../../../lib/db";
import { requireAdmin } from "../../../lib/auth";
import { deleteAlertAction, toggleAlertActiveAction } from "./actions";

const SEV = { HIGH: "긴급", MEDIUM: "보통", LOW: "낮음" };

export default async function AlertsAdminPage() {
  await requireAdmin();
  const items = await prisma.scamAlert.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="cms-wide">
      <div className="cms-row-between">
        <h1 className="cms-h1">사기 주의보</h1>
        <Link href="/admin/alerts/new" className="cms-btn-primary">+ 새 주의보</Link>
      </div>
      <p className="cms-muted">활성 주의보는 홈 상단 배너로 노출됩니다. 팝업으로도 표시 옵션 켜면 첫 방문 시 모달 표시.</p>
      <table className="cms-table">
        <thead>
          <tr><th>제목</th><th>중요도</th><th>활성</th><th>팝업</th><th>만료</th><th>등록</th><th></th></tr>
        </thead>
        <tbody>
          {items.map((a) => (
            <tr key={a.id}>
              <td>
                <Link href={`/admin/alerts/${a.id}/edit`} className="cms-link">{a.title}</Link>
                <div className="cms-muted cms-tiny">{a.body.slice(0, 80)}{a.body.length > 80 ? "…" : ""}</div>
              </td>
              <td>{SEV[a.severity] || a.severity}</td>
              <td>
                <form action={toggleAlertActiveAction} style={{ display: "inline" }}>
                  <input type="hidden" name="id" value={a.id} />
                  <button type="submit" className={`cms-pill ${a.active ? "cms-pill-on" : ""}`} style={{ border: "1px solid currentColor", background: "transparent", cursor: "pointer" }}>
                    {a.active ? "활성" : "비활성"}
                  </button>
                </form>
              </td>
              <td>{a.popup ? <span className="cms-pill cms-pill-on">팝업</span> : <span className="cms-muted cms-tiny">—</span>}</td>
              <td className="cms-tiny">{a.expiresAt ? new Date(a.expiresAt).toISOString().slice(0, 16).replace("T", " ") : <span className="cms-muted">무제한</span>}</td>
              <td className="cms-tiny">{new Date(a.createdAt).toISOString().slice(0, 10)}</td>
              <td>
                <form action={deleteAlertAction} style={{ display: "inline" }}>
                  <input type="hidden" name="id" value={a.id} />
                  <button type="submit" className="cms-btn-danger">삭제</button>
                </form>
              </td>
            </tr>
          ))}
          {items.length === 0 && <tr><td colSpan={7} className="cms-empty">등록된 주의보가 없습니다.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
