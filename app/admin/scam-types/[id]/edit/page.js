import { notFound } from "next/navigation";
import { prisma } from "../../../../../lib/db";
import { requireAdmin } from "../../../../../lib/auth";
import ScamTypeForm from "../../ScamTypeForm";

export default async function EditScamTypePage({ params }) {
  await requireAdmin();
  const { id } = await params;
  const item = await prisma.scamType.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div className="cms-wide">
      <h1 className="cms-h1">사기 유형 수정</h1>
      <ScamTypeForm scamType={item} />
    </div>
  );
}
