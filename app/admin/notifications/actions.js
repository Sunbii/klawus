"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "../../../lib/auth";
import { retryFailed } from "../../../lib/email";

export async function retryNotificationAction(formData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await retryFailed(id);
  revalidatePath("/admin/notifications");
}
