"use client";

import { useEffect, useMemo, useState } from "react";

const NOTICE_KEY = "klawus-notice-v1";

const briefs = [
  "USPS·IRS 사칭 환급 우편 — NJ 19건 동시 적발, USPIS 신고 권고",
  "Flushing 이중 임대 사기 7건 — NY 검찰 통보",
  "한국어 보이스피싱 — 영사관·검찰 사칭 송금 압박 증가",
  "FoodLink Korea Trading 동업 투자금 $48만 편취 — 14명 집단소송 준비"
];

const heroLead = {
  cat: "cat-realestate",
  category: "부동산 사기",
  headline:
    "Flushing 이중 임대 사기 7건 동시 진행 — Lee Property Holdings, 보증금만 받고 입주 거부",
  dek:
    "단일 인물이 같은 유닛을 두 명 이상에게 중복 계약한 패턴이 반복 확인됐다. 피해 추정 5만 8천 달러, 다수가 입주 직전 잔금까지 송금한 상태였다. 추가 피해자 자료를 받고 있다.",
  meta: "부동산 사기 · 7건 접수 · 증거 확보"
};

const heroSides = [
  [
    {
      cat: "cat-finance",
      category: "투자 사기",
      headline:
        "FoodLink Korea Trading 동업 투자금 $48만 편취 — 14명 집단소송 준비",
      brief:
        "‘원금 보장·월 8% 배당’ 약속 후 자금 단독 관리. Operating Agreement 미체결, 가짜 거래처 자료 사용."
    },
    {
      cat: "cat-digital",
      category: "디지털 사기",
      headline:
        "한국어 보이스피싱 — 영사관·검찰 사칭, NY·NJ 한인 노년층 표적",
      brief:
        "체포영장·계좌 동결 위협 후 즉시 송금·기프트카드 요구. 발신 번호를 한국 영사관처럼 위장."
    }
  ],
  [
    {
      cat: "cat-mail",
      category: "우편 사기",
      headline:
        "USPS·IRS 사칭 환급 우편, NJ 19건 적발 — 한인 노년층 표적",
      brief:
        "공식 인장 위조한 한국어 통지문, ‘24시간 내 회신’ 압박. 처리 수수료 명목 Zelle 송금 유도."
    },
    {
      cat: "cat-crime",
      category: "이민 사기",
      headline:
        "Manhattan K-Town 무자격 이민 컨설팅 11건 — NY State Bar 신고",
      brief:
        "‘이민 전문 변호사’ 자처, 실제 자격 무. 의뢰 서류가 USCIS에 접수조차 되지 않은 사례 확인."
    }
  ]
];

const newsCategories = [
  {
    label: "부동산·임대 사기",
    more: "전체 보기",
    lead: {
      cat: "cat-realestate",
      title: "이중 임대 수법 — 동일 유닛 3곳 동시 광고로 보증금만 가로채",
      brief:
        "Craigslist·KBJ·NaverBand 동시 게시 후 첫 송금자에게만 키를 약속, 두 번째 송금자에게는 ‘기존 임차인 미퇴거’ 사유로 잠적."
    },
    sub: [
      "Palisades Park 보증금 미반환 — NJ Special Civil Part 4건 승소",
      "Fort Lee 가짜 리모델링 LLC, 분기마다 명의 변경",
      "Manhattan K-Town 임대 사기 — 영주권 미보유 임차인 표적"
    ]
  },
  {
    label: "투자·금융 사기",
    more: "전체 보기",
    lead: {
      cat: "cat-finance",
      title: "가짜 식자재 도매 ‘원금 보장’ 약속 — 14명 피해, 집단소송 준비",
      brief:
        "월 8% 고정 배당과 위조된 매출 보고서로 신뢰 형성. 한인 교회·동향회 인맥을 통해 모집한 정황."
    },
    sub: [
      "한인 동업 분쟁 — Operating Agreement 부재 시 회수 실질 불가",
      "가짜 부동산 펀드 — 한국 본사 자처, 한인 라디오 광고",
      "가상자산 단톡방 — ‘추천 종목’ 권유 후 출금 차단·잠적"
    ]
  },
  {
    label: "디지털·전화·우편 사기",
    more: "전체 보기",
    lead: {
      cat: "cat-digital",
      title: "한국어 보이스피싱 급증 — 검찰·영사관 사칭 송금 압박",
      brief:
        "발신 번호를 한국 정부기관 번호로 위장. ‘체포영장 발부, 협조하지 않으면 자산 동결’ 시나리오 반복."
    },
    sub: [
      "USPS·IRS 환급 우편 — NJ 19건 동시 적발, USPIS 정식 신고",
      "BEC(비즈니스 이메일 침해) — 거래처 계좌 변경 위장 송금 유도",
      "로맨스 스캠 — 데이팅 앱 친분 후 ‘세관 수수료’ 송금 요구"
    ]
  }
];

