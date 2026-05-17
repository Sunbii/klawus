"use client";

import { useMemo, useState } from "react";

const todayLabel = "2026년 5월 17일 일요일";
const issueLabel = "통권 제 23호 · Sunday Edition";

const briefs = [
  "캘리포니아 SB-611 통과 — 임대 분쟁 변호사 비용 일부 환급",
  "IRS, 2026 한인 사업체 PPP 정산 가이드 업데이트",
  "한국 영사관, 미국 내 상속 신고 절차 새 안내문 배포",
  "뉴저지 한인 식당 임대 계약 분쟁 항소심 판결 정리",
  "ICE 단속 강화에 따른 한인 업주 대응 가이드 발간"
];

const scammers = [
  {
    name: "강남부동산 O씨",
    type: "이중 임대",
    location: "LA · 풀러튼",
    aliases: "Kang Realty, OO Properties LLC",
    cases: 6,
    status: "evidence",
    note: "동일 유닛 중복 계약"
  },
  {
    name: "OO 식자재 유통",
    type: "동업 투자금 편취",
    location: "LA · 오렌지카운티",
    aliases: "FoodLink Inc, OO Distribution",
    cases: 12,
    status: "evidence",
    note: "가짜 매출 보고서·고배당 약속"
  },
  {
    name: "OO 인테리어",
    type: "공사대금 먹튀",
    location: "Anaheim",
    aliases: "Renovation OO, OO Builders LLC",
    cases: 4,
    status: "pending",
    note: "동일 LLC 명의 변경 반복"
  },
  {
    name: "OO 아파트 관리법인",
    type: "보증금 미반환",
    location: "Garden Grove",
    aliases: "OO Property Mgmt",
    cases: 8,
    status: "screened",
    note: "퇴거 90일 초과 미반환, 항목 미공개"
  },
  {
    name: "박OO (개인)",
    type: "차용 미상환",
    location: "Cerritos",
    aliases: "—",
    cases: 5,
    status: "screened",
    note: "$45K 차용 후 잠적, 새 사업체로 활동 정황"
  },
  {
    name: "OO 마켓플레이스 셀러",
    type: "중고차 사기",
    location: "Online · LA 발",
    aliases: "Auto OO, K-Drive Used",
    cases: 7,
    status: "pending",
    note: "결제 직후 차량·연락 두절"
  },
  {
    name: "OO 이민컨설팅",
    type: "유사 법률 행위",
    location: "Koreatown",
    aliases: "USA Visa OO",
    cases: 9,
    status: "evidence",
    note: "변호사 자격 없이 비자 대행 광고"
  },
  {
    name: "OO 한인 미용실 체인",
    type: "선결제 도주",
    location: "Buena Park",
    aliases: "Beauty OO",
    cases: 3,
    status: "pending",
    note: "연간 패키지 결제 후 폐업, 환불 거부"
  }
];

const statusLabel = {
  evidence: "증거 확보",
  screened: "검토 완료",
  pending: "확인 대기"
};

