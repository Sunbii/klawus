const focusAreas = [
  {
    title: "사기 수법 아카이브",
    description:
      "차용금 미상환, 계약금 편취, 투자 사기, 커뮤니티 소개를 악용한 반복 수법을 유형별로 정리합니다."
  },
  {
    title: "집주인-세입자 분쟁",
    description:
      "보증금 미반환, 허위 임대 광고, 강제퇴거 압박, 반복 임대 분쟁 같은 생활형 피해를 별도 축으로 다룹니다."
  },
  {
    title: "증거 중심 제보",
    description:
      "감정적 폭로가 아니라 송금내역, 계약서, 문자, 판결문, 공공기록을 기반으로 검토하는 구조를 만듭니다."
  }
];

const safetyRules = [
  "민족이나 종교가 아니라 검증 가능한 행위와 기록만 다룹니다.",
  "실명 공개는 검토와 증빙 기준을 충족한 사례에 한정합니다.",
  "반론권, 정정 요청, 삭제 요청 절차를 공개적으로 운영합니다.",
  "주민번호, 계좌번호, 주소 등 민감정보는 공개하지 않습니다."
];

const caseTracks = [
  {
    label: "금전 피해",
    items: ["차용금 미상환", "공사·리모델링 계약금 편취", "투자금 편취", "중고거래 사기"]
  },
  {
    label: "주거 분쟁",
    items: ["보증금 미반환", "허위 매물", "거주 불능 상태 은폐", "반복적 악성 임대 분쟁"]
  },
  {
    label: "피해자 지원",
    items: ["증거 정리 가이드", "공식 신고 링크", "변호사·전문가 연결", "집단 제보 연결"]
  }
];

const roadmap = [
  {
    step: "Phase 1",
    title: "예방 허브 오픈",
    description: "사기 수법과 임대 분쟁 가이드를 먼저 공개하고, 제보는 비공개로 수집합니다."
  },
  {
    step: "Phase 2",
    title: "검증된 사례 공개",
    description: "공공기록과 충분한 증빙이 확인된 사례만 검증 레이블과 함께 공개합니다."
  },
  {
    step: "Phase 3",
    title: "전문가 네트워크 확장",
    description: "변호사, 소비자 보호 전문가, 주거 분쟁 지원 업체와의 연결을 수익 모델로 발전시킵니다."
  }
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Evidence-led community protection</p>
          <h1>K-lawus는 소문이 아니라 기록으로 사람을 지키는 플랫폼입니다.</h1>
          <p className="lede">
            미주 한인 사회에서 반복되는 금전 사기, 계약 분쟁, 집주인-세입자 피해를 예방하고
            피해자가 혼자 남지 않도록 돕는 공익형 플랫폼을 목표로 합니다.
          </p>
          <div className="hero-actions">
            <a href="#blueprint" className="primary-link">
              MVP 구조 보기
            </a>
            <a href="#standards" className="secondary-link">
              운영 원칙 보기
            </a>
          </div>
        </div>
        <aside className="hero-panel">
          <span className="panel-label">Verification framework</span>
          <div className="signal-card">
            <strong>Received</strong>
            <p>제보 접수</p>
          </div>
          <div className="signal-card">
            <strong>Corroborated</strong>
            <p>복수 자료 또는 다중 제보로 보강</p>
          </div>
          <div className="signal-card">
            <strong>Public Record Confirmed</strong>
            <p>판결문·법원기록·공식 문서 기반 확인</p>
          </div>
        </aside>
      </section>

      <section className="focus-grid">
        {focusAreas.map((area) => (
          <article key={area.title} className="glass-card">
            <h2>{area.title}</h2>
            <p>{area.description}</p>
          </article>
        ))}
      </section>

      <section id="blueprint" className="split-section">
        <div>
          <p className="section-kicker">What the first release should do</p>
          <h2>첫 버전은 블랙리스트보다 먼저 신뢰 구조를 보여줘야 합니다.</h2>
          <p>
            공개 폭로 사이트처럼 보이면 오래 버티기 어렵습니다. 그래서 초반 제품은 예방,
            검토, 기록, 지원을 먼저 보여주고, 검증된 사례 공개는 단계적으로 여는 편이
            현실적입니다.
          </p>
        </div>
        <div className="stacked-panels">
          {caseTracks.map((track) => (
            <article key={track.label} className="track-card">
              <h3>{track.label}</h3>
              <ul>
                {track.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="standards" className="standards-section">
        <div className="section-heading">
          <p className="section-kicker">Trust and safeguards</p>
          <h2>운영 원칙이 약하면 이 프로젝트는 좋은 뜻으로도 오래 갈 수 없습니다.</h2>
        </div>
        <div className="rules-grid">
          {safetyRules.map((rule) => (
            <article key={rule} className="rule-card">
              <p>{rule}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="reporting-section">
        <div className="reporting-card">
          <p className="section-kicker">Victim flow</p>
          <h2>피해자가 들어오면 바로 무엇을 해야 하는지 보여줘야 합니다.</h2>
          <ol>
            <li>사건 일시, 상대방 정보, 약속 내용, 현재 상태를 정리합니다.</li>
            <li>계약서, 송금내역, 문자, 이메일, 녹취, 사진 등 증거를 업로드합니다.</li>
            <li>운영진 검토 후 비공개 보관, 추가자료 요청, 공개 검토 여부를 분기합니다.</li>
            <li>필요시 변호사·주거 분쟁 전문가·공식 신고 채널로 연결합니다.</li>
          </ol>
        </div>
        <div className="resource-card">
          <p className="section-kicker">Monetization with trust</p>
          <h2>수익은 신뢰를 해치지 않는 방식으로 붙여야 합니다.</h2>
          <ul>
            <li>변호사 광고와 상담 연결</li>
            <li>주거 분쟁 및 채권 회수 지원 서비스</li>
            <li>증거 정리, 문서 패키징, 번역·공증 지원</li>
            <li>커뮤니티 후원 및 공익 파트너십</li>
          </ul>
        </div>
      </section>

      <section className="roadmap-section">
        <div className="section-heading">
          <p className="section-kicker">Launch path</p>
          <h2>단계적으로 열어야 리스크를 통제하면서도 영향력을 키울 수 있습니다.</h2>
        </div>
        <div className="roadmap-grid">
          {roadmap.map((item) => (
            <article key={item.step} className="roadmap-card">
              <span>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