const lawyerColumns = [
  {
    cat: "cat-realestate",
    field: "부동산 · 임대차 피해",
    title:
      "보증금을 못 받았을 때 첫 30일 — NJ Truth-in-Renting 활용법",
    excerpt:
      "퇴거 후 30일 내 정산서 발급은 임대인의 의무. 이 기간을 어떻게 활용하느냐가 Special Civil Part 소액심판의 승패를 가른다.",
    author: "김민수 변호사",
    detail: "NJ Real Estate Law · Fort Lee · 12년",
    sponsor: {
      label: "임대 분쟁 · 보증금 회수",
      who: "이수정 변호사 (Lee Real Estate Law)",
      contact: "(201) 555-0117 · lee-relaw.com"
    }
  },
  {
    cat: "cat-crime",
    field: "형사 · 사기",
    title:
      "형사 고소와 민사 회수, 동시에 가능한가 — 우선순위 정하는 기준",
    excerpt:
      "‘일단 형사부터’가 늘 옳지는 않다. 피해 회복이 목표라면 민사·집단소송이 우선될 때도 많다. 두 절차의 갈림길을 정리한다.",
    author: "이정현 변호사",
    detail: "NY Criminal Defense · Manhattan · 15년",
    sponsor: {
      label: "형사 · 사기 · 횡령 변호",
      who: "한지윤 변호사 (Han Defense Group)",
      contact: "(212) 555-0341 · han-defense.com"
    }
  },
  {
    cat: "cat-community",
    field: "이민 · 무자격 컨설팅 피해",
    title:
      "무자격 ‘이민 컨설팅’에 속았을 때 — 영주권 절차 복구는 가능한가",
    excerpt:
      "USCIS 접수 자체가 안 된 사례, 위조 영수증 사례를 본 적이 있다. 시간 손실은 막기 어렵지만, 자료 복원과 새 진행은 별도 절차로 가능하다.",
    author: "정유라 변호사",
    detail: "NY Immigration · Bayside · 9년",
    sponsor: {
      label: "이민 · 영주권 · USCIS 절차",
      who: "조선호 변호사 (Cho Immigration Law)",
      contact: "(718) 555-0228 · cho-immi.com"
    }
  }
];

