const issueColumns = [
  {
    title: "금전 사기",
    blurb: "돈을 빌려간 뒤 악의적으로 갚지 않는 경우, 투자금 편취, 공사 계약금 먹튀, 반복적 거래 사기를 다룹니다.",
    points: ["차용증·송금내역 정리", "반복 피해 여부 확인", "공공기록 연결", "집단 제보 가능성 검토"]
  },
  {
    title: "집주인-세입자 분쟁",
    blurb: "보증금 미반환, 허위 임대 광고, 거주 불능 상태 은폐, 강압적 퇴거 시도 같은 생활형 피해를 분리해 다룹니다.",
    points: ["임대차 문서 확보", "사진·수리 이력 정리", "주 법률 리소스 연결", "패턴성 분쟁 여부 검토"]
  },
  {
    title: "커뮤니티 경보",
    blurb: "같은 이름, 같은 전화번호, 같은 업체, 같은 수법이 반복되는 경우 조용히 흩어지지 않도록 경고 구조를 만듭니다.",
    points: ["제보 누적 확인", "검증 레벨 표기", "반론 절차 운영", "전문가 검토 연결"]
  }
];

const trustPillars = [
  {
    label: "Evidence first",
    title: "소문보다 증거",
    text: "문자, 계약서, 송금내역, 판결문, 공공기록이 없는 실명 폭로는 올리지 않습니다."
  },
  {
    label: "Due process",
    title: "정정과 반론 절차",
    text: "사실 오류, 신원 오인, 해결 완료 사안은 정정 요청과 반론권 절차를 둡니다."
  },
  {
    label: "Community safety",
    title: "피해자 보호 우선",
    text: "피해자가 무엇을 모아야 하고 어디에 신고해야 하는지 즉시 행동 경로를 제공합니다."
  }
];

const actions = [
  {
    step: "01",
    title: "피해 기록 정리",
    text: "사건 날짜, 이름, 약속 내용, 송금 내역, 계약 문서를 한 번에 정리할 수 있게 돕습니다."
  },
  {
    step: "02",
    title: "운영 검토",
    text: "단순 비방인지, 실제 피해인지, 공공기록으로 이어지는지 검토 레벨을 나눕니다."
  },
  {
    step: "03",
    title: "공개 또는 연결",
    text: "공개 경고가 필요한 사건은 검증 레이블과 함께 구조화하고, 나머지는 전문가 도움으로 연결합니다."
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
          <h1>사기꾼이 편하게 살고 피해자가 숨어버리는 구조를 뒤집어야 합니다.</h1>
          <p className="lede">
            K-lawus는 미주 한인 사회와 그 주변 거래권에서 반복되는 금전 사기, 악의적 미상환,
            집주인-세입자 분쟁, 계약형 피해를 기록과 검토 중심으로 다루는 플랫폼입니다.
          </p>
          <div className="hero-actions">
            <a href="#issues" className="primary-link">
              어떤 문제를 다루는가
            </a>
            <a href="#process" className="secondary-link">
              운영 방식 보기
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
            <h2>분노의 게시판이 아니라 피해 예방 시스템</h2>
            <p>
              실명 노출 자체가 목적이 아니라, 반복 피해를 막고 피해자가 증거를 잃기 전에
              움직이게 만드는 것이 목적입니다.
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
          <h2>돈을 떼이고, 보증금을 잃고, 계약을 당해도 커뮤니티 안에서는 조용히 끝나버리는 경우가 너무 많습니다.</h2>
        </article>
        <article className="manifesto-card">
          <span className="card-tag">What changes</span>
          <p>
            K-lawus는 흩어진 피해를 패턴으로 바꾸고, 개별 억울함을 구조적인 경고 시스템으로 바꾸는
            데 초점을 둡니다.
          </p>
        </article>
      </section>

      <section className="issues-section" id="issues">
        <div className="section-heading">
          <p className="section-kicker">Coverage</p>
          <h2>핵심은 넓게 흩어지는 것이 아니라, 실제로 반복되는 피해군을 정면으로 잡는 것입니다.</h2>
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
            <h2>피해자가 들어오면 바로 다음 행동이 보여야 합니다.</h2>
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
            <h3>먼저 필요한 것은 조심스러운 공개보다 강한 intake 구조입니다.</h3>
            <p>첫 버전은 제보 수집, 증거 정리, 사기 유형 아카이브, 임대 분쟁 가이드에 집중해야 합니다.</p>
          </article>

          <article className="cta-card">
            <p className="rail-label">Revenue with integrity</p>
            <h3>수익은 사건을 팔아서가 아니라 해결을 연결해서 만들어야 합니다.</h3>
            <p>변호사, 주거 분쟁 전문가, 문서 정리 지원, 공증·번역 서비스 연결이 자연스러운 수익축입니다.</p>
          </article>
        </div>
      </section>

      <section className="standards-section" id="standards">
        <div className="section-heading">
          <p className="section-kicker">Standards</p>
          <h2>이 프로젝트가 버티려면 감정이 아니라 기준이 전면에 있어야 합니다.</h2>
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
