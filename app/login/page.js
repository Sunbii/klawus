import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "../../lib/session";
import { loginAction } from "../me/actions";

export const metadata = { title: "K-lawus · 로그인", robots: { index: false } };

export default async function LoginPage({ searchParams }) {
  const session = await getSession();
  if (session.kind === "user") redirect("/me");
  const sp = await searchParams;
  const err = sp?.e;

  return (
    <div className="cms-narrow">
      <h1 className="cms-h1">로그인</h1>
      <p className="cms-muted">변호사·일반 회원 공통 로그인입니다.</p>
      <form action={loginAction} className="cms-form">
        <label className="cms-label">이메일
          <input name="email" type="email" required autoFocus className="cms-input" />
        </label>
        <label className="cms-label">비밀번호
          <input name="password" type="password" required className="cms-input" />
        </label>
        {err && <p className="cms-error">이메일 또는 비밀번호가 일치하지 않습니다.</p>}
        <div className="cms-actions">
          <button type="submit" className="cms-btn-primary">로그인</button>
          <Link href="/signup" className="cms-btn">회원가입</Link>
        </div>
      </form>
      <p className="cms-muted cms-tiny" style={{ marginTop: 12 }}>
        변호사 컬럼 작성은 초청 코드로만 가입할 수 있습니다. 일반 회원은 신용 조회·백그라운드 체크·채권 신용리포팅 요청이 가능합니다.
      </p>
    </div>
  );
}
