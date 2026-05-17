import { notFound, redirect } from "next/navigation";
import { prisma } from "../../../../../lib/db";
import { requireLawyer } from "../../../../../lib/auth";
import ColumnForm from "../../ColumnForm";

export default async function EditOwnColumnPage({ params }) {
  const lawyer = await requireLawyer();
  const { id } = await params;
  const col = await prisma.column.findUnique({ where: { id } });
  if (!col) notFound();
  if (col.authorId !== lawyer.id) redirect("/me");

  return (
    <div className="cms-wide">
      <h1 className="cms-h1">컬럼 수정</h1>
      <ColumnForm column={col} />
    </div>
  );
}
