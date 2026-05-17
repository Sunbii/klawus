import { notFound } from "next/navigation";
import { prisma } from "../../../../../lib/db";
import { requireAdmin } from "../../../../../lib/auth";
import AlertForm from "../../AlertForm";

export default async function EditAlertPage({ params }) {
  await requireAdmin();
  const { id } = await params;
  const item = await prisma.scamAlert.findUnique({ where: { id } });
  if (!item) notFound();
  return (
    <div className="cms-wide">
      <h1 className="cms-h1">주의보 수정</h1>
      <AlertForm alert={item} />
    </div>
  );
}
