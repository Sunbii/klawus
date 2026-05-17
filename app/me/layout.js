import Link from "next/link";
import { requireLawyer } from "../../lib/auth";
import { lawyerLogoutAction } from "./actions";

export const metadata = {
  title: "K-lawus · 변호사",
  robots: { index: false, follow: false },
};

export default async function MeLayout({ children }) {
  const lawyer = await requireLawyer();
  return (
    <div className="cms-shell">
      <header className="cms-header">
        <Link href="/" className="cms-brand">K&middot;lawus <span>변호사</span></Link>
        <nav className="cms-nav">
          <span className="cms-muted">{lawyer.name} · {lawyer.email}</span>
          <Link href="/me">내 컬럼</Link>
          <Link href="/me/columns/new">새 컬럼</Link>
          <form action={lawyerLogoutAction} style={{ display: "inline" }}>
            <button type="submit" className="cms-link-btn">로그아웃</button>
          </form>
        </nav>
      </header>
      <main className="cms-main">{children}</main>
    </div>
  );
}
