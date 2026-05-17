import { requireAdmin } from "../../../../lib/auth";
import ArticleForm from "../ArticleForm";

export default async function NewArticlePage() {
  await requireAdmin();
  return (
    <div className="cms-wide">
      <h1 className="cms-h1">새 글 등록</h1>
      <ArticleForm />
    </div>
  );
}