const victimStories = [
  {
    quote:
      "$45,000을 빌려준 지 5년째다. 한국 부모님까지 전화를 하셨다. 매번 ‘다음 달’이라더니 이제는 새 사업을 시작했다고 한다.",
    title: "한 줄 차용증, 5년이 된 빚",
    who: "40대 자영업자",
    where: "Cerritos",
    when: "5일 전",
    label: "확인 중"
  },
  {
    quote:
      "퇴거하고 21일이 지났는데 보증금 $3,200이 입금되지 않는다. 항목별 공제도, 정산서도 없다. 문자만 보내면 ‘확인 중’이라는 답이 온다.",
    title: "21일을 넘긴 보증금",
    who: "30대 직장인",
    where: "Garden Grove",
    when: "1주 전",
    label: "증거 확보"
  },
  {
    quote:
      "동업 1년 만에 친구가 회사를 들고 사라졌다. 통장과 도장은 처음부터 그쪽이 가지고 있었다. 계약서 한 장이 그렇게 무거운 줄 몰랐다.",
    title: "통장과 도장을 맡긴 대가",
    who: "30대 동업자",
    where: "Koreatown, LA",
    when: "2주 전",
    label: "증거 확보"
  },
  {
    quote:
      "‘변호사 친구’라며 비자 서류를 맡았다. 6개월이 지났는데 USCIS에 접수조차 되어 있지 않았다. 알고 보니 변호사 자격이 없었다.",
    title: "변호사가 아닌 ‘변호사 친구’",
    who: "20대 유학생",
    where: "Buena Park",
    when: "3주 전",
    label: "확인 중"
  },
  {
    quote:
      "리모델링 계약금 50%를 보냈더니 자재값으로 다시 30%를 보내달라고 했다. 6개월째 공사는 시작도 안 했고 LLC 이름은 두 번 바뀌었다.",
    title: "시작도 못한 리모델링, 두 번 바뀐 회사 이름",
    who: "50대 주택주",
    where: "Fullerton",
    when: "한 달 전",
    label: "검토 완료"
  }
];

const scamTypes = [
  {
    num: "01",
    title: "이중 임대 (Double Lease)",
    sign: "같은 유닛을 두 명 이상에게 동시 계약, 보증금만 받고 입주 거부",
    flag: "현금·Zelle만 요구, 등기부 비공개, 현장 견학만 허용",
    act: "계약 전 등기부 등본·임대인 신원·기존 임차인 직접 확인"
  },
  {
    num: "02",
    title: "동업 투자금 편취",
    sign: "고정 배당·원금 보장 약속, 가짜 거래처·매출 보고서",
    flag: "감사 없는 재무, Operating Agreement 부재, 계좌 단독 관리",
    act: "변호사 검토 후 LLC 정관·서명·송금 증빙 보관"
  },
  {
    num: "03",
    title: "공사대금 먹튀",
    sign: "계약금 50%+ 선납, 자재 구입 명목 추가 송금 유도",
    flag: "라이선스 미보유, LLC 명의 자주 변경, 견적서 서명 거부",
    act: "CSLB 라이선스 조회, 단계별 지급, 진척 사진·서명 확보"
  },
  {
    num: "04",
    title: "보증금 미반환",
    sign: "퇴거 후 21일(CA) 내 정산서·반환 무시, 임의 공제 추가",
    flag: "이메일·문자 응답 회피, 항목별 영수증 없음",
    act: "독촉 서한 → 소액심판, 입주·퇴거 사진 보관"
  },
  {
    num: "05",
    title: "악의적 차용 미상환",
    sign: "여러 명에게 동시 차용, 변제 약속 반복 불이행",
    flag: "차용증·송금 사유 미기재, 새 사업체로 재활동",
    act: "차용증·문자·송금 확보, Promissory Note 소송 검토"
  },
  {
    num: "06",
    title: "유사 법률·이민 컨설팅",
    sign: "변호사 자격 없이 비자·소송 대행 광고, 환불 거부",
    flag: "California Bar 미등록, 사무실 공유 오피스·임시",
    act: "Bar Search로 자격 조회, 의심 시 California Bar 제보"
  },
  {
    num: "07",
    title: "중고차 마켓 사기",
    sign: "시세보다 낮은 가격, 즉시 결제·픽업 유도",
    flag: "차량 미실물, 운송 보험 명목 추가 결제, 가짜 대리인",
    act: "차량 직접 확인, VIN 조회, 결제는 만남 후"
  },
  {
    num: "08",
    title: "선결제 후 폐업·도주",
    sign: "연간 패키지 결제 유도 후 폐업, 환불 회피",
    flag: "‘선결제 시 할인’ 강매, 영업 양수도 후 책임 부인",
    act: "선결제 자제, 카드 결제 + Chargeback 권리 행사"
  }
];

