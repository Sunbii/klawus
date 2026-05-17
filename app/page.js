const warningLanes = [
  {
    title: "금전 사기 · 악의적 미상환",
    text: "돈을 빌려간 뒤 갚지 않고 버티는 경우, 투자금 편취, 계약금 먹튀, 반복 거래 사기를 경고 대상으로 다룹니다."
  },
  {
    title: "집주인 · 세입자 분쟁",
    text: "보증금 미반환, 허위 임대 광고, 수리 거부, 강압적 퇴거 압박처럼 생활을 무너뜨리는 분쟁을 별도 축으로 다룹니다."
  },
  {
    title: "반복 수법 · 반복 이름 · 반복 업체",
    text: "같은 이름, 같은 번호, 같은 계좌, 같은 업체, 같은 수법이 반복될 때 커뮤니티 경고가 작동해야 합니다."
  }
];

const actionCards = [
  {
    step: "01",
    title: "경고한다",
    text: "증거와 기록이 있는 사건은 검토 후 경고 대상으로 구조화합니다."
  },
  {
    step: "02",
    title: "막는다",
    text: "같은 수법이 다시 통하지 않도록 피해 패턴과 확인 포인트를 공개합니다."
  },
  {
    step: "03",
    title: "보호한다",
    text: "이미 피해를 당한 사람은 자료를 정리하고 신고·상담·대응으로 이어지게 돕습니다."
  }
];

const proofRules = [
  "문자, 계약서, 송금내역, 판결문, 공공기록 등 확인 가능한 자료를 우선합니다.",
  "감정적인 폭로보다 반복 피해를 막는 경고와 기록 정리에 초점을 둡니다.",
  "사실 오류와 신원 오인을 줄이기 위해 정정과 반론 절차를 둡니다."
];

const userPaths = [
  {
    title: "사기 피해를 막고 싶다",
    items: ["어떤 수법이 반복되는지 본다", "거래 전 확인 포인트를 본다", "수상한 패턴을 제보한다"]
  },
  {
    title: "이미 피해를 당했다",
    items: ["무엇부터 모아야 하는지 본다", "제보 전에 자료를 정리한다", "신고·상담·대응 경로를 찾는다"]
  }
];

const guidance = [
  {
    heading: "돈을 보내기 전에",
    body: "계좌, 이름, 계약서, 약속 내용, 과거 분쟁 여부를 확인하지 않은 거래는 가장 쉽게 반복 피해로 이어집니다."
  },
  {
    heading: "임대 계약 전에",
    body: "보증금, 수리 책임, 퇴거 조건, 실거주 상태, 허위 광고 여부를 문서와 사진으로 남겨야 합니다."
  },
  {
    heading: "문제가 생겼다면",
    body: "시간순 기록, 문자·이메일, 송금내역, 계약 문서, 사진, 녹취, 판결문 같은 자료를 먼저 확보해야 합니다."
  }
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
          <a href="#warning-board">경고 대상</a>
          <a href="#how-it-works">작동 방식</a>
          <a href="#help">피해자 도움</a>
          <a href="#standards">운영 기준</a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-main">
          <p className="eyebrow">Community warning and victim protection</p>
          <h1>사기꾼이 발 못 붙이게 만들고, 피해자는 혼자 남지 않게 한다.</h1>
          <p className="lede">
            K-lawus는 금전 사기, 악의적 미상환, 집주인-세입자 분쟁, 반복 계약 피해를 경고하고
            기록하고 대응으로 연결하는 커뮤니티 보호 플랫폼입니다.
          </p>
          <div className="hero-actions">
            <a href="#warning-board" className="primary-link">
              어떤 문제를 경고하는가
            </a>
            <a href="#help" className="secondary-link">
              피해를 당했다면 여기서 시작
            </a>
          </div>
        </div>

        <aside className="hero-side">
          <div className="status-card danger-card">
            <span className="mini-label">First principle</span>
            <strong>첫번째는 제재와 경고</strong>
            <p>반복 사기와 반복 분쟁이 커뮤니티 안에서 조용히 넘어가지 않도록 만드는 것이 출발점입니다.</p>
          </div>

          <div className="status-card">
            <span className="mini-label">Then what</span>
            <strong>그 다음은 피해 예방과 보호</strong>
            <p>같은 수법을 미리 알리고, 이미 피해를 당한 사람은 자료 정리와 대응 경로로 이어지게 돕습니다.</p>
          </div>
        </aside>
      </section>

      <section className="priority-strip">
        <div>
          <span>제재</span>
          <p>반복 가해 패턴을 경고 대상으로 올린다</p>
        </div>
        <div>
          <span>예방</span>
          <p>같은 수법이 다시 통하지 않게 만든다</p>
        </div>
        <div>
          <span>보호</span>
          <p>이미 생긴 피해는 혼자 남지 않게 돕는다</p>
        </div>
      </section>

      <section className="warning-section" id="warning-board">
        <div className="section-heading">
          <p className="section-kicker">Warning board</p>
          <h2>방문자가 먼저 봐야 하는 것은 “이곳이 무엇을 경고하는가”입니다.</h2>
        </div>
        <div className="warning-grid">
          {warningLanes.map((lane) => (
            <article key={lane.title} className="warning-card">
              <h3>{lane.title}</h3>
              <p>{lane.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="impact-section" id="how-it-works">
        <div className="impact-copy">
          <p className="section-kicker">How it works</p>
          <h2>이 사이트는 말만 하는 곳이 아니라, 경고하고 막고 보호하는 순서로 움직여야 합니다.</h2>
        </div>
        <div className="impact-grid">
          {actionCards.map((card) => (
            <article key={card.step} className="impact-card">
              <span>{card.step}</span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="path-section" id="help">
        <div className="section-heading">
          <p className="section-kicker">Start here</p>
          <h2>방문자는 두 갈래로 들어옵니다. 피해를 막고 싶은 사람, 이미 피해를 당한 사람.</h2>
        </div>
        <div className="path-grid">
          {userPaths.map((path) => (
            <article key={path.title} className="path-card">
              <h3>{path.title}</h3>
              <ul>
                {path.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="guidance-section">
        <div className="section-heading">
          <p className="section-kicker">Practical guidance</p>
          <h2>거래 전, 계약 전, 문제가 생긴 뒤에 무엇을 봐야 하는지 한눈에 보여줘야 합니다.</h2>
        </div>
        <div className="guidance-grid">
          {guidance.map((item) => (
            <article key={item.heading} className="guidance-card">
              <h3>{item.heading}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="standards-section" id="standards">
        <div className="standards-shell">
          <div className="section-heading compact">
            <p className="section-kicker">Standards</p>
            <h2>기준이 약하면 경고도 무너집니다. 그래서 기록과 검토가 필요합니다.</h2>
          </div>
          <div className="standards-list">
            {proofRules.map((rule) => (
              <article key={rule} className="standards-item">
                <p>{rule}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
