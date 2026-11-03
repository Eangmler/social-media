import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/store";
import { MetaGraphClient } from "@/lib/meta";

export const maxDuration = 180;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { videoUrl, caption, hook, vault } = body;

    if (!videoUrl || !caption) {
      return NextResponse.json({ error: "videoUrl and caption are required." }, { status: 400 });
    }

    let settings = await db.getSettings();
    if (vault) {
      settings = { ...settings, ...vault };
    }
    if (!settings.metaAccessToken || !settings.instagramAccountId) {
      return NextResponse.json(
        { error: "Meta Access Token and Instagram Account ID must be configured in Settings." },
        { status: 400 }
      );
    }

    const job = await db.addPublishJob({
      platform: "instagram",
      videoUrl,
      hook: hook || "",
      caption,
      status: "processing",
    });

    const metaClient = new MetaGraphClient(settings);
    const result = await metaClient.publishReel(videoUrl, caption);

    await db.updatePublishJob(job.id, {
      status: "published",
      platformPostId: result.mediaId,
      publishedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      jobId: job.id,
      mediaId: result.mediaId,
      containerId: result.containerId,
    });
  } catch (err: any) {
    console.error("[Publish API - Instagram] Error:", err.message);
    return NextResponse.json(
      {
        success: false,
        error: err.response?.data?.error?.message || err.message,
      },
      { status: 500 }
    );
  }
}