const columnsData = [
  {
    field: "부동산 · 임대차",
    title: "보증금을 못 받았을 때 가장 먼저 해야 할 5가지",
    excerpt:
      "퇴거 14일 안에 보낸 한 통의 서한이 소액심판의 승패를 가른다. 한인 임차인에게 자주 누락되는 절차를 정리했다.",
    author: "김민수 변호사",
    detail: "Kim & Park PC · 12년차",
    sponsor: {
      label: "부동산·임대차 분쟁 상담",
      who: "이수정 변호사 (Lee Real Estate Law)",
      contact: "(213) 555-0117 · lee-relaw.com"
    }
  },
  {
    field: "기업 · 계약",
    title: "동업 계약서 한 줄이 회사를 살린다 — 한인 동업 분쟁 사례",
    excerpt:
      "한국식 ‘일단 같이 해보자’ 동업이 미국에서 깨질 때 어떤 조항이 결정적이 되는지 본다.",
    author: "박서진 변호사",
    detail: "Park Corporate Law · 9년차",
    sponsor: {
      label: "LLC · 동업 계약 전문",
      who: "정인호 변호사 (Jung Business Law)",
      contact: "(714) 555-0224 · jbusinesslaw.com"
    }
  },
  {
    field: "형사 · 사기",
    title: "투자금 사기, 형사 고소와 민사 소송 어떻게 결정하나",
    excerpt:
      "‘일단 형사부터’가 항상 옳지는 않다. 피해 회복이 목표일 때와 처벌이 목표일 때의 갈림길.",
    author: "이정현 변호사",
    detail: "Lee Criminal Defense · 15년차",
    sponsor: {
      label: "형사 · 사기 · 횡령 변호",
      who: "한지윤 변호사 (Han Defense Group)",
      contact: "(213) 555-0341 · han-defense.com"
    }
  }
];

const topBusinesses = [
  { name: "한약방 OO 한방원", area: "Los Angeles · 한방", score: "4.8", count: "412" },
  { name: "BCD Tofu House", area: "Wilshire · 한식", score: "4.6", count: "1,287" },
  { name: "강남곱창", area: "Cerritos · 한식", score: "4.5", count: "532" },
  { name: "H Mart Garden Grove", area: "Garden Grove · 마트", score: "4.4", count: "2,103" },
  { name: "서울 정형외과", area: "Buena Park · 의료", score: "4.4", count: "287" }
];

const directory = [
  { code: "임", title: "부동산 · 임대차", count: "변호사 18명" },
  { code: "가", title: "가족법 · 이혼", count: "변호사 14명" },
  { code: "형", title: "형사 변호", count: "변호사 9명" },
  { code: "이", title: "이민 · 비자", count: "변호사 22명" },
  { code: "기", title: "기업 · 계약", count: "변호사 11명" },
  { code: "상", title: "상속 · 증여", count: "변호사 7명" }
];

function matchScammer(s, term) {
  const hay = [s.name, s.type, s.location, s.aliases, s.note].join(" ").toLowerCase();
  return hay.includes(term);
}

