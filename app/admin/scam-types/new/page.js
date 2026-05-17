import { requireAdmin } from "../../../../lib/auth";
import ScamTypeForm from "../ScamTypeForm";

export default async function NewScamTypePage() {
  await requireAdmin();
  return (
    <div className="cms-wide">
      <h1 className="cms-h1">새 사기 유형 등록</h1>
      <ScamTypeForm />
    </div>
  );
}
