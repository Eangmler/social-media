import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/store";

export async function GET(req: NextRequest) {
  try {
    let settings = await db.getSettings();

    // Check cookie fallback
    const cookieVault = req.cookies.get("viralpulse_vault")?.value;
    if (cookieVault) {
      try {
        const parsed = JSON.parse(decodeURIComponent(cookieVault));
        settings = { ...settings, ...parsed };
      } catch (e) {}
    }

    // Return the actual settings so the admin can view and edit their keys
    return NextResponse.json({
      settings,
      status: {
        hasApifyToken: !!settings.apifyToken,
        hasOpenaiApiKey: !!settings.openaiApiKey,
        hasGeminiApiKey: !!settings.geminiApiKey,
        hasMetaAccessToken: !!settings.metaAccessToken,
        hasTiktokAccessToken: !!settings.tiktokAccessToken,
        hasCloudKv: !!(settings.kvRestApiUrl && settings.kvRestApiToken),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const updates = await req.json();

    const sanitizedUpdates: Record<string, any> = {};
    for (const [key, val] of Object.entries(updates)) {
      if (typeof val === "string") {
        if (val.includes("••••") || val.includes("...")) {
          continue;
        }
      }
      sanitizedUpdates[key] = val;
    }

    const updated = await db.updateSettings(sanitizedUpdates);
    return NextResponse.json({ success: true, settings: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
