"use client";

import { useEffect, useMemo, useState } from "react";
import { logoutAction } from "./me/actions";
import { adminLogoutAction } from "./admin/actions";

const NOTICE_KEY = "klawus-notice-v4";

const briefs = [
  "USPS·IRS 사칭 환급 우편 — NJ 19건 적발, USPIS 신고 권고",
  "Flushing 이중 임대 사기 7건 — Manhattan 카운티 검찰 통보",
  "한국어 보이스피싱 — 영사관·검찰 사칭 송금 압박 증가",
  "FoodLink Korea Trading 동업 투자금 $48만 편취 — 14명 집단소송"
];

const heroThumbs = [
  { cat: "cat-finance",    category: "투자 사기",  title: "FoodLink Korea Trading 동업 투자금 $48만 편취 — 14명 집단소송" },
  { cat: "cat-mail",       category: "우편 사기",  title: "USPS·IRS 사칭 환급 우편, NJ 19건 적발 — 한인 노년층 표적" },
  { cat: "cat-digital",    category: "보이스피싱", title: "검찰·영사관 사칭 한국어 전화, NY·NJ 어르신 표적 급증" },
  { cat: "cat-crime",      category: "이민 사기",  title: "Manhattan K-Town 무자격 이민 컨설팅 11건 — NY State Bar 신고" },
  { cat: "cat-realestate", category: "보증금",    title: "Palisades Park 보증금 미반환 9건 — 임의 공제 항목 다수" },
  { cat: "cat-finance",    category: "동업 분쟁",  title: "Operating Agreement 한 줄이 회사를 살린다 — 한인 동업 사례" }
];

const heroLead = {
  cat: "cat-realestate",
  category: "부동산 사기",
  headline:
    "Flushing 이중 임대 사기 7건 동시 진행 — Lee Property Holdings, 보증금만 받고 입주 거부",
  dek:
    "단일 인물이 같은 유닛을 두 명 이상에게 중복 계약한 패턴이 반복 확인됐다. 피해 추정 5만 8천 달러, 다수가 입주 직전 잔금까지 송금한 상태였다. 추가 피해자 자료를 받고 있다.",
  related: [
    "임차인 7명 합의 — Manhattan 카운티 검찰 통보 절차 개시",
    "Lee Property Holdings 등 동일 인물 추정 LLC 4건 식별",
    "한인 부동산 중개 협회, 자체 명단 공유 요청"
  ]
};

const heroSide = {
  top: { cat: "cat-mail", category: "우편 사기", title: "엄마는 우편을 정말 믿었다 — USPS 환급 사칭 한 통의 결말" },
  list: [
    "K-Drive Used Auto — 시세 30% 낮은 매물, 연락 두절 8건",
    "Renovation Star NJ — 계약금 50% 선납 후 미진척 5건",
    "박OO(개인) — ‘한국 가족 의료비’ 명목 차용 6건",
    "BEC 사기 — 거래처 메일 한 글자 위장으로 결제 가로채"
  ]
};

const newsSplit = {
  lead: {
    cat: "cat-realestate", category: "부동산 사기",
    title: "Palisades Park 보증금 미반환 — Special Civil Part 4건 승소",
    brief: "퇴거 후 30일 내 정산 의무 위반, 임의 공제 항목 다수 확인. 임차인 측 변호인 ‘영수증 부재가 결정적이었다’. 추가 5건은 진행 중."
  },
  list: [
    { title: "가짜 식자재 도매 ‘원금 보장’ — 한인 교회 인맥으로 모집", sub: "14명 동시 피해 · FoodLink Korea Trading" },
    { title: "USPS 봉투에 한국어 환급 통지 — Fort Lee·Cliffside Park 직격", sub: "NJ 19건 · USPIS 신고 진행" },
    { title: "거래처 메일 한 글자 위장 — 결제 직전 ‘긴급 계좌 변경’", sub: "BEC · 한인 무역업체 다수 피해" },
    { title: "Manhattan K-Town 무자격 이민 컨설팅 11건", sub: "NY State Bar Unauthorized Practice 신고" }
  ]
};

