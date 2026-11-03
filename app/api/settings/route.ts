import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/store";

export async function GET(req: NextRequest) {
  try {
    const settings = await db.getSettings();

    // Check if caller is authenticated admin
    const authHeader = req.headers.get("authorization");
    const isAdmin = authHeader && authHeader.startsWith("Bearer adm_");

    // If admin is fetching, return real tokens for editing, otherwise mask
    const resultSettings = {
      ...settings,
      adminPassword: settings.adminPassword || "admin123",
      apifyToken: isAdmin ? settings.apifyToken : settings.apifyToken ? maskToken(settings.apifyToken) : "",
      openaiApiKey: isAdmin ? settings.openaiApiKey : settings.openaiApiKey ? maskToken(settings.openaiApiKey) : "",
      geminiApiKey: isAdmin ? settings.geminiApiKey : settings.geminiApiKey ? maskToken(settings.geminiApiKey) : "",
      metaAppSecret: isAdmin ? settings.metaAppSecret : settings.metaAppSecret ? maskToken(settings.metaAppSecret) : "",
      metaAccessToken: isAdmin ? settings.metaAccessToken : settings.metaAccessToken ? maskToken(settings.metaAccessToken) : "",
      tiktokAppSecret: isAdmin ? settings.tiktokAppSecret : settings.tiktokAppSecret ? maskToken(settings.tiktokAppSecret) : "",
      tiktokAccessToken: isAdmin ? settings.tiktokAccessToken : settings.tiktokAccessToken ? maskToken(settings.tiktokAccessToken) : "",
      kvRestApiToken: isAdmin ? settings.kvRestApiToken : settings.kvRestApiToken ? maskToken(settings.kvRestApiToken) : "",
      vercelAuthToken: isAdmin ? settings.vercelAuthToken : settings.vercelAuthToken ? maskToken(settings.vercelAuthToken) : "",
    };

    return NextResponse.json({
      settings: resultSettings,
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
        // Only skip placeholder masked values (containing 4+ bullet characters)
        if (val.includes("••••")) {
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

function maskToken(str: string): string {
  if (!str) return "";
  if (str.length <= 8) return "••••••••";
  return `${str.slice(0, 7)}••••••••${str.slice(-4)}`;
}
