import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "../../lib/session";
import { signupAction } from "../me/actions";

export const metadata = { title: "K-lawus · 회원가입", robots: { index: false } };

const ERR = {
  fields: "이름·이메일·비밀번호(8자 이상)를 모두 입력하세요.",
  email: "이미 가입된 이메일입니다.",
};

export default async function SignupPage({ searchParams }) {
  const session = await getSession();
  if (session.kind === "user") redirect("/me");
  const sp = await searchParams;
  const err = sp?.e;

  return (
    <div className="cms-narrow">
      <h1 className="cms-h1">회원가입</h1>
      <p className="cms-muted">
        일반 회원으로 가입하시면 신용 조회·백그라운드 체크·채권 신용리포팅을 신청하실 수 있습니다.
        변호사 컬럼 작성은 별도 초청 코드가 필요합니다.
      </p>
      <form action={signupAction} className="cms-form">
        <label className="cms-label">이름
          <input name="name" required className="cms-input" placeholder="예: 김지수" />
        </label>
        <div className="cms-grid-2">
          <label className="cms-label">이메일
            <input name="email" type="email" required className="cms-input" />
          </label>
          <label className="cms-label">비밀번호 (8자 이상)
            <input name="password" type="password" minLength={8} required className="cms-input" />
          </label>
        </div>
        <div className="cms-grid-2">
          <label className="cms-label">전화 (예: 201-555-0123)
            <input name="phone" className="cms-input" required />
          </label>
          <label className="cms-label">주
            <select name="state" required className="cms-input" defaultValue="">
              <option value="" disabled>선택</option>
              <option value="NY">뉴욕 (NY)</option>
              <option value="NJ">뉴저지 (NJ)</option>
              <option value="OTHER">그 외</option>
            </select>
          </label>
        </div>
        {err && <p className="cms-error">{ERR[err] || "입력값을 확인해주세요."}</p>}
        <div className="cms-actions">
          <button type="submit" className="cms-btn-primary">가입하고 시작하기</button>
          <Link href="/login" className="cms-btn">기존 계정으로 로그인</Link>
        </div>
      </form>
    </div>
  );
}