const FALLBACK_COLUMNS = [
  { cat:"cat-realestate", field:"부동산·임대차 피해", title:"보증금을 못 받았을 때 첫 30일 — NJ Truth-in-Renting 활용법",
    excerpt:"퇴거 후 30일 내 정산서 발급은 임대인 의무. 이 기간을 어떻게 활용하느냐가 Special Civil Part 승패를 가른다.",
    author:"김민수 변호사", detail:"NJ Real Estate · Fort Lee · 12년",
    sponsor:{ label:"임대 분쟁·보증금 회수", who:"이수정 변호사 (Lee Real Estate Law)", contact:"(201) 555-0117 · lee-relaw.com" } },
  { cat:"cat-crime", field:"형사·사기", title:"형사 고소와 민사 회수, 동시에 가능한가",
    excerpt:"‘일단 형사부터’가 늘 옳지는 않다. 피해 회복이 목표라면 민사·집단소송이 우선될 때도 많다.",
    author:"이정현 변호사", detail:"NY Criminal Defense · Manhattan · 15년",
    sponsor:{ label:"형사·사기·횡령", who:"한지윤 변호사 (Han Defense Group)", contact:"(212) 555-0341 · han-defense.com" } },
  { cat:"cat-community", field:"이민·무자격 컨설팅 피해", title:"무자격 ‘이민 컨설팅’에 속았을 때 — 절차 복구는 가능한가",
    excerpt:"USCIS 접수 자체가 안 된 사례, 위조 영수증 사례를 본 적이 있다. 자료 복원과 새 진행은 가능하다.",
    author:"정유라 변호사", detail:"NY Immigration · Bayside · 9년",
    sponsor:{ label:"이민·영주권·USCIS", who:"조선호 변호사 (Cho Immigration Law)", contact:"(718) 555-0228 · cho-immi.com" } },
  { cat:"cat-finance", field:"동업·계약 분쟁", title:"Operating Agreement 한 줄이 회사를 살린다",
    excerpt:"한국식 ‘일단 같이 해보자’ 동업이 미국에서 깨질 때 어떤 조항이 결정적이 되는지, 실제 분쟁 사례로 본다.",
    author:"박서진 변호사", detail:"NY/NJ Corporate · Manhattan · 9년",
    sponsor:{ label:"LLC·동업 계약 전문", who:"정인호 변호사 (Jung Business Law)", contact:"(212) 555-0224 · jbusinesslaw.com" } }
];

