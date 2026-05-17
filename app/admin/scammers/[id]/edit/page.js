import { notFound } from "next/navigation";
import { prisma } from "../../../../../lib/db";
import { requireAdmin } from "../../../../../lib/auth";
import { transitionScammerAction } from "../../../actions";
import ScammerForm from "../../ScammerForm";

const STATUS_LABEL = { PENDING: "확인 대기", SCREENED: "검토 완료", EVIDENCE: "증거 확보" };

const TRANSITIONS = [
  { to: "SCREENED", action: "screened", label: "검토 완료로", desc: "기본 확인 완료" },
  { to: "EVIDENCE", action: "evidence", label: "증거 확보로", desc: "증거 확보됨" },
  { to: "PENDING",  action: "rejected", label: "확인 대기로 되돌림", desc: "추가 검토 필요" },
];

export default async function EditScammerPage({ params }) {
  await requireAdmin();
  const { id } = await params;
  const scammer = await prisma.scammer.findUnique({ where: { id } });
  if (!scammer) notFound();
  const reviews = await prisma.scammerReview.findMany({
    where: { scammerId: id },
    orderBy: { createdAt: "desc" },
    include: { byUser: { select: { name: true, email: true } } },
  });

  return (
    <div className="cms-wide">
      <h1 className="cms-h1">경고 사례 수정</h1>

      <div className="cms-row" style={{ marginBottom: 18, gap: 10, alignItems: "center" }}>
        <span className={`tag ${scammer.status === "EVIDENCE" ? "tag-evidence" : scammer.status === "SCREENED" ? "tag-screened" : "tag-pending"}`}>
          현재: {STATUS_LABEL[scammer.status]}
        </span>
        <span className={`cms-pill ${scammer.published ? "cms-pill-on" : ""}`}>{scammer.published ? "공개" : "비공개"}</span>
      </div>

      <fieldset className="cms-fieldset">
        <legend>상태 전이</legend>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {TRANSITIONS.filter((t) => t.to !== scammer.status).map((t) => (
            <form key={t.to} action={transitionScammerAction} style={{ display: "flex", gap: 6, alignItems: "stretch", border: "1px solid var(--line)", padding: 10 }}>
              <input type="hidden" name="id" value={scammer.id} />
              <input type="hidden" name="toStatus" value={t.to} />
              <input type="hidden" name="action" value={t.action} />
              <div style={{ minWidth: 220 }}>
                <strong style={{ display: "block", fontSize: 13.5 }}>{t.label}</strong>
                <span className="cms-muted cms-tiny">{t.desc}</span>
                <input name="note" placeholder="메모 (선택, 감사 로그에 기록)" className="cms-input" style={{ marginTop: 6 }} />
                <label className="cms-checkbox" style={{ marginTop: 6 }}>
                  <input type="radio" name="publish" value="on" defaultChecked={t.to === "EVIDENCE"} /> <span>공개</span>
                </label>
                <label className="cms-checkbox">
                  <input type="radio" name="publish" value="off" /> <span>비공개</span>
                </label>
                <label className="cms-checkbox">
                  <input type="radio" name="publish" value="keep" defaultChecked={t.to !== "EVIDENCE"} /> <span>유지</span>
                </label>
                <button type="submit" className="cms-btn-primary" style={{ marginTop: 8, width: "100%" }}>{t.label}</button>
              </div>
            </form>
          ))}
        </div>
      </fieldset>

      <h2 className="cms-h1" style={{ fontSize: 18, marginTop: 24 }}>전체 필드 수정</h2>
      <ScammerForm scammer={scammer} />

      <fieldset className="cms-fieldset" style={{ marginTop: 24 }}>
        <legend>감사 로그</legend>
        {reviews.length === 0 ? (
          <p className="cms-muted cms-tiny">아직 기록이 없습니다.</p>
        ) : (
          <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {reviews.map((r) => (
              <li key={r.id} style={{ padding: "8px 0", borderBottom: "1px dashed var(--line-soft)" }}>
                <div style={{ fontSize: 13 }}>
                  <strong>{r.action}</strong>
                  {r.fromStatus && r.toStatus && r.fromStatus !== r.toStatus && (
                    <> · {STATUS_LABEL[r.fromStatus]} → {STATUS_LABEL[r.toStatus]}</>
                  )}
                  {r.toStatus && (!r.fromStatus || r.fromStatus === r.toStatus) && (
                    <> · {STATUS_LABEL[r.toStatus]}</>
                  )}
                </div>
                {r.note && <div className="cms-muted cms-tiny" style={{ marginTop: 2 }}>{r.note}</div>}
                <div className="cms-muted cms-tiny" style={{ marginTop: 2 }}>
                  {r.byAdmin ? "Admin" : (r.byUser ? `${r.byUser.name} (${r.byUser.email})` : (r.byEmail || "익명"))}
                  {" · "}{new Date(r.createdAt).toISOString().slice(0, 16).replace("T", " ")}
                </div>
              </li>
            ))}
          </ol>
        )}
      </fieldset>
    </div>
  );
}
