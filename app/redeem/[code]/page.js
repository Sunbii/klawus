import { notFound } from "next/navigation";
import { prisma } from "../../../lib/db";
import { redeemAction } from "../../me/actions";

export const metadata = { title: "K-lawus · 초청 코드 사용", robots: { index: false } };

const ERR = {
  fields: "이름·이메일·비밀번호(8자 이상)를 모두 입력하세요.",
  code: "이 코드는 유효하지 않거나 이미 사용되었습니다.",
  email: "이미 가입된 이메일입니다. 로그인하세요.",
};

export default async function RedeemPage({ params, searchParams }) {
  const { code } = await params;
  const sp = await searchParams;
  const err = sp?.e;

  const invite = await prisma.inviteCode.findUnique({ where: { code } });
  if (!invite) notFound();
  if (invite.redeemedAt) {
    return (
      <div className="cms-narrow">
        <h1 className="cms-h1">사용된 코드</h1>
        <p className="cms-muted">이 코드는 이미 사용되었습니다. <a className="cms-link" href="/login">로그인</a>으로 가세요.</p>
      </div>
    );
  }

  return (
    <div className="cms-narrow">
      <h1 className="cms-h1">변호사 가입</h1>
      <p className="cms-muted">초청 코드 <span className="cms-mono">{code}</span>로 K-lawus 변호사 계정을 만듭니다.</p>

      <form action={redeemAction} className="cms-form">
        <input type="hidden" name="code" value={code} />

        <label className="cms-label">이름
          <input name="name" required className="cms-input" placeholder="예: 김민수" />
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
          <label className="cms-label">소속 (선택)
            <input name="firm" className="cms-input" placeholder="예: Kim & Park PC" />
          </label>
          <label className="cms-label">분야 (선택)
            <input name="field" className="cms-input" placeholder="예: NJ Real Estate Law" />
          </label>
        </div>
        <div className="cms-grid-2">
          <label className="cms-label">주 (선택)
            <input name="state" className="cms-input" placeholder="예: NY 또는 NJ" />
          </label>
          <label className="cms-label">Bar # (선택)
            <input name="barNumber" className="cms-input" />
          </label>
        </div>
        <label className="cms-label">간단 소개 (선택)
          <textarea name="bio" rows={3} className="cms-input" />
        </label>
        {err && <p className="cms-error">{ERR[err] || "입력값을 확인해주세요."}</p>}
        <div className="cms-actions">
          <button type="submit" className="cms-btn-primary">가입하고 시작하기</button>
        </div>
      </form>
    </div>
  );
}
