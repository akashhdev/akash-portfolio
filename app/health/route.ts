export function GET() { return Response.json({ status: "ok", service: "akash-research-portfolio" }, { headers: { "Cache-Control": "no-store" } }); }
