import { notFound } from "next/navigation";
import { prisma } from "../../../../../lib/db";
import { requireAdmin } from "../../../../../lib/auth";
import BusinessForm from "../../BusinessForm";

export default async function EditBusinessPage({ params }) {
  await requireAdmin();
  const { id } = await params;
  const item = await prisma.honestBusiness.findUnique({ where: { id } });
  if (!item) notFound();
  return (
    <div className="cms-wide">
      <h1 className="cms-h1">업체 수정</h1>
      <BusinessForm business={item} />
    </div>
  );
}
