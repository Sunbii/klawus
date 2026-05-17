import { requireAdmin } from "../../../../lib/auth";
import AlertForm from "../AlertForm";

export default async function NewAlertPage() {
  await requireAdmin();
  return (
    <div className="cms-wide">
      <h1 className="cms-h1">새 주의보 등록</h1>
      <AlertForm />
    </div>
  );
}