export default function HomePage() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return scammers;
    return scammers.filter((s) => matchScammer(s, term));
  }, [q]);

  return (
    <>
      <div className="paper-edge">
        <div className="paper-edge-inner">
          <span className="edge-left">{todayLabel}</span>
          <span className="edge-center">{issueLabel}</span>
          <span className="edge-right">
            <a href="#footer">광고 문의</a>
            <span className="sep">·</span>
            <a href="#registry">제보하기</a>
          </span>
        </div>
      </div>

      <header className="masthead">
        <div className="masthead-rule top" aria-hidden="true">
          <span />
          <span />
        </div>
        <div className="masthead-flag">
          <span className="flag-side flag-left">Korean-American</span>
          <h1 className="flag-title">K&middot;lawus</h1>
          <span className="flag-side flag-right">Legal · Community · Trust</span>
        </div>
        <p className="masthead-tagline">
          행위와 증거만 다루는 한인 사회 법률·생활 매체
        </p>
        <div className="masthead-rule bottom" aria-hidden="true">
          <span />
          <span />
        </div>
        <nav className="paper-nav" aria-label="섹션">
          <a href="#page-one">1면</a>
          <span className="dot" aria-hidden="true">•</span>
          <a href="#registry">경고 명단</a>
          <span className="dot" aria-hidden="true">•</span>
          <a href="#voices">피해자의 목소리</a>
          <span className="dot" aria-hidden="true">•</span>
          <a href="#patterns">사기 유형 도감</a>
          <span className="dot" aria-hidden="true">•</span>
          <a href="#columns">변호사 컬럼</a>
          <span className="dot" aria-hidden="true">•</span>
          <a href="#ratings">업체 평점</a>
          <span className="dot" aria-hidden="true">•</span>
          <a href="#directory">변호사 찾기</a>
        </nav>
      </header>

      <main>
        <section className="search-band" aria-label="경고 명단 검색">
          <div className="container search-band-inner">
            <div className="search-meta">
              <span className="kicker">경고 명단 검색</span>
              <p className="search-tag">
                이름 · 업체명 · 별칭 · 지역 · 사기 유형으로 즉시 조회
              </p>
            </div>
            <form
              className="search-box"
              role="search"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="예: 강남부동산, OO 식자재, Garden Grove, 이중 임대"
                aria-label="경고 명단 검색"
              />
              <button type="submit" aria-label="검색">
                검색
              </button>
            </form>
            <div className="search-hints">
              <span>자주 찾는 키워드:</span>
              {["이중 임대", "동업 투자", "보증금 미반환", "공사대금", "차용 미상환"].map(
                (k) => (
                  <button key={k} type="button" onClick={() => setQ(k)}>
                    {k}
                  </button>
                )
              )}
              {q && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={() => setQ("")}
                >
                  검색 지우기
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="page-one" id="page-one">
          <div className="container">
            <div className="page-one-grid">
              <article className="lead-story">
                <span className="kicker">오늘의 톱</span>
                <h2 className="serif lead-headline">
                  캘리포니아 임차인 보증금 한도, 1개월치로 단축…7월 1일 시행
                </h2>
                <p className="dek">
                  7월 1일부터 캘리포니아 내 모든 거주용 임대에서 보증금 상한이
                  월세 1개월치로 제한된다. 한인 임대인·임차인 모두 계약서와
                  정산 절차를 다시 점검해야 한다.
                </p>
                <div className="byline">
                  By 편집부 · 부동산 · 5월 16일 · 6분
                </div>
                <p className="lead-body">
                  <span className="dropcap">캘</span>리포니아 의회가 작년 가을
                  통과시킨 SB-611이 7월 1일부터 시행된다. 핵심은 보증금 상한이
                  월세의 1개월치로 단축된 것. 기존에는 가구 유무에 따라 2~3개월치까지
                  요구할 수 있었다. 본 매체가 확인한 바, 가든그로브와 풀러튼
                  일대 한인 임대인 다수는 계약서 양식을 아직 갱신하지 않은
                  상태였으며, 항목별 정산서 발급 의무도 함께 강화된다.
                </p>
              </article>

              <aside className="page-one-side" aria-label="다른 주요 기사">
                <article className="side-story">
                  <span className="kicker side-kicker">법 원</span>
                  <h3 className="serif">
                    연방대법원, 소액 임대 분쟁 항소 절차 단축안 의견 청취
                  </h3>
                  <p>
                    소액심판 항소 기간 단축이 시행되면 한인 임대 분쟁 비용
                    구조에도 직접 영향이 예상된다.
                  </p>
                </article>
                <hr className="hair" />
                <article className="side-story">
                  <span className="kicker side-kicker">사기 경고</span>
                  <h3 className="serif">
                    한인 식자재 유통 동업 사기, LA·OC 12명 동일 피해 신고
                  </h3>
                  <p>
                    고배당 약속과 가짜 거래처를 동일 패턴으로 반복. 본지 경고
                    명단에서 진행 상황을 갱신한다.
                  </p>
                </article>
                <hr className="hair" />
                <article className="side-story">
                  <span className="kicker side-kicker">생 활</span>
                  <h3 className="serif">
                    한국 영사관, 미국 내 상속 신고 절차 새 안내문 배포
                  </h3>
                  <p>
                    한국 부동산·예금·연금 신고 시 자주 누락되던 항목을 서식
                    예시와 함께 정리했다.
                  </p>
                </article>
              </aside>
            </div>

            <div className="briefs">
              <span className="briefs-label">오늘의 단신</span>
              <ol className="briefs-list">
                {briefs.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="registry" className="band">
          <div className="container">
            <div className="section-rule">
              <span>경고 명단</span>
            </div>
            <p className="section-lede">
              제보·증거가 일정 수준 모인 인물·사업체. 표기된 검증 라벨로
              신뢰 수준을 가늠하세요. 신원 정보는 모자이크 표기되며 공개 전
              당사자 통지·반론 절차를 거칩니다.
            </p>

            <div className="registry-shell">
              <div className="registry-head">
                <span>총 {scammers.length}건 등록 · 검색 결과 {filtered.length}건</span>
                <a href="#voices">관련 사연 보기 →</a>
              </div>
              <table className="registry-table">
                <thead>
                  <tr>
                    <th scope="col">이름 / 사업체</th>
                    <th scope="col">유형</th>
                    <th scope="col">지역</th>
                    <th scope="col">이명 · 관련 명의</th>
                    <th scope="col" className="num">접수</th>
                    <th scope="col">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr key={s.name}>
                      <td>
                        <strong>{s.name}</strong>
                        <div className="row-note">{s.note}</div>
                      </td>
                      <td>{s.type}</td>
                      <td>{s.location}</td>
                      <td className="muted">{s.aliases}</td>
                      <td className="num">{s.cases}건</td>
                      <td>
                        <span className={`tag tag-${s.status}`}>
                          {statusLabel[s.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="empty">
                  <p>해당하는 항목이 없습니다.</p>
                  <p className="muted">
                    이름·업체명·지역·전화번호 일부만 입력해도 검색됩니다.
                    새로 제보하시려면 아래 <a href="#voices">사연 보내기</a>를
                    이용하세요.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="voices" className="band band-soft">
          <div className="container">
            <div className="section-rule">
              <span>피해자의 목소리</span>
            </div>
            <p className="section-lede">
              검증 절차가 진행 중이거나 끝난 사연을 1인칭으로 싣습니다.
              본인이 보낸 사연은 본인의 동의 없이는 공개되지 않으며, 사실
              관계가 다투어지는 부분은 ‘확인 중’으로 표기됩니다.
            </p>

            <div className="voices-grid">
              {victimStories.map((v) => (
                <article key={v.title} className="voice-card">
                  <span className="voice-quote" aria-hidden="true">
                    “
                  </span>
                  <h3 className="serif">{v.title}</h3>
                  <p className="voice-body">{v.quote}</p>
                  <div className="voice-foot">
                    <span className="voice-sig">
                      — {v.who} · {v.where}
                    </span>
                    <span className="voice-meta">
                      <span className={`tag tag-${
                        v.label === "증거 확보"
                          ? "evidence"
                          : v.label === "검토 완료"
                          ? "screened"
                          : "pending"
                      }`}>
                        {v.label}
                      </span>
                      <span className="dot-sep">·</span>
                      <span>{v.when}</span>
                    </span>
                  </div>
                </article>
              ))}
            </div>

            <div className="voices-cta">
              <p>
                <strong>억울한 일이 있다면, 혼자 삼키지 마세요.</strong>{" "}
                사연은 익명으로 보낼 수 있으며, 편집부가 검토 후 검증 라벨과
                함께 게재합니다.
              </p>
              <a href="#" className="link-strong">사연 보내기 →</a>
            </div>
          </div>
        </section>

        <section id="patterns" className="band">
          <div className="container">
            <div className="section-rule">
              <span>사기 유형 도감</span>
            </div>
            <p className="section-lede">
              같은 수법이 다른 이름으로 반복됩니다. 거래·계약 전에 한 번씩
              훑어보세요. <em>수법 · 적신호 · 대응</em> 세 줄로 정리했습니다.
            </p>

            <div className="patterns-grid">
              {scamTypes.map((p) => (
                <article key={p.num} className="pattern-card">
                  <div className="pattern-num">{p.num}</div>
                  <h3 className="serif">{p.title}</h3>
                  <dl>
                    <dt>수법</dt>
                    <dd>{p.sign}</dd>
                    <dt>적신호</dt>
                    <dd>{p.flag}</dd>
                    <dt>대응</dt>
                    <dd>{p.act}</dd>
                  </dl>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="columns" className="band band-soft">
          <div className="container">
            <div className="section-rule">
              <span>변호사 컬럼</span>
            </div>
            <p className="section-lede">
              현직 변호사가 한인 사회에서 실제로 마주친 사례를 풀어냅니다.
              컬럼은 초청제로 운영되며, 자격은 California State Bar로
              확인합니다.
            </p>

            <div className="columns-grid">
              {columnsData.map((c) => (
                <article key={c.title} className="column-card">
                  <span className="kicker">{c.field}</span>
                  <h3 className="serif">{c.title}</h3>
                  <p className="excerpt">{c.excerpt}</p>
                  <div className="byline">
                    By <strong>{c.author}</strong> · {c.detail}
                  </div>
                  <hr className="hair" />
                  <div className="sponsor">
                    <span className="sponsor-label">후원</span>
                    <p>
                      <strong>{c.sponsor.label}</strong> — {c.sponsor.who}
                      <br />
                      <span className="muted">{c.sponsor.contact}</span>
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="ratings" className="band">
          <div className="container">
            <div className="section-rule">
              <span>한인 업체 평점</span>
            </div>
            <p className="section-lede">
              실제 다녀온 사람들의 솔직한 평. 중복·악성 리뷰는 자동 필터로
              걸러집니다.
            </p>
            <div className="ratings-list">
              {topBusinesses.map((b, i) => (
                <div key={b.name} className="business-row">
                  <span className="rank">{String(i + 1).padStart(2, "0")}</span>
                  <span className="business-name">
                    <strong>{b.name}</strong>
                    <span>{b.area}</span>
                  </span>
                  <span className="business-score">
                    <span className="score-num">★ {b.score}</span>
                    <span className="score-count">리뷰 {b.count}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="directory" className="band band-soft">
          <div className="container">
            <div className="section-rule">
              <span>분야별 변호사 찾기</span>
            </div>
            <div className="directory-grid">
              {directory.map((d) => (
                <a key={d.title} href="#" className="directory-card">
                  <span className="dir-code">{d.code}</span>
                  <div>
                    <strong>{d.title}</strong>
                    <span>{d.count}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer id="footer" className="paper-footer">
        <div className="container footer-inner">
          <div className="footer-flag">
            <span className="serif">K&middot;lawus</span>
            <span className="footer-sub">
              Korean-American Legal Hub · {issueLabel}
            </span>
          </div>
          <ul className="footer-links">
            <li><a href="#registry">경고 명단</a></li>
            <li><a href="#voices">피해자의 목소리</a></li>
            <li><a href="#patterns">사기 유형 도감</a></li>
            <li><a href="#columns">변호사 컬럼</a></li>
            <li><a href="#ratings">업체 평점</a></li>
            <li><a href="#">편집 기준</a></li>
            <li><a href="#">정정 · 반론</a></li>
            <li><a href="#">개인정보처리방침</a></li>
          </ul>
          <p className="footer-meta">
            © 2026 K-lawus. 행위와 증거만 다룹니다. 변호사 컬럼은
            초청제로 운영됩니다. 광고 문의는{" "}
            <a href="mailto:ads@klawus.com">ads@klawus.com</a>.
          </p>
        </div>
      </footer>
    </>
  );
}