const scammers = [
  {
    initials: "L",
    cat: "cat-realestate",
    name: "이OO (Lee Property Holdings)",
    type: "이중 임대 (Double Lease)",
    location: "Flushing, Queens, NY",
    aliases: "Lee Realty Inc, OO Properties LLC",
    cases: 7,
    status: "evidence",
    brief: "같은 유닛 중복 계약, 보증금만 수령 후 입주 거부",
    overview:
      "Flushing·Bayside 일대 임대 유닛을 두 명 이상의 임차인에게 중복 계약한 뒤 보증금·첫 달 월세만 수령. 입주일에 ‘기존 임차인 미퇴거’ 사유로 입주 거부, 보증금 반환은 회피.",
    patterns: [
      "Zelle·현금만 요구, 영수증 미발급",
      "공동 명의 LLC를 분기마다 변경",
      "Craigslist·KBJ·KoreaBand 한인 카페 동시 광고"
    ],
    progress:
      "맨해튼 카운티 검찰 통보, 민사 7건 진행. NY State Attorney General 소비자보호국에 일괄 자료 제출.",
    damage: "$58,000+",
    firstReport: "2025.11",
    lastUpdate: "2026.05.14"
  },
  {
    initials: "F",
    cat: "cat-finance",
    name: "FoodLink Korea Trading",
    type: "동업 투자금 편취",
    location: "Bergen County, NJ",
    aliases: "K-Foodlink LLC, OO Distribution",
    cases: 14,
    status: "evidence",
    brief: "‘원금 보장·월 8% 배당’ — 14명 동일 피해",
    overview:
      "한인 식자재 도매업을 명목으로 ‘원금 보장 + 월 8% 배당’ 약속 후 자금 단독 관리. 2025년 11월부터 배당 중단, 2026년 1월 사실상 잠적.",
    patterns: [
      "허위 거래처 명단과 매출 보고서 제공",
      "Operating Agreement 미체결, 회계장부 열람 거부",
      "한인 교회·동향회 인맥으로 신뢰 형성"
    ],
    progress:
      "FBI 경제범죄과·NJ County 검찰 동시 고발 검토. 민사 집단소송 준비 중(Manhattan J 변호사).",
    damage: "$480,000+",
    firstReport: "2025.10",
    lastUpdate: "2026.05.15"
  },
  {
    initials: "R",
    cat: "cat-realestate",
    name: "Renovation Star NJ",
    type: "공사대금 먹튀",
    location: "Fort Lee · Edgewater, NJ",
    aliases: "Star Builders LLC, OO Home Renovation",
    cases: 5,
    status: "pending",
    brief: "계약금 50% 선납 후 자재값 추가 송금, 공사 미진척",
    overview:
      "주택 리모델링 계약금 50% 선납 후 자재 명목 30% 추가 송금 유도. 6개월 이상 공사 미진척. 동일 인물이 분기마다 LLC 명의를 변경.",
    patterns: [
      "NJ Home Improvement Contractor 라이선스 미보유",
      "착수 직후 자재값 추가 송금 요구",
      "LLC 명의 변경 후 잠적·재영업"
    ],
    progress: "NJ Division of Consumer Affairs 제소 2건. 추가 제보 모집 중.",
    damage: "$72,000+",
    firstReport: "2026.01",
    lastUpdate: "2026.05.12"
  },
  {
    initials: "P",
    cat: "cat-realestate",
    name: "Palisades Park Properties",
    type: "보증금 미반환",
    location: "Palisades Park · Leonia, NJ",
    aliases: "PPP Management Group",
    cases: 9,
    status: "screened",
    brief: "30일 내 정산 의무 위반, 임의 공제 항목 다수",
    overview:
      "퇴거 후 30일 내 정산서·반환 의무를 반복 위반. ‘청소비·페인트 전체 교체’ 등 임의 공제로 보증금 잔액을 거의 영으로 만들고 영수증·견적서 미제공.",
    patterns: [
      "이메일 응답 회피, 전화는 음성사서함 자동 연결",
      "입주 전·후 사진 비교 시 동일 상태 다수",
      "9건 모두 같은 매니저 서명·동일 양식"
    ],
    progress:
      "NJ Special Civil Part 소액심판 4건 승소, 5건 진행 중. NJ Truth-in-Renting Act 위반 신고 접수.",
    damage: "$31,500",
    firstReport: "2025.09",
    lastUpdate: "2026.05.16"
  },
  {
    initials: "박",
    cat: "cat-community",
    name: "박OO (개인, 가명 사용 정황)",
    type: "악의적 차용 미상환",
    location: "Bayside, Queens · Cliffside Park, NJ",
    aliases: "Park OO 등 다수",
    cases: 6,
    status: "screened",
    brief: "‘한국 가족 의료비’ 명목 동시 차용, 변제 회피",
    overview:
      "‘한국 가족 의료비’ 명목으로 다수에게 동시 차용. 변제 약속 반복 불이행. 새 사업체 명의로 활동, 2026년 들어 NJ로 활동 무대 이동 정황.",
    patterns: [
      "차용 사유가 모두 동일(가족 의료비)",
      "차용증 작성 회피, ‘친구 사이’ 강조",
      "변제 약속일 직전 잠적·전화번호 변경"
    ],
    progress:
      "Manhattan 민사법원 Promissory Note 청구 3건 진행. 채권 양수·집단 회수 검토.",
    damage: "$185,000+",
    firstReport: "2025.08",
    lastUpdate: "2026.05.10"
  },
  {
    initials: "K",
    cat: "cat-digital",
    name: "K-Drive Used Auto",
    type: "중고차 마켓 사기",
    location: "Online (NY·NJ 배송)",
    aliases: "Auto K Used, K-Auto Trading",
    cases: 8,
    status: "pending",
    brief: "시세 30% 낮은 매물, 운송보험 명목 추가 결제",
    overview:
      "Craigslist·중고차 한인 카페에 시세보다 30% 낮은 매물 게시. ‘운송 보험’ 명목 추가 결제 후 차량·연락 두절. 가짜 ‘대리 직원’ 명의로 송금 유도.",
    patterns: [
      "차량 직접 확인 거부, ‘출장 중’ 사유",
      "Zelle·Wire 송금 유도",
      "VIN 미공개 또는 위조 의심"
    ],
    progress: "FBI Cyber Division(NJ) 신고 1건. IP·계좌 추적 의뢰.",
    damage: "$96,000+",
    firstReport: "2026.02",
    lastUpdate: "2026.05.13"
  },
  {
    initials: "U",
    cat: "cat-crime",
    name: "USA Visa Korea OO",
    type: "유사 법률 · 무자격 이민 컨설팅",
    location: "Manhattan K-Town (32nd St)",
    aliases: "Korea Visa Center, OO Immigration Consulting",
    cases: 11,
    status: "evidence",
    brief: "변호사 자격 없이 비자 대행, USCIS 미접수 사례",
    overview:
      "‘이민 전문 변호사’ 자처. NY/NJ State Bar 미등록. 의뢰 서류가 USCIS에 제출되지 않은 사례 다수 확인.",
    patterns: [
      "Bar Number 비공개, 공유 오피스",
      "‘성공 보수’ 선납 강요",
      "USCIS 접수 영수증 위조 의심"
    ],
    progress: "NY State Bar Unauthorized Practice 신고 2건. 형사 사기 고소 검토.",
    damage: "$140,000+",
    firstReport: "2025.07",
    lastUpdate: "2026.05.15"
  },
  {
    initials: "M",
    cat: "cat-mail",
    name: "USPS·IRS 환급 사칭 우편",
    type: "우편 사기 (Mail Scam)",
    location: "NY·NJ 일대 우편 발송",
    aliases: "IRS 환급, 한국 세무서, USCIS 환급",
    cases: 19,
    status: "evidence",
    brief: "한국어 환급 통지 위조, 처리수수료 Zelle 송금 유도",
    overview:
      "공식 인장과 정식 봉투를 위조한 한국어 환급 통지 우편 발송. ‘24시간 내 회신’ 압박과 함께 처리 수수료 명목 Zelle·Wire 송금 요구. 한인 노년층 다수 피해.",
    patterns: [
      "공식 인장·봉투 위조, 수신자 한국명 정확",
      "‘24시간 내 회신’ 압박 문구",
      "회신 번호는 모두 동일 가입자"
    ],
    progress:
      "USPS Postal Inspection Service(1-877-876-2455) 신고 진행. NJ Division of Consumer Affairs 동시 통보.",
    damage: "$62,000+",
    firstReport: "2026.03",
    lastUpdate: "2026.05.17"
  }
];

