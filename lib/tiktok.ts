import axios from "axios";
import crypto from "crypto";
import { AppSettings } from "./types";

export class TikTokClient {
  private settings: AppSettings;
  private baseUrl = "https://open.tiktokapis.com/v2";

  constructor(settings: AppSettings) {
    this.settings = settings;
  }

  /**
   * Publishes a video to TikTok via the TikTok Content Posting API using PULL_FROM_URL.
   */
  async publishVideo(videoUrl: string, caption: string): Promise<{ publishId: string }> {
    const token = this.settings.tiktokAccessToken;

    if (!token) {
      throw new Error("Missing TikTok Access Token in Settings.");
    }

    console.log(`[TikTok Client] Initiating video publish for URL: ${videoUrl}`);

    const initUrl = `${this.baseUrl}/post/publish/video/init/`;
    const payload = {
      post_info: {
        title: caption.slice(0, 150), // TikTok caption limit
        privacy_level: "PUBLIC_TO_EVERYONE",
        disable_duet: false,
        disable_stitch: false,
        disable_comment: false,
        video_cover_timestamp_ms: 1000,
      },
      source_info: {
        source: "PULL_FROM_URL",
        video_url: videoUrl,
      },
    };

    const res = await axios.post(initUrl, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json; charset=UTF-8",
      },
    });

    if (res.data?.error?.code && res.data.error.code !== "ok") {
      throw new Error(`TikTok Publish Init Error: ${res.data.error.message} (${res.data.error.code})`);
    }

    const publishId = res.data?.data?.publish_id;
    if (!publishId) {
      throw new Error(`TikTok Publish Init failed to return publish_id: ${JSON.stringify(res.data)}`);
    }

    console.log(`[TikTok Client] Successfully submitted publish request: ${publishId}`);
    return { publishId };
  }

  /**
   * Checks the status of a TikTok video publication request.
   */
  async checkPublishStatus(publishId: string): Promise<string> {
    const token = this.settings.tiktokAccessToken;
    if (!token) throw new Error("Missing TikTok Access Token.");

    const statusUrl = `${this.baseUrl}/post/publish/status/fetch/`;
    const res = await axios.post(
      statusUrl,
      { publish_id: publishId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json; charset=UTF-8",
        },
      }
    );

    return res.data?.data?.status || "PROCESSING_UPLOAD";
  }

  /**
   * Verifies incoming webhook signature from TikTok.
   */
  verifyWebhookSignature(rawBody: string, signature?: string, timestamp?: string): boolean {
    if (!this.settings.tiktokAppSecret || !signature || !timestamp) return true;

    const signaturePayload = `${this.settings.tiktokAppSecret}${timestamp}${rawBody}`;
    const expected = crypto.createHash("sha256").update(signaturePayload).digest("hex");

    return expected === signature;
  }
}
