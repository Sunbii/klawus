const issueColumns = [
  {
    title: "금전 사기",
    blurb: "돈을 빌려주고 받지 못했거나, 투자·계약·거래 과정에서 속았을 때 어떤 자료를 모아야 하는지 안내합니다.",
    points: ["돈을 못 받은 경우", "계약금 먹튀", "투자 사기", "반복 거래 사기"]
  },
  {
    title: "집주인-세입자 분쟁",
    blurb: "보증금 미반환, 허위 매물, 수리 거부, 강압적 퇴거 압박처럼 생활을 무너뜨리는 분쟁에 대응할 수 있게 돕습니다.",
    points: ["보증금 문제", "허위 임대 광고", "거주 환경 분쟁", "퇴거 압박 대응"]
  },
  {
    title: "피해 제보와 경고",
    blurb: "같은 이름, 같은 전화번호, 같은 업체, 같은 수법이 반복될 때 피해가 조용히 묻히지 않도록 돕습니다.",
    points: ["피해 제보 준비", "증거 정리", "검토 후 공개 여부 판단", "전문가 연결"]
  }
];

const trustPillars = [
  {
    label: "Evidence first",
    title: "소문보다 증거",
    text: "문자, 계약서, 송금내역, 판결문, 공공기록처럼 확인 가능한 자료를 우선합니다."
  },
  {
    label: "Due process",
    title: "정정과 반론 절차",
    text: "사실 오류나 신원 오인을 줄이기 위해 정정 요청과 반론 절차를 운영합니다."
  },
  {
    label: "Community safety",
    title: "피해자 보호 우선",
    text: "피해자가 지금 무엇을 모으고 어디에 신고해야 하는지 바로 알 수 있게 돕습니다."
  }
];

const actions = [
  {
    step: "01",
    title: "사건을 정리합니다",
    text: "언제, 누구와, 무엇을 약속했고 지금 어떤 문제가 생겼는지 시간순으로 정리합니다."
  },
  {
    step: "02",
    title: "증거를 모읍니다",
    text: "계약서, 송금 내역, 문자, 이메일, 사진, 판결문 같은 자료를 한곳에 모읍니다."
  },
  {
    step: "03",
    title: "다음 행동을 결정합니다",
    text: "제보, 신고, 상담, 공개 경고 중 무엇이 맞는지 판단할 수 있는 기준을 제공합니다."
  }
];

const proofLevels = [
  "Submitted",
  "Screened",
  "Corroborated",
  "Public Record Confirmed"
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <a href="/" className="brandmark">
          <span className="brand-dot" />
          <span>K-lawus</span>
        </a>
        <nav className="topnav">
          <a href="#mission">문제정의</a>
          <a href="#issues">핵심분야</a>
          <a href="#process">운영방식</a>
          <a href="#standards">원칙</a>
        </nav>
      </header>

      <section className="hero" id="mission">
        <div className="hero-copy">
          <p className="eyebrow">Korean-American community protection platform</p>
          <h1>사기 피해를 당했거나 걱정된다면, 여기서부터 정리하고 대비하세요.</h1>
          <p className="lede">
            K-lawus는 금전 사기, 악의적 미상환, 집주인-세입자 분쟁, 반복되는 계약형 피해에 대해
            무엇을 모으고, 어디에 알리고, 어떻게 대응해야 하는지 안내하는 플랫폼입니다.
          </p>
          <div className="hero-actions">
            <a href="#issues" className="primary-link">
              도움받을 수 있는 문제 보기
            </a>
            <a href="#process" className="secondary-link">
              지금 무엇을 해야 하나
            </a>
          </div>
          <div className="hero-metrics">
            <div>
              <strong>3</strong>
              <span>핵심 피해 축</span>
            </div>
            <div>
              <strong>4</strong>
              <span>검증 레벨</span>
            </div>
            <div>
              <strong>1</strong>
              <span>공익적 기준</span>
            </div>
          </div>
        </div>

        <aside className="hero-rail">
          <div className="rail-card rail-intro">
            <p className="rail-label">What this is</p>
            <h2>피해를 당한 뒤에도, 당하기 전에도 볼 수 있는 안내 페이지</h2>
            <p>
              무턱대고 실명 공개를 하는 곳이 아니라, 피해를 줄이고 필요한 증거와 다음 행동을
              정리할 수 있게 돕는 것이 목적입니다.
            </p>
          </div>

          <div className="rail-card">
            <p className="rail-label">Verification ladder</p>
            <ul className="proof-list">
              {proofLevels.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      <section className="manifesto-grid">
        <article className="manifesto-card accent-card">
          <span className="card-tag">Why now</span>
          <h2>돈을 떼이고, 보증금을 잃고, 억울한 일을 당해도 어디서부터 시작해야 할지 몰라 무너지는 경우가 많습니다.</h2>
        </article>
        <article className="manifesto-card">
          <span className="card-tag">What changes</span>
          <p>
            여기서는 피해를 혼자 끌어안지 않도록, 자료를 정리하고 패턴을 이해하고 도움을 연결받는
            첫 단계를 제공합니다.
          </p>
        </article>
      </section>

      <section className="issues-section" id="issues">
        <div className="section-heading">
          <p className="section-kicker">Coverage</p>
          <h2>방문자가 가장 자주 겪는 문제부터 바로 찾을 수 있어야 합니다.</h2>
        </div>
        <div className="issue-grid">
          {issueColumns.map((column) => (
            <article key={column.title} className="issue-card">
              <h3>{column.title}</h3>
              <p>{column.blurb}</p>
              <ul>
                {column.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="process-section" id="process">
        <div className="process-panel">
          <div className="section-heading compact">
            <p className="section-kicker">Response flow</p>
            <h2>피해를 당했다면, 우선 이 순서대로 움직이세요.</h2>
          </div>
          <div className="timeline">
            {actions.map((action) => (
              <article key={action.step} className="timeline-card">
                <span>{action.step}</span>
                <h3>{action.title}</h3>
                <p>{action.text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="cta-stack">
          <article className="cta-card dark-card">
            <p className="rail-label">Phase 1</p>
            <h3>혼자 판단하기 어렵다면, 먼저 자료를 정리하고 기록을 남기세요.</h3>
            <p>감정적으로 바로 공개하기보다, 증거를 보존하고 사실관계를 분명히 하는 것이 먼저입니다.</p>
          </article>

          <article className="cta-card">
            <p className="rail-label">Practical help</p>
            <h3>필요하면 변호사, 주거 분쟁 지원, 문서 정리 도움까지 연결될 수 있어야 합니다.</h3>
            <p>방문자는 경고만 원하는 것이 아니라, 실제로 문제를 풀 수 있는 다음 단계가 필요합니다.</p>
          </article>
        </div>
      </section>

      <section className="standards-section" id="standards">
        <div className="section-heading">
          <p className="section-kicker">Standards</p>
          <h2>신뢰할 수 있는 안내가 되려면, 기준이 분명해야 합니다.</h2>
        </div>
        <div className="pillars-grid">
          {trustPillars.map((pillar) => (
            <article key={pillar.title} className="pillar-card">
              <span>{pillar.label}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