const statusLabel = {
  evidence: "증거 확보",
  screened: "검토 완료",
  pending: "확인 대기"
};

const victimStories = [
  {
    cat: "cat-realestate",
    title: "21일을 넘긴 보증금",
    quote:
      "퇴거하고 30일이 지났는데 보증금 $3,200이 입금되지 않는다. 항목별 공제도, 정산서도 없다. 문자만 보내면 ‘확인 중’이라는 답이 온다.",
    who: "30대 직장인",
    where: "Palisades Park, NJ",
    when: "1주 전"
  },
  {
    cat: "cat-finance",
    title: "통장과 도장을 맡긴 대가",
    quote:
      "동업 1년 만에 친구가 회사를 들고 사라졌다. 통장과 도장은 처음부터 그쪽이 가지고 있었다. 계약서 한 장이 그렇게 무거운 줄 몰랐다.",
    who: "30대 동업자",
    where: "Manhattan K-Town",
    when: "2주 전"
  },
  {
    cat: "cat-mail",
    title: "엄마는 우편을 정말 믿었다",
    quote:
      "USPS 봉투에 한국어로 ‘환급 미수령’이라고 적혀 있었다. 어머니는 진짜인 줄 알고 회신 번호로 전화하셨고, ‘처리 수수료’ $640을 Zelle로 보내셨다.",
    who: "60대 어머니의 딸",
    where: "Fort Lee, NJ",
    when: "3일 전"
  },
  {
    cat: "cat-crime",
    title: "변호사가 아닌 ‘변호사 친구’",
    quote:
      "‘변호사 친구’라며 비자 서류를 맡았다. 6개월이 지났는데 USCIS에 접수조차 되어 있지 않았다. 알고 보니 자격 자체가 없었다.",
    who: "20대 유학생",
    where: "Manhattan K-Town",
    when: "3주 전"
  },
  {
    cat: "cat-realestate",
    title: "두 번 바뀐 회사 이름",
    quote:
      "리모델링 계약금 50%를 보냈더니 자재값으로 다시 30%를 보내달라고 했다. 6개월째 공사는 시작도 안 했고 LLC 이름은 두 번 바뀌었다.",
    who: "50대 주택주",
    where: "Edgewater, NJ",
    when: "한 달 전"
  },
  {
    cat: "cat-digital",
    title: "‘검찰입니다’로 시작한 전화",
    quote:
      "발신 번호가 한국 영사관이었다. 한국어로 ‘체포영장이 발부됐다, 협조하지 않으면 계좌가 동결된다’고 했다. 머리가 새하얘져서 기프트카드를 사러 갔다.",
    who: "70대 어르신",
    where: "Bayside, Queens",
    when: "5일 전"
  }
];

