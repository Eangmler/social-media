import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/store";
import { TikTokClient } from "@/lib/tiktok";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const challenge = searchParams.get("challenge");
  const token = searchParams.get("verify_token");

  const settings = await db.getSettings();

  if (token === settings.tiktokWebhookVerifyToken && challenge) {
    console.log("[TikTok Webhook] Handshake verified successfully.");
    return new Response(challenge, { status: 200 });
  }

  return new Response("OK", { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-tiktok-signature") || undefined;
    const timestamp = req.headers.get("x-tiktok-timestamp") || undefined;

    const settings = await db.getSettings();
    const tiktokClient = new TikTokClient(settings);

    if (!tiktokClient.verifyWebhookSignature(rawBody, signature, timestamp)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);

    const event = payload.event;
    if (event === "comment.create" || payload.type === "comment") {
      const commentData = payload.data || {};
      const commentText = (commentData.text || commentData.content || "").trim();
      const commenterId = commentData.user_id || commentData.open_id || "tiktok_user";

      console.log(`[TikTok Webhook] Comment received: "${commentText}" from ${commenterId}`);

      const triggerWord = (settings.dmTriggerKeyword || "LINK").toUpperCase();

      if (commentText.toUpperCase().includes(triggerWord)) {
        const message = settings.dmResponseTemplate.replace(/\{\{link\}\}/gi, settings.dmTargetUrl);

        await db.addDmLog({
          platform: "tiktok",
          senderId: commenterId,
          senderUsername: commentData.username || commenterId,
          commentText,
          matchedKeyword: triggerWord,
          sentMessage: message,
          status: "sent",
        });

        console.log(`[TikTok Webhook] Queued automated message response for ${commenterId}`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[TikTok Webhook] Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
