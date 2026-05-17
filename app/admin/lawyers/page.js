import { redirect } from "next/navigation";

export default function LawyersRedirect() {
  redirect("/admin/users?role=LAWYER");
}