const scamTypes = [
  {
    num: "01",
    title: "이중 임대 (Double Lease)",
    sign: "같은 유닛을 두 명 이상에게 동시 계약, 보증금만 받고 입주 거부",
    flag: "현금·Zelle만 요구, 등기 정보 비공개, 견학만 허용",
    act: "계약 전 NYC ACRIS·NJ Property Records로 실소유주 확인"
  },
  {
    num: "02",
    title: "동업 투자금 편취",
    sign: "고정 배당·원금 보장 약속, 가짜 거래처와 매출 보고서",
    flag: "감사 없는 재무, Operating Agreement 부재, 계좌 단독 관리",
    act: "변호사 검토 후 LLC 정관·서명·송금 증빙 보관"
  },
  {
    num: "03",
    title: "공사대금 먹튀",
    sign: "계약금 50%+ 선납 요구, 자재 명목 추가 송금 유도",
    flag: "HIC 라이선스 미보유, LLC 명의 자주 변경",
    act: "NJ DCA·NY DOS Home Improvement 조회. 단계별 지급·진척 사진"
  },
  {
    num: "04",
    title: "보증금 미반환",
    sign: "퇴거 후 14일(NY)·30일(NJ) 내 정산서·반환 무시",
    flag: "이메일·문자 응답 회피, 항목별 영수증 없음",
    act: "독촉 서한 → 소액심판(NY Civil Court / NJ Special Civil Part)"
  },
  {
    num: "05",
    title: "악의적 차용 미상환",
    sign: "여러 명에게 동시 차용, 변제 약속 반복 불이행",
    flag: "차용증·송금 사유 미기재, 새 사업체로 재활동",
    act: "차용증·문자·송금 확보, Promissory Note 청구 검토"
  },
  {
    num: "06",
    title: "유사 법률 · 이민 컨설팅",
    sign: "변호사 자격 없이 비자·소송 대행 광고, 환불 거부",
    flag: "NY/NJ State Bar 미등록, 공유 오피스·임시 사무실",
    act: "State Bar Search로 자격 조회, 의심 시 Bar에 제보"
  },
  {
    num: "07",
    title: "중고차 마켓 사기",
    sign: "시세보다 낮은 가격, 즉시 결제·픽업 유도",
    flag: "차량 미실물, 운송 보험 명목 추가 결제, 가짜 대리인",
    act: "차량 직접 확인, VIN 조회(NICB·Carfax), 결제는 만남 후"
  },
  {
    num: "08",
    title: "선결제 후 폐업·도주",
    sign: "연간 패키지 결제 유도 후 폐업, 환불 회피",
    flag: "‘선결제 시 할인’ 강매, 영업 양수도 후 책임 부인",
    act: "선결제 자제, 카드 결제 + Chargeback 권리 행사"
  },
  {
    num: "09",
    title: "우편 사기 (Mail Scam)",
    sign: "IRS·USCIS·세무서 사칭 우편으로 환급·과태료 통지",
    flag: "공식 인장 위조, ‘24시간 내 회신’ 압박, Zelle 수수료 요구",
    act: "USPS Postal Inspection(1-877-876-2455) 신고, 우편 원본 보존"
  },
  {
    num: "10",
    title: "한국어 보이스피싱",
    sign: "검찰·국세청·영사관 사칭 한국어 전화, ‘체포영장’ 언급",
    flag: "발신 번호 위장, 즉시 송금·기프트카드 요구",
    act: "즉시 통화 종료. 기관 공식 번호로 직접 확인. FBI IC3 신고"
  },
  {
    num: "11",
    title: "비즈니스 이메일 침해 (BEC)",
    sign: "거래처·임원 이메일 위조, 결제 계좌 변경 요청",
    flag: "도메인 한 글자 다름(예: rn→m), 결제 직전 ‘긴급’ 사유",
    act: "계좌 변경은 반드시 전화 재확인. SPF·DMARC·DKIM 설정 점검"
  },
  {
    num: "12",
    title: "로맨스 · 교제 사기",
    sign: "데이팅 앱·SNS 친분 후 ‘급한 의료비·세관 수수료’ 송금 요청",
    flag: "직접 만남·영상통화 회피, 사진 도용 의심, 가족 비극 시나리오",
    act: "사진 역검색(Google Lens), 영상 거부 시 차단·FBI IC3 신고"
  }
];

const reliefSteps = [
  {
    num: "단계 01",
    when: "0-24시간 · 즉시",
    title: "증거를 잃지 마라",
    items: [
      "모든 문자·이메일·통화기록 스크린샷",
      "송금 내역(Zelle/Wire/카드) PDF 보관",
      "계약서·영수증·우편 원본 사진+원본 보관",
      "은행에 즉시 ‘사기 의심’ 통보, 가능 시 회수 절차"
    ]
  },
  {
    num: "단계 02",
    when: "1-7일 · 신고",
    title: "신고처를 분산하라",
    items: [
      "FBI IC3 (ic3.gov) — 모든 디지털·우편 사기",
      "USPS Postal Inspection (1-877-876-2455) — 우편 사기",
      "NY 검찰청 소비자보호국 / NJ Division of Consumer Affairs",
      "지역 경찰서 사건 번호 확보 (보험·소송 근거)"
    ]
  },
  {
    num: "단계 03",
    when: "2-4주 · 법적 검토",
    title: "민사·형사 동시 검토",
    items: [
      "민사: 소액심판(NY $10K / NJ $5K) 또는 일반 민사 청구",
      "형사: 검찰·FBI 고소 — 회수보다 처벌 목적",
      "Promissory Note·계약서 있으면 즉시 청구 가능",
      "K-lawus 경고 명단 등재 — 패턴 연결로 동조 피해자 확보"
    ]
  },
  {
    num: "단계 04",
    when: "1-3개월 · 회수",
    title: "회수와 재발 방지",
    items: [
      "승소 판결 → 자산 압류·급여 압류·은행 동결",
      "신용 기록·보험 청구 영향 점검",
      "동일 가해자 신규 활동 모니터링",
      "사례 익명 게재로 다음 피해자 차단"
    ]
  }
];

