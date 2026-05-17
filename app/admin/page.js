import Link from "next/link";
import { prisma } from "../../lib/db";
import { requireAdmin } from "../../lib/auth";

export default async function AdminHome() {
  await requireAdmin();
  const [
    invitesTotal,
    invitesRedeemed,
    lawyers,
    members,
    columns,
    columnsPublished,
    scammers,
    services,
    servicesPending,
  ] = await Promise.all([
    prisma.inviteCode.count(),
    prisma.inviteCode.count({ where: { redeemedAt: { not: null } } }),
    prisma.user.count({ where: { role: "LAWYER" } }),
    prisma.user.count({ where: { role: "MEMBER" } }),
    prisma.column.count(),
    prisma.column.count({ where: { published: true } }),
    prisma.scammer.count(),
    prisma.serviceRequest.count(),
    prisma.serviceRequest.count({ where: { status: "PENDING" } }),
  ]);

  return (
    <div className="cms-wide">
      <h1 className="cms-h1">대시보드</h1>
      <div className="cms-stat-grid">
        <Link href="/admin/invites" className="cms-stat">
          <span className="cms-stat-label">초청 코드</span>
          <span className="cms-stat-num">{invitesRedeemed} / {invitesTotal}</span>
          <span className="cms-stat-sub">사용됨 / 전체</span>
        </Link>
        <Link href="/admin/users" className="cms-stat">
          <span className="cms-stat-label">사용자</span>
          <span className="cms-stat-num">{lawyers} / {members}</span>
          <span className="cms-stat-sub">변호사 / 일반 회원</span>
        </Link>
        <Link href="/admin/columns" className="cms-stat">
          <span className="cms-stat-label">컬럼</span>
          <span className="cms-stat-num">{columnsPublished} / {columns}</span>
          <span className="cms-stat-sub">공개 / 전체</span>
        </Link>
        <Link href="/admin/scammers" className="cms-stat">
          <span className="cms-stat-label">경고 명단</span>
          <span className="cms-stat-num">{scammers}</span>
          <span className="cms-stat-sub">등록 사례 수</span>
        </Link>
        <Link href="/admin/services" className="cms-stat">
          <span className="cms-stat-label">서비스 요청</span>
          <span className="cms-stat-num">{servicesPending} / {services}</span>
          <span className="cms-stat-sub">대기 / 전체</span>
        </Link>
      </div>
    </div>
  );
}
