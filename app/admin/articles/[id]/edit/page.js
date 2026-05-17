import { notFound } from "next/navigation";
import { prisma } from "../../../../../lib/db";
import { requireAdmin } from "../../../../../lib/auth";
import ArticleForm from "../../ArticleForm";

export default async function EditArticlePage({ params }) {
  await requireAdmin();
  const { id } = await params;
  const item = await prisma.article.findUnique({ where: { id } });
  if (!item) notFound();
  return (
    <div className="cms-wide">
      <h1 className="cms-h1">글 수정</h1>
      <ArticleForm article={item} />
    </div>
  );
}
