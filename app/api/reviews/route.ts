import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/store";

export async function GET() {
  try {
    const reviews = await db.getReviews();
    return NextResponse.json({ reviews });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.testerName || !body.comment) {
      return NextResponse.json(
        { error: "Tester name and feedback comment are required." },
        { status: 400 }
      );
    }

    const created = await db.addReview({
      testerName: body.testerName,
      rating: body.rating || 5,
      category: body.category || "General",
      comment: body.comment.trim(),
    });

    return NextResponse.json({ success: true, review: created });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
