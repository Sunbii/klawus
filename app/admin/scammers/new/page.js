import { requireAdmin } from "../../../../lib/auth";
import ScammerForm from "../ScammerForm";

export default async function NewScammerPage() {
  await requireAdmin();
  return (
    <div className="cms-wide">
      <h1 className="cms-h1">새 경고 사례 등록</h1>
      <ScammerForm />
    </div>
  );
}
