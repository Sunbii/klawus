import { notFound } from "next/navigation";
import { prisma } from "../../../../../lib/db";
import { requireAdmin } from "../../../../../lib/auth";
import ScammerForm from "../../ScammerForm";

export default async function EditScammerPage({ params }) {
  await requireAdmin();
  const { id } = await params;
  const scammer = await prisma.scammer.findUnique({ where: { id } });
  if (!scammer) notFound();

  return (
    <div className="cms-wide">
      <h1 className="cms-h1">경고 사례 수정</h1>
      <ScammerForm scammer={scammer} />
    </div>
  );
}
