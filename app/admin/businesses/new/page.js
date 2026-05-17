import { requireAdmin } from "../../../../lib/auth";
import BusinessForm from "../BusinessForm";

export default async function NewBusinessPage() {
  await requireAdmin();
  return (
    <div className="cms-wide">
      <h1 className="cms-h1">새 업체 등록</h1>
      <BusinessForm />
    </div>
  );
}
