import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/store";
import { SocialPlatform } from "@/lib/types";

export async function GET() {
  const competitors = db.getCompetitors();
  return NextResponse.json({ competitors });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { platform, handle, category } = body;

    if (!platform || !handle) {
      return NextResponse.json({ error: "Platform and handle are required." }, { status: 400 });
    }

    const cleanHandle = handle.replace("@", "").trim();
    const profileUrl =
      platform === "instagram"
        ? `https://www.instagram.com/${cleanHandle}/`
        : `https://www.tiktok.com/@${cleanHandle}`;

    const newTarget = db.addCompetitor({
      platform: platform as SocialPlatform,
      handle: cleanHandle,
      profileUrl,
      category: category || "General",
      active: true,
    });

    return NextResponse.json({ success: true, competitor: newTarget });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  db.deleteCompetitor(id);
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  const updated = db.toggleCompetitor(id);
  return NextResponse.json({ success: true, competitor: updated });
}