const directory = [
  { code: "사", title: "사기·횡령(형사)", count: "전담 변호사 9명" },
  { code: "임", title: "임대·부동산 분쟁", count: "전담 변호사 12명" },
  { code: "이", title: "무자격 이민컨설팅 피해", count: "전담 변호사 7명" },
  { code: "소", title: "소비자보호·계약 분쟁", count: "전담 변호사 8명" },
  { code: "차", title: "차용·동업 회수", count: "전담 변호사 6명" },
  { code: "디", title: "디지털·BEC·보이스피싱", count: "전담 변호사 5명" }
];

function matchScammer(s, term) {
  const hay = [s.name, s.type, s.location, s.aliases, s.brief, s.overview].join(" ").toLowerCase();
  return hay.includes(term);
}

export default function HomePage() {
  const [q, setQ] = useState("");
  const [notice, setNotice] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = window.localStorage.getItem(NOTICE_KEY);
    if (!seen) setNotice(true);
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
        <div
          className="notice-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="notice-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) dismissNotice(false);
          }}
        >
          <div className="notice-panel">
            <button
              type="button"
              className="notice-close"
              aria-label="닫기"
              onClick={() => dismissNotice(false)}
            >
              ×
            </button>
            <span className="notice-tag">긴급 경고</span>
            <h3 id="notice-title">
              USPS·IRS 사칭 환급 우편 사기 — NJ 19건 동시 확인
            </h3>
            <p>
              공식 인장과 한국어로 위조된 우편이 한인 가정으로 발송되고
              있습니다. ‘24시간 내 회신’ 압박 + Zelle 송금 요구가 핵심
              패턴입니다. 절대 회신·송금하지 마세요. 즉시 USPS Postal
              Inspection(1-877-876-2455)에 신고하세요.
            </p>
            <div className="notice-actions">
              <a href="#registry" onClick={() => dismissNotice(false)}>
                경고 명단 보기
              </a>
              <button
                type="button"
                className="ghost"
                onClick={() => dismissNotice(true)}
              >
                다시 보지 않기
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="paper-edge">
        <div className="paper-edge-inner">
          <span className="edge-left">
            <span className="edge-dot" aria-hidden="true" />
            한인 사회 범죄·사기 예방, 피해자 구제
          </span>
          <span className="edge-right">
            <a href="#footer">광고 문의</a>
            <a href="#registry">제보하기</a>
          </span>
        </div>
      </div>

      <header className="masthead">
        <div className="masthead-rule top" aria-hidden="true">
          <span /><span />
        </div>
        <div className="masthead-flag">
          <span className="flag-side flag-left">New York · New Jersey</span>
          <h1 className="flag-title">K&middot;lawus</h1>
          <span className="flag-side flag-right">Fraud Watch · Victim Relief</span>
        </div>
        <p className="masthead-tagline">
          행위와 증거만 다룬다. 한인 사회 범죄·사기 예방과 피해자 구제 중심.
        </p>
        <div className="masthead-rule bottom" aria-hidden="true">
          <span /><span />
        </div>
        <nav className="paper-nav" aria-label="섹션">
          <a href="#top">주요 사건</a>
          <span className="dot" aria-hidden="true">•</span>
          <a href="#news">사기 뉴스</a>
          <span className="dot" aria-hidden="true">•</span>
          <a href="#columns">변호사 컬럼</a>
          <span className="dot" aria-hidden="true">•</span>
          <a href="#registry">경고 명단</a>
          <span className="dot" aria-hidden="true">•</span>
          <a href="#patterns">사기 유형 도감</a>
          <span className="dot" aria-hidden="true">•</span>
          <a href="#voices">피해자의 목소리</a>
          <span className="dot" aria-hidden="true">•</span>
          <a href="#relief">피해자 구제 가이드</a>
          <span className="dot" aria-hidden="true">•</span>
          <a href="#directory">변호사 찾기</a>
        </nav>
      </header>

      <section className="search-band" aria-label="경고 명단 검색">
        <div className="container search-band-inner">
          <div className="search-meta">
            <span className="kicker">경고 명단 검색</span>
            <p className="search-tag">이름 · 업체 · 별칭 · 지역 · 사기 유형 조회</p>
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
              placeholder="예: 이중 임대, FoodLink, Palisades Park, 우편 사기"
              aria-label="경고 명단 검색"
            />
            <button type="submit">검색</button>
          </form>
          <div className="search-hints">
            <span>자주 찾는 키워드:</span>
            {["이중 임대", "동업 투자", "보증금 미반환", "우편 사기", "보이스피싱"].map(
              (k) => (
                <button key={k} type="button" onClick={() => setQ(k)}>
                  {k}
                </button>
              )
            )}
          </div>
        </div>
      </section>

      <main>
        <section className="hero" id="top">
          <div className="container">
            <div className="hero-grid">
              <article className="hero-lead">
                <span className="kicker">{heroLead.category}</span>
                <span className={`img-slot wide ${heroLead.cat}`} aria-hidden="true" />
                <h2 className="serif">{heroLead.headline}</h2>
                <p className="dek">{heroLead.dek}</p>
                <p className="meta">{heroLead.meta}</p>
              </article>

              {heroSides.map((col, i) => (
                <aside key={i} className="hero-side" aria-label={`사이드 ${i + 1}`}>
                  {col.map((s) => (
                    <article key={s.headline}>
                      <span className={`img-slot thumb ${s.cat}`} aria-hidden="true" />
                      <span className="kicker">{s.category}</span>
                      <h3 className="serif">{s.headline}</h3>
                      <p>{s.brief}</p>
                    </article>
                  ))}
                </aside>
              ))}
            </div>
          </div>
        </section>

        <div className="briefs-bar">
          <div className="container briefs-bar-inner">
            <span className="briefs-label">단신</span>
            <ul className="briefs-list">
              {briefs.map((b, i) => (
                <li key={i}>
                  <strong>{String(i + 1).padStart(2, "0")}</strong>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <section id="news" className="band">
          <div className="container">
            <div className="section-rule"><span>사기 뉴스</span></div>
            <p className="section-sub">
              부동산·금융·디지털 — 한인 사회에서 반복되는 사기 사건을 카테고리별로 정리합니다.
            </p>

            <div className="cat-grid">
              {newsCategories.map((cat) => (
                <div key={cat.label} className="cat-col">
                  <div className="cat-head">
                    <span className="label">{cat.label}</span>
                    <a href="#" className="more">{cat.more} →</a>
                  </div>
                  <article className="cat-lead">
                    <span className={`img-slot wide ${cat.lead.cat}`} aria-hidden="true" />
                    <h3 className="serif">{cat.lead.title}</h3>
                    <p>{cat.lead.brief}</p>
                  </article>
                  <ul className="cat-sub">
                    {cat.sub.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="columns" className="band band-cream">
          <div className="container">
            <div className="section-rule"><span>변호사 컬럼</span></div>
            <p className="section-sub">
              피해자 대응에 강한 현직 변호사들의 글. 컬럼은 <strong>초청제</strong>로
              운영되며, 자격은 NY·NJ State Bar로 확인합니다.
            </p>

            <div className="columns-grid">
              {lawyerColumns.map((c) => (
                <article key={c.title} className="column-card">
                  <span className={`img-slot thumb ${c.cat}`} aria-hidden="true" />
                  <div className="column-body">
                    <span className="kicker">{c.field}</span>
                    <h3 className="serif">{c.title}</h3>
                    <p className="excerpt">{c.excerpt}</p>
                    <div className="column-byline">
                      By <strong>{c.author}</strong> · {c.detail}
                    </div>
                  </div>
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

        <section id="registry" className="band">
          <div className="container">
            <div className="section-rule"><span>경고 명단</span></div>
            <p className="section-sub">
              제보·증거가 일정 수준 모인 인물·사업체. <strong>사진</strong>은 본인 동의·검증
              후 게시됩니다. 신원 정보는 모자이크 표기되며 공개 전 당사자 통지·반론 절차를 거칩니다.
            </p>

            <div className="reg-meta">
              <span>총 {scammers.length}건 등록 · 검색 결과 {filtered.length}건</span>
              <a href="#voices">관련 사연 보기 →</a>
            </div>

            <div className="reg-grid">
              {filtered.map((s) => (
                <article key={s.name} className="reg-card">
                  <span className={`img-slot square ${s.cat}`} aria-hidden="true" />
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
            </div>

            {filtered.length === 0 && (
              <div style={{ padding: "28px", textAlign: "center" }}>
                <p style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: 16 }}>
                  해당하는 항목이 없습니다.
                </p>
                <p className="muted" style={{ marginTop: 6 }}>
                  새 사례라면 <a href="#voices" style={{ color: "var(--red)", fontWeight: 600 }}>사연 보내기</a>로 알려주세요.
                </p>
              </div>
            )}

            <div className="case-detail-head">주요 사건 상세</div>
            <div className="case-list">
              {topCases.map((s) => (
                <article key={s.name} className="case-card">
                  <span className={`img-slot tall ${s.cat}`} aria-hidden="true" />
                  <div className="case-content">
                    <div className="case-id">
                      <div>
                        <h3>{s.name}</h3>
                        <p className="case-id-meta">
                          {s.type} · {s.location} · 이명 {s.aliases}
                        </p>
                      </div>
                      <div className="case-status-right">
                        <span className={`tag tag-${s.status}`}>{statusLabel[s.status]}</span>
                        <span className="count">접수 {s.cases}건</span>
                      </div>
                    </div>
                    <div className="case-blocks">
                      <div className="case-block">
                        <h4>사건 개요</h4>
                        <p>{s.overview}</p>
                      </div>
                      <div className="case-block">
                        <h4>주요 패턴</h4>
                        <ul>
                          {s.patterns.map((p) => <li key={p}>{p}</li>)}
                        </ul>
                      </div>
                      <div className="case-block">
                        <h4>진행 상황</h4>
                        <p>{s.progress}</p>
                      </div>
                    </div>
                    <div className="case-foot">
                      <span>피해 추정 <strong>{s.damage}</strong></span>
                      <span>최초 접수 <strong>{s.firstReport}</strong></span>
                      <span>최근 갱신 <strong>{s.lastUpdate}</strong></span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="patterns" className="band band-cream">
          <div className="container">
            <div className="section-rule"><span>사기 유형 도감</span></div>
            <p className="section-sub">
              같은 수법이 다른 이름으로 반복됩니다. <em>수법 · 적신호 · 대응</em>
              세 줄로 정리합니다.
            </p>
            <div className="patterns-meta">
              <span>현재 <strong>{scamTypes.length}종</strong> 등재 · 매주 신규 유형 추가</span>
              <a href="#" style={{ color: "var(--red)", fontWeight: 600 }}>전체 보기 →</a>
            </div>

            <div className="patterns-grid">
              {scamTypes.map((p) => (
                <article key={p.num} className="pattern-card">
                  <div className="pattern-num">{p.num}</div>
                  <h3 className="serif">{p.title}</h3>
                  <dl>
                    <dt>수법</dt><dd>{p.sign}</dd>
                    <dt>적신호</dt><dd>{p.flag}</dd>
                    <dt>대응</dt><dd>{p.act}</dd>
                  </dl>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="voices" className="band">
          <div className="container">
            <div className="section-rule"><span>피해자의 목소리</span></div>
            <p className="section-sub">
              검증 절차가 진행 중이거나 끝난 사연을 1인칭으로 싣습니다. 본인 동의
              없이는 공개하지 않으며, 사실 관계가 다투어지는 부분은 그대로 표기합니다.
            </p>

            <div className="voices-grid">
              {victimStories.map((v) => (
                <article key={v.title} className="voice-card">
                  <span className={`img-slot thumb ${v.cat}`} aria-hidden="true" />
                  <div className="voice-body">
                    <span className="voice-quote" aria-hidden="true">“</span>
                    <h3 className="serif">{v.title}</h3>
                    <p className="voice-text">{v.quote}</p>
                    <div className="voice-foot">
                      <span className="voice-sig">— {v.who} · {v.where}</span>
                      <span>{v.when}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="voices-cta">
              <p>
                <strong>억울한 일이 있다면, 혼자 삼키지 마세요.</strong>{" "}
                사연은 익명으로 보낼 수 있으며, 편집 검토 후 검증 라벨과 함께
                게재합니다.
              </p>
              <a href="#">사연 보내기 →</a>
            </div>
          </div>
        </section>

        <section id="relief" className="band band-cream">
          <div className="container">
            <div className="section-rule"><span>피해자 구제 가이드</span></div>
            <p className="section-sub">
              사기 의심 시점부터 회수까지, 시간 단위로 무엇을 해야 하는지 정리한
              실무 체크리스트입니다.
            </p>

            <div className="relief-grid">
              {reliefSteps.map((step) => (
                <article key={step.num} className="relief-step">
                  <span className="relief-num">{step.num}</span>
                  <h3 className="serif">{step.title}</h3>
                  <span className="relief-when">{step.when}</span>
                  <ul>
                    {step.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="directory" className="band">
          <div className="container">
            <div className="section-rule"><span>분야별 변호사 찾기</span></div>
            <p className="section-sub">
              사기·범죄·피해자 대응에 강한 분야로만 좁혔습니다.
            </p>
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
            <p>
              한인 사회의 범죄·사기 예방과 피해자 구제를 위한 정보 매체.
              인종이 아니라 행위와 증거만 다룹니다.
            </p>
          </div>
          <ul className="footer-links">
            <li><a href="#registry">경고 명단</a></li>
            <li><a href="#patterns">사기 유형 도감</a></li>
            <li><a href="#voices">피해자의 목소리</a></li>
            <li><a href="#relief">피해자 구제 가이드</a></li>
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
