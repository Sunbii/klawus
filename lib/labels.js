import { prisma } from "./db";

// Canonical label keys with Korean defaults. Admin can override any value
// via /admin/labels; getLabels() merges DB overrides on top of these.
export const DEFAULT_LABELS = {
  // Mission statement
  "site.tagline": "변호사들의 노력으로 한인 사회를 맑게 하는 장치",
  "site.subtagline": "행위와 증거만 다룬다. 한인 사회 범죄·사기 예방과 피해자 구제 중심.",

  // Top nav
  "nav.home":        "주요 사건",
  "nav.news":        "사기 뉴스",
  "nav.columns":     "변호사 컬럼",
  "nav.registry":    "사기꾼 명단",
  "nav.patterns":    "사기 기법 도감",
  "nav.voices":      "이렇게 당했다",
  "nav.relief":      "피해자 구제 절차",
  "nav.directory":   "변호사 찾기",
  "nav.articles":    "사기사·사례·가이드",
  "nav.businesses":  "정직한 업체",
  "nav.publicNotice": "사기꾼 공시",
  "nav.search":      "검색",
  "nav.report":      "사기 신고",

  // Section headings on home
  "section.news":         "사기 뉴스",
  "section.columns":      "변호사별 법률 칼럼",
  "section.registry":     "사기꾼 명단",
  "section.patterns":     "사기 기법 (이렇게 속인다)",
  "section.voices":       "이렇게 당했다",
  "section.relief":       "피해자 구제 절차",
  "section.directory":    "분야별 변호사 찾기",
  "section.articles.history":    "미주 한인사회 사기사",
  "section.articles.cases":      "사기 사례",
  "section.articles.prevention": "사기 대처방법 (전후)",
  "section.articles.safetx":     "사기를 피할 수 있는 거래 방법",
  "section.businesses":   "정직한 업체",
  "section.alerts":       "사기 주의보",
  "section.publicNotice": "사기꾼 공시",

  // Service labels
  "service.creditCheck":        "신용 조회",
  "service.backgroundCheck":    "신원 조회",
  "service.debtReporting":      "채무자·채무액 등록 (신용보고)",

  // CTAs
  "cta.report":    "사기 사례 제보",
  "cta.search":    "사기꾼 검색",
  "cta.signup":    "회원가입",
  "cta.login":     "로그인",
  "cta.adInquiry": "광고 문의",
};

// Allow only the canonical keys to be edited; unknown keys are ignored.
export function isKnownLabelKey(k) {
  return Object.prototype.hasOwnProperty.call(DEFAULT_LABELS, k);
}

let _cache = null;
let _cacheAt = 0;
const CACHE_MS = 30 * 1000;

export async function getLabels() {
  const now = Date.now();
  if (_cache && now - _cacheAt < CACHE_MS) return _cache;
  let overrides = {};
  try {
    const rows = await prisma.siteLabel.findMany();
    overrides = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  } catch (e) {
    console.error("labels load failed:", e?.message);
  }
  _cache = { ...DEFAULT_LABELS, ...overrides };
  _cacheAt = now;
  return _cache;
}

export function invalidateLabelCache() {
  _cache = null;
  _cacheAt = 0;
}

// Sync default lookup with fallback when DB read isn't available
export function defaultLabel(key) {
  return DEFAULT_LABELS[key] || key;
}
