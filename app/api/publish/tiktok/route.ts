import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/store";
import { TikTokClient } from "@/lib/tiktok";

export const maxDuration = 180;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { videoUrl, caption, hook } = body;

    if (!videoUrl || !caption) {
      return NextResponse.json({ error: "videoUrl and caption are required." }, { status: 400 });
    }

    const settings = await db.getSettings();
    if (!settings.tiktokAccessToken) {
      return NextResponse.json(
        { error: "TikTok Creator Access Token must be configured in Settings." },
        { status: 400 }
      );
    }

    const job = await db.addPublishJob({
      platform: "tiktok",
      videoUrl,
      hook: hook || "",
      caption,
      status: "processing",
    });

    const tiktokClient = new TikTokClient(settings);
    const result = await tiktokClient.publishVideo(videoUrl, caption);

    await db.updatePublishJob(job.id, {
      status: "published",
      platformPostId: result.publishId,
      publishedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      jobId: job.id,
      publishId: result.publishId,
    });
  } catch (err: any) {
    console.error("[Publish API - TikTok] Error:", err.message);
    return NextResponse.json(
      {
        success: false,
        error: err.response?.data?.error?.message || err.message,
      },
      { status: 500 }
    );
  }
}
