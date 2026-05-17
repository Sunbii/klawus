import { redirect } from "next/navigation";
import { getSession } from "../../../lib/session";
import { adminLoginAction } from "../actions";

export const metadata = { title: "K-lawus · 관리자 로그인" };

export default async function AdminLoginPage({ searchParams }) {
  const session = await getSession();
  if (session.kind === "admin") redirect("/admin");
  const sp = await searchParams;
  const err = sp?.e;

  return (
    <div className="cms-narrow">
      <h1 className="cms-h1">관리자 로그인</h1>
      <p className="cms-muted">환경변수 ADMIN_PASSWORD로 인증합니다.</p>
      <form action={adminLoginAction} className="cms-form">
        <label className="cms-label">
          비밀번호
          <input type="password" name="password" autoFocus required className="cms-input" />
        </label>
        {err && <p className="cms-error">비밀번호가 일치하지 않습니다.</p>}
        <button type="submit" className="cms-btn-primary">로그인</button>
      </form>
    </div>
  );
}
