import { requireAdmin } from "../../../lib/auth";
import { prisma } from "../../../lib/db";
import { DEFAULT_LABELS } from "../../../lib/labels";
import { saveLabelsAction, resetLabelAction } from "./actions";

const GROUPS = [
  ["미션", ["site.tagline", "site.subtagline"]],
  ["상단 네비", [
    "nav.home", "nav.news", "nav.columns", "nav.registry",
    "nav.patterns", "nav.voices", "nav.relief", "nav.directory",
    "nav.articles", "nav.businesses", "nav.publicNotice",
    "nav.search", "nav.report",
  ]],
  ["섹션 헤딩", [
    "section.news", "section.columns", "section.registry",
    "section.patterns", "section.voices", "section.relief",
    "section.directory", "section.articles.history",
    "section.articles.cases", "section.articles.prevention",
    "section.articles.safetx", "section.businesses",
    "section.alerts", "section.publicNotice",
  ]],
  ["서비스명", [
    "service.creditCheck", "service.backgroundCheck", "service.debtReporting",
  ]],
  ["CTA·링크", [
    "cta.report", "cta.search", "cta.signup", "cta.login", "cta.adInquiry",
  ]],
];

export default async function LabelsPage({ searchParams }) {
  await requireAdmin();
  const sp = await searchParams;
  const saved = sp?.saved === "1";

  const overrides = await prisma.siteLabel.findMany();
  const overrideMap = new Map(overrides.map((o) => [o.key, o.value]));

  return (
    <div className="cms-wide">
      <h1 className="cms-h1">메뉴·라벨 편집</h1>
      <p className="cms-muted">모든 네비·섹션·CTA 텍스트를 직접 편집할 수 있습니다. 기본값과 같으면 자동으로 DB에서 제거되고 기본값을 따릅니다.</p>
      {saved && <p className="cms-pill cms-pill-on" style={{ marginBottom: 14 }}>저장됨</p>}

      <form action={saveLabelsAction} className="cms-form">
        {GROUPS.map(([groupName, keys]) => (
          <fieldset key={groupName} className="cms-fieldset">
            <legend>{groupName}</legend>
            <table className="cms-table" style={{ marginTop: 4 }}>
              <thead>
                <tr>
                  <th style={{ width: 220 }}>키</th>
                  <th style={{ width: 280 }}>기본값</th>
                  <th>현재 값 (편집 가능)</th>
                  <th style={{ width: 70 }}></th>
                </tr>
              </thead>
              <tbody>
                {keys.map((key) => {
                  const def = DEFAULT_LABELS[key];
                  const current = overrideMap.get(key);
                  const overridden = current != null && current !== def;
                  return (
                    <tr key={key}>
                      <td className="cms-mono cms-tiny">{key}</td>
                      <td className="cms-muted cms-tiny">{def}</td>
                      <td>
                        <input
                          name={`lbl.${key}`}
                          defaultValue={current != null ? current : def}
                          className="cms-input"
                          style={{ width: "100%" }}
                        />
                      </td>
                      <td>
                        {overridden && (
                          <span className="cms-pill cms-pill-on" style={{ fontSize: 10 }}>변경</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </fieldset>
        ))}

        <div className="cms-actions">
          <button type="submit" className="cms-btn-primary">전체 저장</button>
        </div>
      </form>

      {overrides.length > 0 && (
        <fieldset className="cms-fieldset" style={{ marginTop: 18 }}>
          <legend>개별 초기화 (DB에서 제거 → 기본값으로 복귀)</legend>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {overrides.map((o) => (
              <form key={o.key} action={resetLabelAction} style={{ display: "inline" }}>
                <input type="hidden" name="key" value={o.key} />
                <button type="submit" className="cms-btn">{o.key}</button>
              </form>
            ))}
          </div>
        </fieldset>
      )}
    </div>
  );
}