const FALLBACK_SCAMMERS = [
  { cat:"cat-realestate", name:"이OO (Lee Property Holdings)", type:"이중 임대", location:"Flushing, Queens, NY", aliases:"Lee Realty Inc, OO Properties LLC", cases:7, status:"evidence", brief:"같은 유닛 중복 계약, 보증금만 수령 후 입주 거부",
    overview:"Flushing·Bayside 일대 임대 유닛을 두 명 이상 임차인에게 중복 계약한 뒤 보증금·첫 달 월세만 수령. 입주일에 ‘기존 임차인 미퇴거’ 사유로 입주 거부, 보증금 반환은 회피.",
    patterns:["Zelle·현금만 요구, 영수증 미발급","공동 명의 LLC를 분기마다 변경","Craigslist·KBJ·한인 카페 동시 광고"],
    progress:"Manhattan 카운티 검찰 통보, 민사 7건 진행. NY State Attorney General 소비자보호국 일괄 자료 제출.",
    damage:"$58,000+", firstReport:"2025.11", lastUpdate:"2026.05.14" },
  { cat:"cat-finance", name:"FoodLink Korea Trading", type:"동업 투자금 편취", location:"Bergen County, NJ", aliases:"K-Foodlink LLC, OO Distribution", cases:14, status:"evidence", brief:"‘원금 보장·월 8% 배당’ — 14명 동일 피해",
    overview:"한인 식자재 도매업 명목으로 ‘원금 보장 + 월 8% 배당’ 약속 후 자금 단독 관리. 2025년 11월부터 배당 중단, 2026년 1월 사실상 잠적.",
    patterns:["허위 거래처 명단·매출 보고서","Operating Agreement 미체결","교회·동향회 인맥으로 모집"],
    progress:"FBI 경제범죄과·NJ County 검찰 동시 고발 검토. 민사 집단소송 준비.",
    damage:"$480,000+", firstReport:"2025.10", lastUpdate:"2026.05.15" },
  { cat:"cat-realestate", name:"Renovation Star NJ", type:"공사대금 먹튀", location:"Fort Lee · Edgewater, NJ", aliases:"Star Builders LLC, OO Home Renovation", cases:5, status:"pending", brief:"계약금 50% 선납 후 자재값 추가 송금, 미진척",
    overview:"리모델링 계약금 50% 선납 후 자재 명목 30% 추가 송금 유도. 6개월 이상 미진척. 분기마다 LLC 명의 변경.",
    patterns:["HIC 라이선스 미보유","자재값 추가 송금 요구","LLC 명의 변경 후 잠적·재영업"],
    progress:"NJ Division of Consumer Affairs 제소 2건. 추가 제보 모집.",
    damage:"$72,000+", firstReport:"2026.01", lastUpdate:"2026.05.12" },
  { cat:"cat-realestate", name:"Palisades Park Properties", type:"보증금 미반환", location:"Palisades Park · Leonia, NJ", aliases:"PPP Management Group", cases:9, status:"screened", brief:"30일 내 정산 의무 위반, 임의 공제 다수",
    overview:"퇴거 후 30일 내 정산서·반환 의무 반복 위반. ‘청소비·페인트 전체 교체’ 등 임의 공제로 보증금 잔액 거의 영, 영수증·견적서 미제공.",
    patterns:["이메일·문자 응답 회피","입주 전·후 사진 동일","9건 모두 같은 매니저 서명"],
    progress:"NJ Special Civil Part 4건 승소, 5건 진행. NJ Truth-in-Renting Act 위반 신고.",
    damage:"$31,500", firstReport:"2025.09", lastUpdate:"2026.05.16" },
  { cat:"cat-community", name:"박OO (개인)", type:"악의적 차용 미상환", location:"Bayside · Cliffside Park, NJ", aliases:"Park OO 등 다수", cases:6, status:"screened", brief:"‘한국 가족 의료비’ 명목 동시 차용, 변제 회피",
    overview:"‘한국 가족 의료비’ 명목으로 다수 동시 차용. 변제 약속 반복 불이행. 새 사업체 명의 활동, 2026년 NJ로 이동 정황.",
    patterns:["차용 사유 동일","차용증 회피 ‘친구 사이’ 강조","변제 약속일 직전 잠적·번호 변경"],
    progress:"Manhattan 민사 Promissory Note 청구 3건. 채권 양수·집단 회수 검토.",
    damage:"$185,000+", firstReport:"2025.08", lastUpdate:"2026.05.10" },
  { cat:"cat-digital", name:"K-Drive Used Auto", type:"중고차 마켓 사기", location:"Online (NY·NJ 배송)", aliases:"Auto K Used, K-Auto Trading", cases:8, status:"pending", brief:"시세 30% 낮은 매물, 운송보험 명목 추가 결제",
    overview:"Craigslist·중고차 한인 카페에 시세보다 30% 낮은 매물. ‘운송 보험’ 명목 추가 결제 후 차량·연락 두절.",
    patterns:["차량 직접 확인 거부 ‘출장 중’","Zelle·Wire 송금 유도","VIN 미공개·위조 의심"],
    progress:"FBI Cyber Division(NJ) 신고 1건. IP·계좌 추적 의뢰.",
    damage:"$96,000+", firstReport:"2026.02", lastUpdate:"2026.05.13" },
  { cat:"cat-crime", name:"USA Visa Korea OO", type:"유사 법률·무자격 이민 컨설팅", location:"Manhattan K-Town (32nd St)", aliases:"Korea Visa Center, OO Immigration Consulting", cases:11, status:"evidence", brief:"변호사 자격 없이 비자 대행, USCIS 미접수",
    overview:"‘이민 전문 변호사’ 자처. NY/NJ State Bar 미등록. 의뢰 서류가 USCIS에 제출되지 않은 사례 다수 확인.",
    patterns:["Bar Number 비공개·공유 오피스","‘성공 보수’ 선납 강요","USCIS 영수증 위조 의심"],
    progress:"NY State Bar Unauthorized Practice 신고 2건. 형사 사기 고소 검토.",
    damage:"$140,000+", firstReport:"2025.07", lastUpdate:"2026.05.15" },
  { cat:"cat-mail", name:"USPS·IRS 환급 사칭 우편", type:"우편 사기 (Mail Scam)", location:"NY·NJ 일대 발송", aliases:"IRS 환급, 한국 세무서, USCIS 환급", cases:19, status:"evidence", brief:"한국어 환급 통지 위조, 수수료 Zelle 송금 유도",
    overview:"공식 인장과 정식 봉투를 위조한 한국어 환급 통지 우편 발송. ‘24시간 내 회신’ 압박과 함께 처리 수수료 명목 Zelle·Wire 송금 요구. 한인 노년층 다수 피해.",
    patterns:["공식 인장·봉투 위조","‘24시간 내 회신’ 압박","회신 번호 모두 동일 가입자"],
    progress:"USPS Postal Inspection Service(1-877-876-2455) 신고. NJ Division of Consumer Affairs 통보.",
    damage:"$62,000+", firstReport:"2026.03", lastUpdate:"2026.05.17" }
];

const statusLabel = { evidence:"증거 확보", screened:"검토 완료", pending:"확인 대기" };

