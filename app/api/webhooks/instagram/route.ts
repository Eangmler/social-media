import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/store";
import { MetaGraphClient } from "@/lib/meta";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const settings = await db.getSettings();

  if (mode === "subscribe" && token === settings.metaWebhookVerifyToken) {
    console.log("[Instagram Webhook] Handshake verified successfully.");
    return new Response(challenge, { status: 200 });
  }

  return new Response("Forbidden", { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-hub-signature-256") || undefined;

    const settings = await db.getSettings();
    const metaClient = new MetaGraphClient(settings);

    if (!metaClient.verifyWebhookSignature(rawBody, signature)) {
      console.warn("[Instagram Webhook] Invalid signature rejected.");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);

    if (payload.object !== "instagram") {
      return NextResponse.json({ received: true });
    }

    const triggerWord = (settings.dmTriggerKeyword || "LINK").toUpperCase();

    for (const entry of payload.entry || []) {
      for (const change of entry.changes || []) {
        if (change.field === "comments") {
          const comment = change.value;
          const commentText = (comment?.text || "").trim();
          const commentId = comment?.id;
          const sender = comment?.from || {};

          console.log(`[Instagram Webhook] New comment: "${commentText}" from @${sender.username || sender.id}`);

          if (commentText.toUpperCase().includes(triggerWord)) {
            const personalizedMessage = settings.dmResponseTemplate.replace(
              /\{\{link\}\}/gi,
              settings.dmTargetUrl
            );

            try {
              await metaClient.sendDirectMessage(commentId, personalizedMessage, true);

              await db.addDmLog({
                platform: "instagram",
                senderId: sender.id || "unknown",
                senderUsername: sender.username || "user",
                commentText: commentText,
                matchedKeyword: triggerWord,
                sentMessage: personalizedMessage,
                status: "sent",
              });

              console.log(`[Instagram Webhook] Successfully sent automated DM to @${sender.username}`);
            } catch (sendErr: any) {
              console.error("[Instagram Webhook] Failed to send automated DM:", sendErr.message);

              await db.addDmLog({
                platform: "instagram",
                senderId: sender.id || "unknown",
                senderUsername: sender.username || "user",
                commentText: commentText,
                matchedKeyword: triggerWord,
                sentMessage: personalizedMessage,
                status: "failed",
                error: sendErr.response?.data?.error?.message || sendErr.message,
              });
            }
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("[Instagram Webhook] Error processing event:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
