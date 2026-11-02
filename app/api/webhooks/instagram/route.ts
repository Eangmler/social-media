import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/store";
import { MetaGraphClient } from "@/lib/meta";

/**
 * Meta Webhook verification handshake (GET request from Meta Developer Dashboard).
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const settings = db.getSettings();

  if (mode === "subscribe" && token === settings.metaWebhookVerifyToken) {
    console.log("[Instagram Webhook] Handshake verified successfully.");
    return new Response(challenge, { status: 200 });
  }

  return new Response("Forbidden", { status: 403 });
}

/**
 * Meta Webhook event receiver for Instagram Comments (POST request).
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-hub-signature-256") || undefined;

    const settings = db.getSettings();
    const metaClient = new MetaGraphClient(settings);

    // Optional cryptographic validation in production
    if (!metaClient.verifyWebhookSignature(rawBody, signature)) {
      console.warn("[Instagram Webhook] Invalid signature rejected.");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);

    if (payload.object !== "instagram") {
      return NextResponse.json({ received: true });
    }

    const triggerWord = (settings.dmTriggerKeyword || "LINK").toUpperCase();

    // Iterate through Meta webhook entry events
    for (const entry of payload.entry || []) {
      for (const change of entry.changes || []) {
        if (change.field === "comments") {
          const comment = change.value;
          const commentText = (comment?.text || "").trim();
          const commentId = comment?.id;
          const sender = comment?.from || {};

          console.log(`[Instagram Webhook] New comment detected: "${commentText}" from @${sender.username || sender.id}`);

          // Check if comment contains trigger keyword
          if (commentText.toUpperCase().includes(triggerWord)) {
            console.log(`[Instagram Webhook] Matched keyword '${triggerWord}'. Preparing automated DM response...`);

            const personalizedMessage = settings.dmResponseTemplate.replace(
              /\{\{link\}\}/gi,
              settings.dmTargetUrl
            );

            try {
              // Send private message via Meta Messaging Send API targeting the comment_id
              await metaClient.sendDirectMessage(commentId, personalizedMessage, true);

              db.addDmLog({
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

              db.addDmLog({
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
