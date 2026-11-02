import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/store";

export async function GET() {
  const calendar = await db.getCalendar();
  return NextResponse.json({ calendar });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing concept id or status" }, { status: 400 });
    }

    const updated = await db.updateConceptStatus(id, status);
    return NextResponse.json({ success: true, concept: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
