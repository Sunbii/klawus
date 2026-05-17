import Link from "next/link";
import { requireUser } from "../../lib/auth";
import { logoutAction } from "./actions";

export const metadata = {
  title: "K-lawus · 마이페이지",
  robots: { index: false, follow: false },
};

export default async function MeLayout({ children }) {
  const user = await requireUser();
  const isLawyer = user.role === "LAWYER";
  return (
    <div className="cms-shell">
      <header className="cms-header">
        <Link href="/" className="cms-brand">
          K&middot;lawus <span>{isLawyer ? "변호사" : "회원"}</span>
        </Link>
        <nav className="cms-nav">
          <span className="cms-muted">{user.name} · {user.email}</span>
          <Link href="/me">대시보드</Link>
          {isLawyer && <Link href="/me/columns/new">새 컬럼</Link>}
          <Link href="/me/services">내 서비스 요청</Link>
          <Link href="/me/services/new">서비스 신청</Link>
          <form action={logoutAction} style={{ display: "inline" }}>
            <button type="submit" className="cms-link-btn">로그아웃</button>
          </form>
        </nav>
      </header>
      <main className="cms-main">{children}</main>
    </div>
  );
}
