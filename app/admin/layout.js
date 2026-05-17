import Link from "next/link";
import { getSession } from "../../lib/session";
import { adminLogoutAction } from "./actions";

export const metadata = {
  title: "K-lawus · 관리자",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }) {
  const session = await getSession();
  const isAdmin = session.kind === "admin";

  return (
    <div className="cms-shell">
      <header className="cms-header">
        <Link href="/" className="cms-brand">K&middot;lawus <span>관리자</span></Link>
        {isAdmin && (
          <nav className="cms-nav">
            <Link href="/admin">대시보드</Link>
            <Link href="/admin/invites">초청 코드</Link>
            <Link href="/admin/users">사용자</Link>
            <Link href="/admin/columns">컬럼</Link>
            <Link href="/admin/scammers">경고 명단</Link>
            <Link href="/admin/services">서비스 요청</Link>
            <form action={adminLogoutAction} style={{ display: "inline" }}>
              <button type="submit" className="cms-link-btn">로그아웃</button>
            </form>
          </nav>
        )}
      </header>
      <main className="cms-main">{children}</main>
    </div>
  );
}
