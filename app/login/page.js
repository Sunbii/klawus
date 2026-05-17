import { redirect } from "next/navigation";
import { getSession } from "../../lib/session";
import { lawyerLoginAction } from "../me/actions";

export const metadata = { title: "K-lawus · 변호사 로그인", robots: { index: false } };

export default async function LoginPage({ searchParams }) {
  const session = await getSession();
  if (session.kind === "lawyer") redirect("/me");
  const sp = await searchParams;
  const err = sp?.e;

  return (
    <div className="cms-narrow">
      <h1 className="cms-h1">변호사 로그인</h1>
      <p className="cms-muted">초청 코드로 가입한 변호사 계정으로 로그인합니다.</p>
      <form action={lawyerLoginAction} className="cms-form">
        <label className="cms-label">이메일
          <input name="email" type="email" required autoFocus className="cms-input" />
        </label>
        <label className="cms-label">비밀번호
          <input name="password" type="password" required className="cms-input" />
        </label>
        {err && <p className="cms-error">이메일 또는 비밀번호가 일치하지 않습니다.</p>}
        <div className="cms-actions">
          <button type="submit" className="cms-btn-primary">로그인</button>
        </div>
      </form>
      <p className="cms-muted cms-tiny" style={{ marginTop: 12 }}>
        가입은 초청 코드로만 가능합니다. 코드는 K-lawus 편집부가 직접 전달합니다.
      </p>
    </div>
  );
}