const victimStories = [
  { cat:"cat-realestate", title:"30일을 넘긴 보증금", quote:"퇴거 30일이 지났는데 보증금 $3,200이 입금되지 않는다. 항목별 공제도, 정산서도 없다.", who:"30대 직장인", where:"Palisades Park, NJ", when:"1주 전" },
  { cat:"cat-finance", title:"통장과 도장을 맡긴 대가", quote:"동업 1년 만에 친구가 회사를 들고 사라졌다. 통장과 도장은 처음부터 그쪽이 가지고 있었다.", who:"30대 동업자", where:"Manhattan K-Town", when:"2주 전" },
  { cat:"cat-mail", title:"엄마는 우편을 정말 믿었다", quote:"USPS 봉투에 한국어로 ‘환급 미수령’이라고 적혀 있었다. 어머니는 진짜인 줄 알고 $640을 Zelle로 보내셨다.", who:"60대 어머니의 딸", where:"Fort Lee, NJ", when:"3일 전" },
  { cat:"cat-digital", title:"‘검찰입니다’로 시작한 전화", quote:"발신 번호가 한국 영사관이었다. ‘체포영장 발부됐다, 협조하지 않으면 계좌 동결된다’고 했다.", who:"70대 어르신", where:"Bayside, Queens", when:"5일 전" }
];

const FALLBACK_SCAMTYPES = [
  { num:"01", title:"이중 임대 (Double Lease)", sign:"같은 유닛 중복 계약, 보증금만 받고 입주 거부", flag:"현금·Zelle만 요구, 등기 비공개", act:"NYC ACRIS·NJ Property Records로 실소유주 확인" },
  { num:"02", title:"동업 투자금 편취", sign:"고정 배당 약속, 가짜 거래처와 매출 보고서", flag:"감사 없는 재무, Operating Agreement 부재", act:"변호사 검토 후 정관·서명·송금 증빙 보관" },
  { num:"03", title:"공사대금 먹튀", sign:"계약금 50% 선납, 자재 명목 추가 송금", flag:"HIC 라이선스 미보유, LLC 명의 변경", act:"NJ DCA·NY DOS 라이선스 조회, 단계별 지급" },
  { num:"04", title:"보증금 미반환", sign:"퇴거 후 14일(NY)·30일(NJ) 내 정산 무시", flag:"이메일 응답 회피, 영수증 없음", act:"독촉 서한 → 소액심판" },
  { num:"05", title:"악의적 차용 미상환", sign:"여러 명에게 동시 차용, 변제 반복 불이행", flag:"차용증·송금 사유 미기재", act:"Promissory Note 청구 검토" },
  { num:"06", title:"유사 법률·이민 컨설팅", sign:"변호사 자격 없이 비자·소송 대행", flag:"State Bar 미등록, 공유 오피스", act:"State Bar Search 조회, Bar에 제보" },
  { num:"07", title:"중고차 마켓 사기", sign:"시세보다 낮은 가격, 즉시 결제 유도", flag:"차량 미실물, 운송 보험 명목 추가", act:"VIN 조회, 결제는 만남 후" },
  { num:"08", title:"선결제 후 폐업·도주", sign:"연간 패키지 결제 유도 후 폐업", flag:"‘선결제 시 할인’ 강매", act:"카드 결제 + Chargeback 권리" },
  { num:"09", title:"우편 사기 (Mail Scam)", sign:"IRS·USCIS·세무서 사칭 우편으로 환급 통지", flag:"공식 인장 위조, ‘24시간 회신’ 압박", act:"USPS Postal Inspection 신고" },
  { num:"10", title:"한국어 보이스피싱", sign:"검찰·영사관 사칭 ‘체포영장’ 위협", flag:"발신 번호 위장, 송금·기프트카드 요구", act:"즉시 통화 종료, 공식 번호로 확인" },
  { num:"11", title:"비즈니스 이메일 침해 (BEC)", sign:"거래처·임원 이메일 위조, 계좌 변경", flag:"도메인 한 글자 다름", act:"계좌 변경은 반드시 전화 재확인" },
  { num:"12", title:"로맨스·교제 사기", sign:"앱·SNS 친분 후 ‘급한 의료비’ 송금", flag:"만남·영상통화 회피", act:"사진 역검색, 영상 거부 시 차단" }
];

