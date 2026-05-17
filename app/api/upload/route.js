import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { getSession } from "../../../lib/session";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

export async function POST(req) {
  const session = await getSession();
  if (session.kind !== "admin" && !(session.kind === "user" && session.userId)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let form;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "invalid_form" }, { status: 400 });
  }
  const file = form.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "no_file" }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "bad_type", got: file.type }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "too_large", limit: MAX_BYTES }, { status: 413 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const uploaderId = session.kind === "user" ? session.userId : null;

  const rec = await prisma.uploadedFile.create({
    data: {
      filename: String(file.name || "upload").slice(0, 200),
      mimeType: file.type,
      size: buf.length,
      bytes: buf,
      uploaderId,
    },
    select: { id: true, filename: true, mimeType: true, size: true },
  });

  return NextResponse.json({
    id: rec.id,
    url: `/api/files/${rec.id}`,
    filename: rec.filename,
    mimeType: rec.mimeType,
    size: rec.size,
  });
}
