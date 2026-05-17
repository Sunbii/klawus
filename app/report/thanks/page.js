export const metadata = { title: "K-lawus · 제보 접수됨" };

export default function ThanksPage() {
  return (
    <div className="container" style={{ maxWidth: 640, padding: "60px 20px", textAlign: "center" }}>
      <h1 className="cms-h1">제보 접수됨</h1>
      <p className="cms-muted">
        보내주신 사례는 편집부 검토 대기열로 들어갔습니다. 추가 확인이 필요한 경우
        남기신 이메일로 연락드립니다.
      </p>
      <p style={{ marginTop: 20 }}>
        <a href="/" className="cms-link">← 홈으로</a>
      </p>
    </div>
  );
}
