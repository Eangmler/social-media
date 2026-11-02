import axios from "axios";
import crypto from "crypto";
import { AppSettings } from "./types";

export class MetaGraphClient {
  private settings: AppSettings;
  private apiVersion = "v21.0";

  constructor(settings: AppSettings) {
    this.settings = settings;
  }

  /**
   * Publishes an .mp4 video as an Instagram Reel using Meta Graph API's 3-step Container flow.
   */
  async publishReel(videoUrl: string, caption: string): Promise<{ mediaId: string; containerId: string }> {
    const igAccountId = this.settings.instagramAccountId;
    const token = this.settings.metaAccessToken;

    if (!igAccountId || !token) {
      throw new Error("Missing Meta Access Token or Instagram Account ID in Settings.");
    }

    console.log(`[Meta Client] Step 1: Creating Reel container for IG User: ${igAccountId}`);

    // Step 1: Create Video Container
    const createUrl = `https://graph.facebook.com/${this.apiVersion}/${igAccountId}/media`;
    const createRes = await axios.post(createUrl, null, {
      params: {
        media_type: "REELS",
        video_url: videoUrl,
        caption: caption,
        share_to_feed: true,
        access_token: token,
      },
    });

    const containerId = createRes.data?.id;
    if (!containerId) {
      throw new Error(`Failed to create Instagram media container: ${JSON.stringify(createRes.data)}`);
    }

    console.log(`[Meta Client] Step 2: Polling container status for ID: ${containerId}`);

    // Step 2: Poll container status until FINISHED
    let attempts = 0;
    const maxAttempts = 30; // 30 * 4s = 120s max
    let isReady = false;

    while (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 4000));
      attempts++;

      const statusUrl = `https://graph.facebook.com/${this.apiVersion}/${containerId}`;
      const statusRes = await axios.get(statusUrl, {
        params: {
          fields: "status_code,status",
          access_token: token,
        },
      });

      const statusCode = statusRes.data?.status_code;
      console.log(`[Meta Client] Container ${containerId} status: ${statusCode} (attempt ${attempts})`);

      if (statusCode === "FINISHED") {
        isReady = true;
        break;
      } else if (statusCode === "ERROR" || statusCode === "EXPIRED") {
        throw new Error(`Instagram container failed processing with code: ${statusCode}`);
      }
    }

    if (!isReady) {
      throw new Error("Timeout waiting for Instagram video upload container to finish processing.");
    }

    console.log(`[Meta Client] Step 3: Publishing media container: ${containerId}`);

    // Step 3: Publish the container
    const publishUrl = `https://graph.facebook.com/${this.apiVersion}/${igAccountId}/media_publish`;
    const publishRes = await axios.post(publishUrl, null, {
      params: {
        creation_id: containerId,
        access_token: token,
      },
    });

    const publishedMediaId = publishRes.data?.id;
    if (!publishedMediaId) {
      throw new Error(`Publish failed: ${JSON.stringify(publishRes.data)}`);
    }

    return { mediaId: publishedMediaId, containerId };
  }

  /**
   * Sends a Direct Message to a commenter using Meta's Instagram Messaging API.
   * Can target either comment_id (private reply) or igsid (direct message).
   */
  async sendDirectMessage(recipientCommentIdOrIgsid: string, messageText: string, isCommentReply = true): Promise<any> {
    const igAccountId = this.settings.instagramAccountId || "me";
    const token = this.settings.metaAccessToken;

    if (!token) {
      throw new Error("Missing Meta Access Token in Settings.");
    }

    const url = `https://graph.facebook.com/${this.apiVersion}/${igAccountId}/messages`;

    const recipient = isCommentReply
      ? { comment_id: recipientCommentIdOrIgsid }
      : { id: recipientCommentIdOrIgsid };

    const payload = {
      recipient,
      message: {
        text: messageText,
      },
    };

    const res = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return res.data;
  }

  /**
   * Verifies the sha256 signature sent in Meta's 'x-hub-signature-256' header.
   */
  verifyWebhookSignature(rawBody: string, signatureHeader?: string): boolean {
    if (!this.settings.metaAppSecret || !signatureHeader) return true; // bypass if secret unconfigured in dev

    const expectedSignature =
      "sha256=" +
      crypto.createHmac("sha256", this.settings.metaAppSecret).update(rawBody).digest("hex");

    return crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signatureHeader));
  }
}
