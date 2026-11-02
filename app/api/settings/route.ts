import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/store";

export async function GET() {
  const settings = await db.getSettings();

  const maskedSettings = {
    ...settings,
    apifyToken: settings.apifyToken ? maskToken(settings.apifyToken) : "",
    openaiApiKey: settings.openaiApiKey ? maskToken(settings.openaiApiKey) : "",
    geminiApiKey: settings.geminiApiKey ? maskToken(settings.geminiApiKey) : "",
    metaAppSecret: settings.metaAppSecret ? maskToken(settings.metaAppSecret) : "",
    metaAccessToken: settings.metaAccessToken ? maskToken(settings.metaAccessToken) : "",
    tiktokAppSecret: settings.tiktokAppSecret ? maskToken(settings.tiktokAppSecret) : "",
    tiktokAccessToken: settings.tiktokAccessToken ? maskToken(settings.tiktokAccessToken) : "",
    kvRestApiToken: settings.kvRestApiToken ? maskToken(settings.kvRestApiToken) : "",
    vercelAuthToken: settings.vercelAuthToken ? maskToken(settings.vercelAuthToken) : "",
  };

  return NextResponse.json({ settings: maskedSettings });
}

export async function POST(req: NextRequest) {
  try {
    const updates = await req.json();

    const sanitizedUpdates: Record<string, any> = {};
    for (const [key, val] of Object.entries(updates)) {
      if (typeof val === "string" && (val.includes("••••") || val.includes("..."))) {
        continue;
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
  if (str.length <= 8) return "••••••••";
  return `${str.slice(0, 7)}••••••••${str.slice(-4)}`;
}
