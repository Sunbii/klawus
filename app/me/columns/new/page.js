import { requireLawyer } from "../../../../lib/auth";
import ColumnForm from "../ColumnForm";

export default async function NewColumnPage() {
  await requireLawyer();
  return (
    <div className="cms-wide">
      <h1 className="cms-h1">새 컬럼 작성</h1>
      <ColumnForm />
    </div>
  );
}