const reliefSteps = [
  { num:"단계 01", when:"0-24시간 · 즉시", title:"증거를 잃지 마라",
    items:["문자·이메일·통화 기록 스크린샷","송금 내역 PDF 보관","계약서·영수증·우편 원본 보관","은행에 ‘사기 의심’ 통보"] },
  { num:"단계 02", when:"1-7일 · 신고", title:"신고처를 분산하라",
    items:["FBI IC3 (ic3.gov)","USPS Postal Inspection","NY 검찰청 / NJ DCA","지역 경찰 사건 번호 확보"] },
  { num:"단계 03", when:"2-4주 · 법적 검토", title:"민사·형사 동시 검토",
    items:["민사 소액심판·일반 청구","검찰·FBI 형사 고소","Promissory Note 즉시 청구","K-lawus 경고 명단 등재"] },
  { num:"단계 04", when:"1-3개월 · 회수", title:"회수와 재발 방지",
    items:["자산·급여·은행 압류","신용·보험 영향 점검","동일 가해자 신규 활동 추적","사례 익명 게재"] }
];

const directory = [
  { code:"사", title:"사기·횡령(형사)", count:"전담 9명" },
  { code:"임", title:"임대·부동산 분쟁", count:"전담 12명" },
  { code:"이", title:"무자격 이민컨설팅 피해", count:"전담 7명" },
  { code:"소", title:"소비자보호·계약 분쟁", count:"전담 8명" },
  { code:"차", title:"차용·동업 회수", count:"전담 6명" },
  { code:"디", title:"디지털·BEC·보이스피싱", count:"전담 5명" }
];

function matchScammer(s, term) {
  const hay = [s.name, s.type, s.location, s.aliases, s.brief, s.overview].join(" ").toLowerCase();
  return hay.includes(term);
}

function RowHead({ name, more = "더보기", sub = false }) {
  return (
    <header className={`row-head${sub ? " sub" : ""}`}>
      <span className="name">{name}</span>
      <a href="#" className="more">{more} →</a>
    </header>
  );
}

