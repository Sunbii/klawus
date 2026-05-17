export async function GET() {
  return Response.json({
    ok: true,
    service: "klawus",
    timestamp: new Date().toISOString()
  });
}
