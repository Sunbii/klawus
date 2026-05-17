import { prisma } from "../../../../lib/db";

export async function GET(_req, { params }) {
  const { id } = await params;
  const file = await prisma.uploadedFile.findUnique({ where: { id } });
  if (!file) return new Response("Not found", { status: 404 });

  return new Response(file.bytes, {
    headers: {
      "Content-Type": file.mimeType,
      "Content-Length": String(file.size),
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Disposition": `inline; filename="${file.filename.replace(/"/g, "")}"`,
    },
  });
}