export default function HomeClient({ dbScammers, dbColumns, dbScamTypes, session } = {}) {
  const scammers = dbScammers && dbScammers.length ? dbScammers : FALLBACK_SCAMMERS;
  const columns4 = dbColumns && dbColumns.length ? dbColumns : FALLBACK_COLUMNS;
  const scamTypes = dbScamTypes && dbScamTypes.length ? dbScamTypes : FALLBACK_SCAMTYPES;

  const [q, setQ] = useState("");
  const [notice, setNotice] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.localStorage.getItem(NOTICE_KEY)) setNotice(true);
  }, []);

  const dismissNotice = (persist) => {
    if (persist && typeof window !== "undefined") {
      window.localStorage.setItem(NOTICE_KEY, "1");
    }
    setNotice(false);
  };

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return scammers;
    return scammers.filter((s) => matchScammer(s, term));
  }, [q]);

  const topCases = scammers.slice(0, 2);

  return (
    <>
      {notice && (
        <div className="notice-overlay" role="dialog" aria-modal="true"
          onClick={(e) => { if (e.target === e.currentTarget) dismissNotice(false); }}>
          <div className="notice-panel">
            <button type="button" className="notice-close" aria-label="닫기" onClick={() => dismissNotice(false)}>×</button>
            <span className="notice-tag">긴급 경고</span>
            <h3>USPS·IRS 사칭 환급 우편 사기 — NJ 19건 동시 확인</h3>
            <p>공식 인장과 한국어로 위조된 우편이 한인 가정으로 발송되고 있습니다. ‘24시간 내 회신’ 압박 + Zelle 송금 요구가 핵심 패턴입니다. 절대 회신·송금하지 마세요. 즉시 USPS Postal Inspection(1-877-876-2455)에 신고하세요.</p>
            <div className="notice-actions">
              <a href="#registry" onClick={() => dismissNotice(false)}>경고 명단 보기</a>
              <button type="button" className="ghost" onClick={() => dismissNotice(true)}>다시 보지 않기</button>
            </div>
          </div>
        </div>
      )}

      <div className="utility">
        <div className="utility-inner">
          {session?.kind === "admin" ? (
            <>
              <span className="muted">관리자로 로그인됨</span>
              <span className="sep">|</span>
              <a href="/admin">관리자 페이지</a>
              <span className="sep">|</span>
              <form action={adminLogoutAction} style={{ display: "inline" }}>
                <button type="submit" className="utility-link">로그아웃</button>
              </form>
            </>
          ) : session?.kind === "user" ? (
            <>
              <span className="muted">
                {session.user.name}
                {session.user.role === "LAWYER" ? " 변호사" : " 회원"}님
              </span>
              <span className="sep">|</span>
              <a href="/me">내 페이지</a>
              {session.user.role === "MEMBER" && (
                <>
                  <span className="sep">|</span>
                  <a href="/me/services/new">서비스 신청</a>
                </>
              )}
              <span className="sep">|</span>
              <form action={logoutAction} style={{ display: "inline" }}>
                <button type="submit" className="utility-link">로그아웃</button>
              </form>
            </>
          ) : (
            <>
              <a href="/report">사례 제보</a>
              <span className="sep">|</span>
              <a href="#footer">광고 문의</a>
              <span className="sep">|</span>
              <a href="/signup">회원가입</a>
              <span className="sep">|</span>
              <a href="/login">로그인</a>
            </>
          )}
        </div>
      </div>

      <header className="site-header">
        <div className="site-header-inner">
          <a href="/" className="wordmark" aria-label="K-lawus 홈">K&middot;lawus</a>
        </div>
      </header>

      <nav className="section-nav" aria-label="섹션">
        <div className="section-nav-inner">
          <a href="#top" className="active">홈</a>
          <a href="#news">사기 뉴스</a>
          <a href="#columns">변호사 컬럼</a>
          <a href="#registry">경고 명단</a>
          <a href="#patterns">사기 유형 도감</a>
          <a href="#voices">피해자의 목소리</a>
          <a href="#relief">구제 가이드</a>
          <a href="#directory">변호사 찾기</a>
        </div>
      </nav>

      <main>
        <div className="container grid-4" id="top">

          {/* HERO row : 1 + 2 + 1 */}
          <ul className="span-1 hero-thumbs">
            {heroThumbs.map((t) => (
              <li key={t.title} className="thumb-row">
                <span className={`img-slot ${t.cat}`} aria-hidden="true" />
                <div>
                  <span className="cat-line">{t.category}</span>
                  <h3>{t.title}</h3>
                </div>
              </li>
            ))}
          </ul>

          <article className="span-2 hero-lead">
            <span className={`img-slot wide ${heroLead.cat}`} aria-hidden="true" />
            <span className="cat-line">{heroLead.category}</span>
            <h2 className="serif">{heroLead.headline}</h2>
            <p className="dek">{heroLead.dek}</p>
            <ul className="related">
              {heroLead.related.map((r) => <li key={r}>{r}</li>)}
            </ul>
          </article>

          <aside className="span-1 hero-side" aria-label="사이드">
            <article className="hero-side-top">
              <span className={`img-slot ${heroSide.top.cat}`} aria-hidden="true" />
              <span className="cat-line">{heroSide.top.category}</span>
              <h3 className="serif">{heroSide.top.title}</h3>
            </article>
            <ul className="hero-side-list">
              {heroSide.list.map((t) => <li key={t}>{t}</li>)}
            </ul>
            <div className="ad-inline" aria-label="광고">
              <div><strong>AD</strong>광고 문의<br/>ads@klawus.com</div>
            </div>
          </aside>

          {/* BRIEFS full row */}
          <div className="briefs-bar">
            <div className="briefs-bar-inner">
              <span className="briefs-label">단신</span>
              <ul className="briefs-list">
                {briefs.map((b, i) => (
                  <li key={i}><strong>{String(i + 1).padStart(2, "0")}</strong><span>{b}</span></li>
                ))}
              </ul>
            </div>
          </div>

          {/* SECTION: 사기 뉴스 (2 + 2) */}
          <RowHead name="사기 뉴스" />
          <article id="news" className="span-2 photo-lead">
            <span className={`img-slot wide ${newsSplit.lead.cat}`} aria-hidden="true" />
            <span className="cat-line">{newsSplit.lead.category}</span>
            <h3>{newsSplit.lead.title}</h3>
            <p>{newsSplit.lead.brief}</p>
          </article>
          <ul className="span-2 text-list">
            {newsSplit.list.map((t) => (
              <li key={t.title}>
                {t.title}
                <span className="sub">{t.sub}</span>
              </li>
            ))}
          </ul>

          {/* AD full row */}
          <div className="ad-banner"><div><strong>AD</strong>한인 사회 신뢰 매체 광고 — 사진 없는 텍스트 광고 / ads@klawus.com</div></div>

          {/* SECTION: 변호사 컬럼 (1+1+1+1) */}
          <RowHead name="변호사 컬럼" />
          {columns4.map((c) => {
            const href = c.slug ? `/columns/${c.slug}` : null;
            const TitleEl = href ? "a" : "span";
            return (
              <article id={c === columns4[0] ? "columns" : undefined} key={c.title} className="span-1 column-card">
                {c.coverImageId ? (
                  <a href={href || "#"} aria-label={c.title}>
                    <img
                      src={`/api/files/${c.coverImageId}`}
                      alt=""
                      className="img-slot thumb"
                      style={{ objectFit: "cover", width: "100%" }}
                    />
                  </a>
                ) : (
                  <span className={`img-slot thumb ${c.cat}`} aria-hidden="true" />
                )}
                <div className="column-body">
                  <span className="cat-line">{c.field}</span>
                  <h3>
                    <TitleEl href={href || undefined} style={{ color: "inherit" }}>{c.title}</TitleEl>
                  </h3>
                  <p className="excerpt">{c.excerpt}</p>
                  <div className="column-byline">By <strong>{c.author}</strong> · {c.detail}</div>
                </div>
                <div className="sponsor">
                  <span className="sponsor-label">후원</span>
                  <p>
                    <strong>{c.sponsor.label}</strong> — {c.sponsor.who}<br />
                    <span className="muted">{c.sponsor.contact}</span>
                  </p>
                </div>
              </article>
            );
          })}

          {/* SECTION: 경고 명단 */}
          <RowHead name="경고 명단" />
          <div id="registry" className="span-4 reg-controls">
            <form className="reg-search" role="search" onSubmit={(e) => e.preventDefault()}>
              <input type="search" value={q} onChange={(e) => setQ(e.target.value)}
                placeholder="이름·업체·별칭·지역·유형 검색" aria-label="경고 명단 검색" />
              <button type="submit">검색</button>
            </form>
            <div className="reg-hints">
              <span>자주 찾는 키워드:</span>
              {["이중 임대","동업 투자","보증금 미반환","우편 사기","보이스피싱"].map((k) => (
                <button key={k} type="button" onClick={() => setQ(k)}>{k}</button>
              ))}
            </div>
            <div className="reg-meta">
              <span>총 {scammers.length}건 등록 · 검색 결과 {filtered.length}건</span>
              <a href="#voices">관련 사연 보기 →</a>
            </div>
          </div>

          {filtered.map((s) => (
            <article key={s.name} className="span-1 reg-card">
              {s.photoFileId ? (
                <img
                  src={`/api/files/${s.photoFileId}`}
                  alt={s.name}
                  className="img-slot square"
                  style={{ objectFit: "cover", width: "100%" }}
                />
              ) : (
                <span className={`img-slot square ${s.cat}`} aria-hidden="true" />
              )}
              <div className="reg-card-body">
                <div className="reg-card-head">
                  <h3>{s.name}</h3>
                  <span className={`tag tag-${s.status}`}>{statusLabel[s.status]}</span>
                </div>
                <span className="type">{s.type}</span>
                <span className="loc">{s.location}</span>
                <p>{s.brief}</p>
                <div className="reg-card-foot">
                  <span>접수 {s.cases}건</span>
                  <span>최근 {s.lastUpdate}</span>
                </div>
              </div>
            </article>
          ))}

          {filtered.length === 0 && (
            <div className="span-4" style={{ padding:"24px", textAlign:"center" }}>
              <p style={{ fontFamily:"var(--serif)", fontWeight:700, fontSize:15 }}>해당하는 항목이 없습니다.</p>
            </div>
          )}

          <RowHead name="주요 사건 상세" sub more="명단 전체" />
          {topCases.map((s) => (
            <article key={s.name} className="span-2 case-card">
              <span className={`img-slot tall ${s.cat}`} aria-hidden="true" />
              <div className="case-content">
                <div className="case-id">
                  <div>
                    <h3>{s.name}</h3>
                    <p className="case-id-meta">{s.type} · {s.location} · 이명 {s.aliases}</p>
                  </div>
                  <div className="case-status-right">
                    <span className={`tag tag-${s.status}`}>{statusLabel[s.status]}</span>
                    <span className="count">접수 {s.cases}건</span>
                  </div>
                </div>
                <div className="case-blocks">
                  <div className="case-block"><h4>사건 개요</h4><p>{s.overview}</p></div>
                  <div className="case-block"><h4>주요 패턴</h4>
                    <ul>{s.patterns.map((p) => <li key={p}>{p}</li>)}</ul>
                  </div>
                  <div className="case-block"><h4>진행 상황</h4><p>{s.progress}</p></div>
                </div>
                <div className="case-foot">
                  <span>피해 추정 <strong>{s.damage}</strong></span>
                  <span>최초 접수 <strong>{s.firstReport}</strong></span>
                  <span>최근 갱신 <strong>{s.lastUpdate}</strong></span>
                </div>
              </div>
            </article>
          ))}

          {/* AD full row */}
          <div className="ad-banner"><div><strong>AD</strong>전면 광고 슬롯 — 변호사 / 회계사 / 부동산 등 / ads@klawus.com</div></div>

          {/* SECTION: 사기 유형 도감 */}
          <RowHead name="사기 유형 도감" />
          <div className="span-4 reg-meta">
            <span>현재 <strong style={{color:"var(--red)",fontFamily:"var(--sans)",fontStyle:"normal"}}>{scamTypes.length}종</strong> 등재 · 매주 신규 유형 추가</span>
            <a href="#" style={{ color:"var(--red)", fontWeight:600 }}>전체 보기 →</a>
          </div>
          {scamTypes.map((p) => (
            <article key={p.title} id={p === scamTypes[0] ? "patterns" : undefined} className="span-1 pattern-card">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                {p.iconFileId && (
                  <img
                    src={`/api/files/${p.iconFileId}`}
                    alt=""
                    style={{ width: 28, height: 28, objectFit: "cover", border: "1px solid var(--line)" }}
                  />
                )}
                <div className="pattern-num">{p.num}</div>
              </div>
              <h3>{p.title}</h3>
              <dl>
                <dt>수법</dt><dd>{p.sign}</dd>
                <dt>적신호</dt><dd>{p.flag}</dd>
                <dt>대응</dt><dd>{p.act}</dd>
              </dl>
            </article>
          ))}

          {/* AD full row */}
          <div className="ad-banner"><div><strong>AD</strong>구좌 한정 — 카테고리 후원 (부동산·이민·형사) / ads@klawus.com</div></div>

          {/* SECTION: 피해자의 목소리 */}
          <RowHead name="피해자의 목소리" />
          {victimStories.map((v) => (
            <article key={v.title} id={v === victimStories[0] ? "voices" : undefined} className="span-1 voice-card">
              <span className={`img-slot thumb ${v.cat}`} aria-hidden="true" />
              <div className="voice-body">
                <span className="voice-quote" aria-hidden="true">“</span>
                <h3>{v.title}</h3>
                <p className="voice-text">{v.quote}</p>
                <div className="voice-foot">
                  <span>— {v.who} · {v.where}</span>
                  <span>{v.when}</span>
                </div>
              </div>
            </article>
          ))}
          <div className="voices-cta">
            <p><strong>억울한 일이 있다면, 혼자 삼키지 마세요.</strong> 사연은 익명으로 보낼 수 있습니다.</p>
            <a href="#">사연 보내기 →</a>
          </div>

          {/* SECTION: 피해자 구제 가이드 */}
          <RowHead name="피해자 구제 가이드" />
          {reliefSteps.map((s) => (
            <article key={s.num} id={s === reliefSteps[0] ? "relief" : undefined} className="span-1 relief-step">
              <span className="relief-num">{s.num}</span>
              <h3>{s.title}</h3>
              <span className="relief-when">{s.when}</span>
              <ul>{s.items.map((it) => <li key={it}>{it}</li>)}</ul>
            </article>
          ))}

          {/* SECTION: 분야별 변호사 찾기 (4 + 2+ad span-2) */}
          <RowHead name="분야별 변호사 찾기" />
          {directory.slice(0, 4).map((d) => (
            <a key={d.title} href="#" id={d === directory[0] ? "directory" : undefined} className="span-1 directory-card">
              <span className="dir-code">{d.code}</span>
              <div><strong>{d.title}</strong><span>{d.count}</span></div>
            </a>
          ))}
          {directory.slice(4, 6).map((d) => (
            <a key={d.title} href="#" className="span-1 directory-card">
              <span className="dir-code">{d.code}</span>
              <div><strong>{d.title}</strong><span>{d.count}</span></div>
            </a>
          ))}
          <div className="span-2 ad-inline">
            <div><strong>AD</strong>변호사 디렉터리 우측 광고 — 분야 표시형 텍스트 광고 / ads@klawus.com</div>
          </div>
        </div>
      </main>

      <footer id="footer" className="paper-footer">
        <div className="container footer-inner">
          <div className="footer-flag">
            <span className="serif">K&middot;lawus</span>
            <p>한인 사회 범죄·사기 예방과 피해자 구제. 행위와 증거만 다룹니다.</p>
          </div>
          <ul className="footer-links">
            <li><a href="#registry">경고 명단</a></li>
            <li><a href="#patterns">사기 유형 도감</a></li>
            <li><a href="#voices">피해자의 목소리</a></li>
            <li><a href="#relief">구제 가이드</a></li>
            <li><a href="#columns">변호사 컬럼</a></li>
            <li><a href="#directory">변호사 찾기</a></li>
            <li><a href="#">편집 기준</a></li>
            <li><a href="#">정정 · 반론</a></li>
          </ul>
          <p className="footer-meta">
            © 2026 K-lawus. 변호사 컬럼은 초청제로 운영됩니다. 광고 문의는{" "}
            <a href="mailto:ads@klawus.com">ads@klawus.com</a>. 제보는{" "}
            <a href="mailto:tip@klawus.com">tip@klawus.com</a>.
          </p>
        </div>
      </footer>
    </>
  );
}
