import { saveOwnColumnAction } from "../actions";
import ColumnEditor from "./ColumnEditor";

export default function ColumnForm({ column }) {
  return <ColumnEditor column={column} action={saveOwnColumnAction} cancelHref="/me" />;
}
